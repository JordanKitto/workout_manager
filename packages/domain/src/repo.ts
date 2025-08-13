import { newId } from "./lib/id";
import {
    Exercise, ID, SessionState, SetEntry, Workout, WorkoutTemplate
} from "./models";
import { validateExercise, validateWorkout } from "./validation";

class InMemoryRepo {
    private exercises = new Map<ID, Exercise>();
    private templates = new Map<ID, WorkoutTemplate>();
    private workouts = new Map<ID, Workout>();
    private session: SessionState = { active: false, activeExerciseIdx: 0 };

    getExerciseName(id: ID): string | undefined {
        const ex = this.exercises.get(id);
        return ex ? ex.name : undefined;
    }

    // NEW: set default targets after creating a template
    setTemplateTargets(templateId: ID, targets: Record<ID, { reps: number; weight: number }>) {
        const t = this.templates.get(templateId);
        if (!t) throw new Error("template not found");
        t.targets = { ...(t.targets ?? {}), ...targets };
    }

    // NEW: read helper
    getTemplateTargets(templateId: ID): Record<ID, { reps: number; weight: number }> | undefined {
        return this.templates.get(templateId)?.targets;
    }

    // Accept rich objects from DEFAULT_EXERCISES
    seedExercises(list: Array<Pick<Exercise, "name" | "muscleGroup" | "equipment" | "type">>) {
        list.forEach(item => {
            const e: Exercise = {
                id: newId(),
                name: item.name,
                muscleGroup: item.muscleGroup,
                equipment: item.equipment,
                type: item.type
            };
            const errs = validateExercise(e);
            if (errs.length) throw new Error(errs.join("; "));
            this.exercises.set(e.id, e);
        });
    }

    // Helper to resolve by name
    getExerciseByName(name: string): Exercise | undefined {
        for (const ex of this.exercises.values()) {
            if (ex.name === name) return ex;
        }
        return undefined;
    }

    makeTemplate(name: string, dayIndex: number, exerciseNames: string[]): WorkoutTemplate {
        const ids: ID[] = exerciseNames.map(n => {
            const e = this.getExerciseByName(n);
            if (!e) throw new Error(`exercise not found: ${n}`);
            return e.id;
        });
        const t: WorkoutTemplate = { id: newId(), name, dayIndex, exercises: ids };
        this.templates.set(t.id, t);
        return t;
    }

    listExercises(): Exercise[] {
        return Array.from(this.exercises.values());
    }

    getExercise(id: ID): Exercise | undefined {
        return this.exercises.get(id);
    }

    listTemplates(): WorkoutTemplate[] {
        return Array.from(this.templates.values()).sort((a, b) => a.dayIndex - b.dayIndex);
    }

    startSessionFromTemplate(templateId: ID, dateISO: string): Workout {
        const t = this.templates.get(templateId);
        if (!t) throw new Error("template not found");
        const w: Workout = {
            id: newId(),
            dateISO,
            templateId,
            notes: "",
            logs: t.exercises.map((exId: ID) => ({ exerciseId: exId, sets: [] }))
        };
        const errs = validateWorkout(w);
        if (errs.length) throw new Error("invalid workout: " + errs.join("; "));
        this.workouts.set(w.id, w);
        this.session = { active: true, startedAt: Date.now(), activeExerciseIdx: 0, workoutId: w.id };
        return w;
    }

    addSet(workoutId: ID, exerciseIdx: number, set: SetEntry) {
        const w = this.workouts.get(workoutId);
        if (!w) throw new Error("workout not found");
        w.logs[exerciseIdx].sets.push(set);
    }

    moveExercise(workoutId: ID, from: number, to: number) {
        const w = this.workouts.get(workoutId);
        if (!w) throw new Error("workout not found");
        const [item] = w.logs.splice(from, 1);
        w.logs.splice(to, 0, item);
        if (this.session.workoutId === workoutId) this.session.activeExerciseIdx = to;
    }

    setRestPreset(sec: number) {
        if (!this.session.active) return;
        this.session.restPresetSec = sec;
        this.session.restEndsAt = Date.now() + sec * 1000;
    }

    finishSession(): Workout | undefined {
        if (!this.session.active || !this.session.workoutId) return;
        const w = this.workouts.get(this.session.workoutId);
        this.session = { active: false, activeExerciseIdx: 0 };
        if (w) w.notes = (w.notes || "").trim();
        return w;
    }

    getSession(): SessionState { return this.session; }
    getWorkout(id: ID): Workout | undefined { return this.workouts.get(id); }
    listWorkouts(): Workout[] {
        return Array.from(this.workouts.values()).sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    }
}

export const repo = new InMemoryRepo();

import { Exercise, ExerciseLog, SetEntry, Workout } from "./models";

export function isISODate(s: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function validateSetEntry(s: SetEntry): string[] {
    const e: string[] = [];
    if (!Number.isFinite(s.reps) || s.reps <= 0) e.push("reps must be > 0");
    if (!Number.isFinite(s.weight) || s.weight < 0) e.push("weight must be >= 0");
    return e;
}

export function validateExercise(x: Exercise): string[] {
    const e: string[] = [];
    if (!x.name || !x.name.trim()) e.push("exercise name required");
    if (!x.muscleGroup) e.push("muscle group required");
    if (!x.equipment) e.push("equipment required");
    if (!x.type) e.push("exercise type required");
    return e;
}

export function validateExerciseLog(l: ExerciseLog): string[] {
    const e: string[] = [];
    if (!l.exerciseId) e.push("exerciseId required");
    l.sets.forEach((s: SetEntry, i: number) => {
        const se = validateSetEntry(s);
        if (se.length) e.push(`set ${i + 1}: ${se.join(", ")}`);
    });
    return e;
}

export function validateWorkout(w: Workout): string[] {
    const e: string[] = [];
    if (!isISODate(w.dateISO)) e.push("dateISO must be YYYY-MM-DD");
    w.logs.forEach((l: ExerciseLog, i: number) => {
        const le = validateExerciseLog(l);
        if (le.length) e.push(`log ${i + 1}: ${le.join(", ")}`);
    });
    return e;
}

export type ID = string;

export type EquipmentType =
    | "Barbell" | "Dumbbell" | "Bodyweight" | "Machine" | "Cable" | "Kettlebell"
    | "Ab Wheel" | "Sled" | "Battle Rope" | "Medicine Ball";

export type MuscleGroup =
    | "Lower Body" | "Upper Body" | "Arms" | "Core" | "Full Body";

export type ExerciseType = "Compound" | "Isolation" | "Conditioning";

export type SetEntry = {
    reps: number;
    weight: number;
    note?: string;
    ts?: number;
    rpe?: number;
};

export type Exercise = {
    id: ID;
    name: string;
    muscleGroup: MuscleGroup;
    equipment: EquipmentType;
    type: ExerciseType;
    tags?: string[];
};

export type ExerciseLog = {
    exerciseId: ID;
    sets: SetEntry[];
};

export type WorkoutTemplate = {
    id: ID;
    name: string;
    dayIndex: number;
    exercises: ID[];
    // NEW: optional target reps/weight per exercise ID
    targets?: Record<ID, { reps: number; weight: number }>;
};

export type Workout = {
    id: ID;
    dateISO: string;
    templateId?: ID;
    notes?: string;
    logs: ExerciseLog[];
};

export type SessionState = {
    active: boolean;
    startedAt?: number;
    finishedAt?: number;
    activeExerciseIdx: number;
    restEndsAt?: number;
    restPresetSec?: number;
    workoutId?: ID;
};

// Force module even if tree-shaken types
export { };

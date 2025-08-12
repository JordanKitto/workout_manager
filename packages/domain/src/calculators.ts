import { ExerciseLog, SetEntry } from "./models";

export function totalVolumeForLog(log: ExerciseLog): number {
    return log.sets.reduce((sum: number, s: SetEntry) => sum + s.reps * s.weight, 0);
}

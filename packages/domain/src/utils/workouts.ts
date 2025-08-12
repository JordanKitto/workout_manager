export function calcOneRepMax(weight: number, reps: number): number {
    if (weight <= 0 || reps <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
}

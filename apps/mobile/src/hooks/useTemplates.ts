import { useCallback, useEffect, useMemo, useState } from "react";
import { repo, DEFAULT_EXERCISES, WorkoutTemplate } from "@workout/domain";

export type TemplateRowVM = { id: string; name: string; previewNames: string[] };
type ExpandedMap = Record<string, boolean>;

export function useTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [expanded, setExpanded] = useState<ExpandedMap>({});

    useEffect(() => {
        if (repo.listExercises().length === 0) {
            repo.seedExercises(DEFAULT_EXERCISES);
            repo.makeTemplate("Upper Day 1", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
            repo.makeTemplate("Upper Day 2", 1, ["Incline Bench Press", "Lat Pulldown", "Cable Row"]);
            repo.makeTemplate("Lower Day 1", 2, ["Back Squat", "Romanian Deadlift", "Leg Press"]);
            repo.makeTemplate("Lower Day 2", 3, ["Front Squat", "Hip Thrust", "Leg Curl"]);
        }
        setTemplates(repo.listTemplates());
    }, []);

    const rows = useMemo<TemplateRowVM[]>(() =>
        templates.map(t => ({
            id: t.id,
            name: t.name,
            previewNames: t.exercises.map(id => repo.getExerciseName(id) ?? "Unknown"),
        })), [templates]);

    const toggleExpand = useCallback((id: string) => {
        setExpanded(prev => {
            const next: ExpandedMap = {};
            Object.keys(prev).forEach(k => (next[k] = false));
            next[id] = !prev[id];
            return next;
        });
    }, []);

    const isExpanded = useCallback((id: string) => expanded[id] === true, [expanded]);
    const refresh = useCallback(() => setTemplates(repo.listTemplates()), []);

    return { rows, isExpanded, toggleExpand, selectedId, setSelectedId, refresh };
}

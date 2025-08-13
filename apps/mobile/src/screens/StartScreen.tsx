import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, FlatList, TouchableOpacity } from "react-native";
import { repo, DEFAULT_EXERCISES, Workout, WorkoutTemplate } from "@workout/domain";
import { AppButton } from "@workout/ui";

function formatHMS(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return h > 0 ? `${hh}:${m}:${ss}` : `${m}:${ss}`;
}

type TemplateRow = WorkoutTemplate & { expanded?: boolean };

export default function StartScreen() {
    const [templates, setTemplates] = useState<TemplateRow[]>([]);
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [smokeResult, setSmokeResult] = useState<string>("");
    const [mode, setMode] = useState<"select" | "workout">("select");
    const [workoutId, setWorkoutId] = useState<string | undefined>(undefined);
    const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
    const [elapsed, setElapsed] = useState<number>(0);

    // 1) Seed once and load templates into state
    useEffect(() => {
        if (repo.listExercises().length === 0) {
            repo.seedExercises(DEFAULT_EXERCISES);
            repo.makeTemplate("Upper Day 1", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
            repo.makeTemplate("Upper Day 2", 1, ["Incline Bench Press", "Lat Pulldown", "Cable Row"]);
            repo.makeTemplate("Lower Day 1", 2, ["Back Squat", "Romanian Deadlift", "Leg Press"]);
            repo.makeTemplate("Lower Day 2", 3, ["Front Squat", "Hip Thrust", "Leg Curl"]);
        }
        setTemplates(repo.listTemplates()); // <-- load into state
    }, []);

    // 2) Tick the workout timer only while in workout mode
    useEffect(() => {
        if (mode !== "workout" || !startedAt) return;
        const t = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
        return () => clearInterval(t);
    }, [mode, startedAt]);


    function toggleExpand(id: string) {
        setTemplates(prev =>
            prev.map(t => (t.id === id ? { ...t, expanded: !t.expanded } : { ...t, expanded: false }))
        );
    }

    function selectTemplate(id: string) {
        setSelectedId(id);
    }

    function startSelected() {
        if (!selectedId) return;
        const tpl = templates.find(t => t.id === selectedId);
        if (!tpl) return;
        const w = repo.startSessionFromTemplate(tpl.id, new Date().toISOString().slice(0, 10));
        setWorkoutId(w.id);
        setStartedAt(Date.now());
        setElapsed(0);
        setMode("workout");
    }

    function endWorkout() {
        // In a later step we will compute summary and persist to History.
        setMode("select");
        setWorkoutId(undefined);
        setStartedAt(undefined);
        setElapsed(0);
        setTemplates(repo.listTemplates()); // refresh
    }

    function renderPreviewLines(t: WorkoutTemplate) {
        // Preview the exercise names inline
        const names = t.exercises
            .map(id => repo.getExerciseName(id) ?? "Unknown")
            .slice(0, 4); // keep short
        return (
            <View style={{ marginTop: 6 }}>
                {names.map((n, i) => (
                    <Text key={i} style={{ color: "#555", marginTop: i ? 4 : 0 }}>
                        {n}
                    </Text>
                ))}
                {t.exercises.length > names.length && (
                    <Text style={{ color: "#999", marginTop: 4 }}>
                        +{t.exercises.length - names.length} more
                    </Text>
                )}
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Start</Text>
                {mode === "select" && (

                    <>

                        {/* Keep your smoke button for quick validation */}
                        <View style={{ marginTop: 12 }}>
                            <AppButton
                                title="Run domain smoke"
                                onPress={() => {
                                    try {
                                        const t = repo.makeTemplate("Smoke Day", 9, ["Bench Press", "Barbell Row", "Overhead Press"]);
                                        const w = repo.startSessionFromTemplate(t.id, "2025-08-10");
                                        repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
                                        repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
                                        setSmokeResult("SMOKE OK");
                                    } catch (e: any) {
                                        setSmokeResult("SMOKE ERROR: " + (e?.message || String(e)));
                                    }
                                }}
                            />
                            {!!smokeResult && <Text style={{ marginTop: 8 }}>{smokeResult}</Text>}
                        </View>

                        {/* Collapsed template list with expand + select */}
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ fontWeight: "600", marginBottom: 8 }}>Your workouts</Text>
                            <FlatList
                                data={templates}
                                keyExtractor={t => t.id}
                                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.7}>
                                        <View style={{ paddingVertical: 12 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>

                                                {/* Radio-style selector */}
                                                <TouchableOpacity onPress={() => selectTemplate(item.id)} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: 10,
                                                            borderWidth: 2,
                                                            borderColor: selectedId === item.id ? "#2563eb" : "#999",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}
                                                    >
                                                        {selectedId === item.id && (
                                                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563eb" }} />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            {item.expanded && renderPreviewLines(item)}
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        {/* Start button pinned at bottom of content area */}
                        <View style={{ marginTop: 16 }}>
                            <AppButton title="Start" onPress={startSelected} disabled={!selectedId} />
                            {!selectedId && <Text style={{ marginTop: 8, color: "#777" }}>Select a workout to enable Start.</Text>}
                        </View>
                    </>
                )}
                {/* Workout Mode (new) */}
                {mode === "workout" && workoutId && (
                    <View style={{ marginTop: 8 }}>
                        {/* Header: name + total timer */}
                        <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>
                                {
                                    // resolve workout name from templateId for display
                                    (() => {
                                        const w = repo.getWorkout(workoutId);
                                        const t = w?.templateId ? templates.find(x => x.id === w.templateId) : undefined;
                                        return t?.name ?? "Workout";
                                    })()
                                }
                            </Text>
                            <Text style={{ marginTop: 4, fontSize: 16 }}>
                                Time {formatHMS(elapsed)}
                            </Text>
                        </View>

                        {/* Placeholder where we will add collapsible exercise panels next */}
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ color: "#666" }}>
                                Exercise panels will appear here in the next step.
                            </Text>
                        </View>

                        {/* End button for now */}
                        <View style={{ marginTop: 24 }}>
                            <AppButton title="End Workout" onPress={endWorkout} />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

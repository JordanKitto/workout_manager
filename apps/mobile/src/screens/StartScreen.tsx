import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, FlatList, TextInput } from "react-native";
import { repo, DEFAULT_EXERCISES, Workout, WorkoutTemplate, totalVolumeForLog } from "@workout/domain";
import { AppButton } from "@workout/ui";



export default function StartScreen() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [workout, setWorkout] = useState<Workout | undefined>(undefined);
    const [smokeResult, setSmokeResult] = useState<string>("");
    const [reps, setReps] = useState("12");
    const [weight, setWeight] = useState("50");

    useEffect(() => {
        if (repo.listExercises().length === 0) {
            repo.seedExercises(DEFAULT_EXERCISES);
            repo.makeTemplate("Day A", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
        }
        setTemplates(repo.listTemplates());
    }, []);

    function startDayA() {
        const tpl = templates.find(t => t.name === "Day A");
        if (!tpl) return;
        const w = repo.startSessionFromTemplate(tpl.id, "2025-08-10");
        setWorkout(w);
    }

    function runDomainSmoke() {
        try {
            if (repo.listExercises().length === 0) {
                repo.seedExercises(DEFAULT_EXERCISES);
            }
            const tpl = repo.makeTemplate("Day A", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
            const w = repo.startSessionFromTemplate(tpl.id, "2025-08-10");
            repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
            repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
            const vol = totalVolumeForLog(repo.getWorkout(w.id)!.logs[0]);
            if (tpl.name === "Day A" && w.logs.length === 3 && vol === 1000) {
                setSmokeResult("SMOKE OK (volume 1000)");
            } else {
                setSmokeResult(`SMOKE FAIL (logs=${w.logs.length}, vol=${vol})`);
            }
        } catch (e: any) {
            setSmokeResult("SMOKE ERROR: " + (e?.message || String(e)));
        }
    }

    function logSet() {
        if (!workout) return;
        const r = parseInt(reps, 10);
        const kg = parseFloat(weight);
        if (!Number.isFinite(r) || r <= 0) return;
        if (!Number.isFinite(kg) || kg < 0) return;

        const session = repo.getSession();
        const idx = session.activeExerciseIdx ?? 0;

        repo.addSet(workout.id, idx, { reps: r, weight: kg, ts: Date.now() });

        // force a re-render by pulling a fresh copy from the repo
        const updated = repo.getWorkout(workout.id);
        if (updated) setWorkout(updated);
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Start</Text>

                <View style={{ marginTop: 16 }}>
                    <AppButton title="Run domain smoke" onPress={runDomainSmoke} />
                    {!!smokeResult && <Text style={{ marginTop: 8 }}>{smokeResult}</Text>}
                </View>

                {!workout && (
                    <View style={{ marginTop: 12 }}>
                        <Text style={{ marginBottom: 8 }}>Templates</Text>
                        <AppButton title="Start Day A" onPress={startDayA} />
                    </View>
                )}

                {workout && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontWeight: "600" }}>Session for {workout.dateISO}</Text>
                        <FlatList
                            style={{ marginTop: 8 }}
                            data={workout.logs}
                            keyExtractor={(_, i) => String(i)}
                            renderItem={({ item, index }) => {
                                const name = repo.getExerciseName(item.exerciseId) ?? "Unknown";
                                return (
                                    <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                                        <Text>{index + 1}. {name}</Text>
                                        <Text style={{ color: "#666" }}>Sets: {item.sets.length}</Text>
                                    </View>
                                );
                            }}
                        />
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ fontWeight: "600" }}>
                                Log set for active exercise
                            </Text>
                            <Text style={{ marginTop: 6 }}>
                                Active: {repo.getExerciseName(workout.logs[repo.getSession().activeExerciseIdx || 0].exerciseId) || "Unknown"}
                            </Text>

                            <Text style={{ marginTop: 12 }}>Reps</Text>
                            <TextInput
                                value={reps}
                                onChangeText={setReps}
                                keyboardType="numeric"
                                style={{ borderWidth: 1, borderColor: "#ccc", padding: 8 }}
                            />

                            <Text style={{ marginTop: 12 }}>Weight (kg)</Text>
                            <TextInput
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                                style={{ borderWidth: 1, borderColor: "#ccc", padding: 8 }}
                            />

                            <View style={{ marginTop: 12 }}>
                                <AppButton title="Save set" onPress={logSet} />
                            </View>
                        </View>

                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}   

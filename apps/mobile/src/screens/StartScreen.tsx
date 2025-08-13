import React, { useMemo, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MainTabsNav } from "../navigation/MainTabs";
import { repo } from "@workout/domain";
import { AppButton } from "@workout/ui";
import TemplateList from "../components/TemplateList";
import WorkoutHeader from "../components/WorkoutHeader";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { useTemplates } from "../hooks/useTemplates";

export default function StartScreen() {
    const navigation = useNavigation<MainTabsNav>();

    const [mode, setMode] = useState<"select" | "workout">("select");
    const [workoutId, setWorkoutId] = useState<string | undefined>(undefined);

    const { rows, isExpanded, toggleExpand, selectedId, setSelectedId, refresh } = useTemplates();
    const { formatted, start, stop } = useWorkoutTimer();

    const title = useMemo(() => {
        if (!workoutId) return "Workout";
        const w = repo.getWorkout(workoutId);
        const t = w?.templateId ? repo.listTemplates().find(x => x.id === w.templateId) : undefined;
        return t?.name ?? "Workout";
    }, [workoutId]);

    function startSelected() {
        if (!selectedId) return;
        const w = repo.startSessionFromTemplate(selectedId, new Date().toISOString().slice(0, 10));
        setWorkoutId(w.id);
        start();
        setMode("workout");
    }

    function endWorkout() {
        stop();
        setMode("select");
        setWorkoutId(undefined);
        refresh();
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Start</Text>

                {mode === "select" && (
                    <>
                        <View style={{ marginBottom: 8 }}>
                            <AppButton
                                title="Create New Template"
                                onPress={() => navigation.navigate("CreateTemplate")}
                            />
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <TemplateList
                                rows={rows.map(r => ({ ...r, expanded: isExpanded(r.id) }))}
                                selectedId={selectedId}
                                onToggleExpand={toggleExpand}
                                onSelect={setSelectedId}
                            />
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <AppButton title="Start" onPress={startSelected} disabled={!selectedId} />
                        </View>
                    </>
                )}

                {mode === "workout" && workoutId && (
                    <View style={{ marginTop: 8 }}>
                        <WorkoutHeader title={title} time={formatted} />
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ color: "#666" }}>Exercise panels will appear here next.</Text>
                        </View>
                        <View style={{ marginTop: 24 }}>
                            <AppButton title="End Workout" onPress={endWorkout} />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

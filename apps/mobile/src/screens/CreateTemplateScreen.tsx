import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { repo, Exercise, MuscleGroup } from "@workout/domain";
import { AppButton } from "@workout/ui";
import ExercisePicker from "../components/ExercisePicker"; // NEW

type Slot = { exerciseId?: string; reps?: number; weight?: number; };
const GROUPS: (MuscleGroup | "All")[] = ["All", "Lower Body", "Upper Body", "Arms", "Core", "Full Body"];

export default function CreateTemplateScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState(`Workout (${repo.listTemplates().length + 1})`);
    const [slots, setSlots] = useState<Slot[]>([{}, {}, {}]);
    const REPS_STEP = 1;
    const WEIGHT_STEP = 2.5;

    // fullscreen picker state
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSlot, setPickerSlot] = useState<number | null>(null);

    function addSlot() { setSlots(prev => [...prev, {}]); }
    function removeSlot(i: number) { setSlots(prev => prev.filter((_, idx) => idx !== i)); }
    function openPicker(i: number) { setPickerSlot(i); setPickerOpen(true); }
    function closePicker() { setPickerOpen(false); setPickerSlot(null); }

    function chooseExercise(ex: Exercise) {
        if (pickerSlot == null) return;
        setSlots(prev => {
            const next = prev.slice();
            next[pickerSlot] = {
                exerciseId: ex.id,
                reps: next[pickerSlot].reps ?? 10,
                weight: next[pickerSlot].weight ?? 20
            };
            return next;
        });
        closePicker();
    }

    function setReps(i: number, t: string) {
        const n = parseInt(t.replace(/\D/g, "") || "0", 10);
        setSlots(prev => { const next = prev.slice(); next[i] = { ...next[i], reps: n }; return next; });
    }
    function setWeight(i: number, t: string) {
        const n = parseFloat(t.replace(/[^0-9.]/g, "") || "0");
        setSlots(prev => { const next = prev.slice(); next[i] = { ...next[i], weight: n }; return next; });
    }

    function bumpReps(i: number, delta: number) {
        setSlots(prev => {
            const next = prev.slice();
            const cur = Number(next[i].reps ?? 0);
            const val = Math.max(0, cur + delta);
            next[i] = { ...next[i], reps: val };
            return next;
        });
    }

    function bumpWeight(i: number, delta: number) {
        setSlots(prev => {
            const next = prev.slice();
            const cur = Number(next[i].weight ?? 0);
            const val = Math.max(0, Math.round((cur + delta) * 10) / 10); // keep one decimal
            next[i] = { ...next[i], weight: val };
            return next;
        });
    }

    function save() {
        const filled = slots.filter(s => s.exerciseId);
        if (filled.length === 0) { alert("Add at least one exercise."); return; }
        const ids = filled.map(s => s.exerciseId!) as string[];
        const t = repo.makeTemplate(name.trim() || "Workout", repo.listTemplates().length, ids);
        const targets: Record<string, { reps: number; weight: number }> = {};
        filled.forEach(s => {
            if (s.exerciseId && s.reps != null && s.weight != null) targets[s.exerciseId] = { reps: s.reps, weight: s.weight };
        });
        if (Object.keys(targets).length) repo.setTemplateTargets(t.id, targets);
        navigation.goBack();
    }

    // RENDER
    if (pickerOpen) {
        return (
            <ExercisePicker
                data={repo.listExercises()}
                onSelect={chooseExercise}
                onCancel={closePicker}
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                data={slots}
                keyExtractor={(_, i) => String(i)}
                ListHeaderComponent={
                    <View>
                        <Text style={styles.h1}>Create Template</Text>
                        <Text style={styles.label}>Template Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Workout name"
                            style={styles.input}
                        />
                    </View>
                }
                renderItem={({ item, index }) => {
                    const exName = item.exerciseId ? repo.getExerciseName(item.exerciseId) : undefined;
                    return (
                        <View style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>Exercise {index + 1}</Text>
                                <TouchableOpacity onPress={() => removeSlot(index)}>
                                    <Text style={styles.remove}>Remove</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => openPicker(index)}>
                                <Text style={styles.exerciseName}>{exName ?? "Tap to choose exercise"}</Text>
                            </TouchableOpacity>

                            {item.exerciseId && (
                                <View style={styles.chipsRow}>
                                    {/* Reps */}
                                    <View style={styles.chip}>
                                        <Text style={styles.chipLabel}>Reps</Text>
                                        <View style={styles.stepWrap}>
                                            <TouchableOpacity onPress={() => bumpReps(index, -REPS_STEP)} style={styles.stepBtn}>
                                                <Text style={styles.stepBtnText}>-</Text>
                                            </TouchableOpacity>
                                            <TextInput
                                                keyboardType="number-pad"
                                                value={item.reps?.toString() ?? ""}
                                                onChangeText={t => setReps(index, t)}
                                                style={styles.stepInput}
                                                placeholder="10"
                                            />
                                            <TouchableOpacity onPress={() => bumpReps(index, REPS_STEP)} style={styles.stepBtn}>
                                                <Text style={styles.stepBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Weight */}
                                    <View style={styles.chip}>
                                        <Text style={styles.chipLabel}>Weight</Text>
                                        <View style={styles.stepWrap}>
                                            <TouchableOpacity onPress={() => bumpWeight(index, -WEIGHT_STEP)} style={styles.stepBtn}>
                                                <Text style={styles.stepBtnText}>-</Text>
                                            </TouchableOpacity>
                                            <TextInput
                                                keyboardType="decimal-pad"
                                                value={item.weight?.toString() ?? ""}
                                                onChangeText={t => setWeight(index, t)}
                                                style={styles.stepInput}
                                                placeholder="20"
                                            />
                                            <TouchableOpacity onPress={() => bumpWeight(index, WEIGHT_STEP)} style={styles.stepBtn}>
                                                <Text style={styles.stepBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                }}
                ListFooterComponent={<View style={{ height: 0 }} />}
                initialNumToRender={12}
                maxToRenderPerBatch={24}
                windowSize={8}
                removeClippedSubviews
            />

            <TouchableOpacity style={styles.fab} onPress={addSlot} activeOpacity={0.9}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <View style={styles.saveBar}>
                <AppButton title="Save Template" onPress={save} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    h1: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
    label: { fontWeight: "600", marginTop: 8 },
    input: { borderWidth: 1, borderColor: "#dcdcdc", padding: 10, borderRadius: 10, marginTop: 6 },
    card: { borderWidth: 1, borderColor: "#ececec", borderRadius: 12, padding: 12, marginTop: 12, backgroundColor: "#fff" },
    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontWeight: "600" },
    remove: { color: "#b91c1c" },
    exerciseName: { marginTop: 8, fontSize: 16, fontWeight: "700", color: "#111" },
    chipsRow: { flexDirection: "row", gap: 12, marginTop: 10 },
    chip: { borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10, minWidth: 120 },
    chipLabel: { fontSize: 11, color: "#666" },
    chipInput: { fontSize: 16, fontWeight: "600", padding: 0, margin: 0 },
    fab: { position: "absolute", right: 16, bottom: 84, width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#2563eb", elevation: 4 },
    fabText: { color: "#fff", fontSize: 28, lineHeight: 30, fontWeight: "700" },
    saveBar: { position: "absolute", left: 0, right: 0, bottom: 16, paddingHorizontal: 16 },
    stepWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4
    },
    stepBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#dcdcdc",
        backgroundColor: "#f7f7fb"
    },
    stepBtnText: { fontSize: 16, fontWeight: "700", color: "#111" },
    stepInput: {
        minWidth: 64,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        paddingVertical: 0,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 8
    }
});

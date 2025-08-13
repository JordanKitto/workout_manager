import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { repo, Exercise, MuscleGroup } from "@workout/domain";
import { AppButton } from "@workout/ui";

type Slot = {
    exerciseId?: string;
    reps?: number;
    weight?: number;
};

const GROUPS: MuscleGroup[] = ["Lower Body", "Upper Body", "Arms", "Core", "Full Body"];

export default function CreateTemplateScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState(`Workout (${repo.listTemplates().length + 1})`);
    const [slots, setSlots] = useState<Slot[]>([{}, {}, {}]); // start with 3 empty slots, adjust as you wish

    // modal state
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | "All">("All");

    const allExercises = repo.listExercises();

    const filtered = useMemo(() => {
        if (selectedGroup === "All") return allExercises;
        return allExercises.filter(e => e.muscleGroup === selectedGroup);
    }, [allExercises, selectedGroup]);

    function openPicker(index: number) {
        setPickerSlotIndex(index);
        setPickerVisible(true);
    }
    function closePicker() {
        setPickerVisible(false);
        setPickerSlotIndex(null);
    }

    function pickExercise(ex: Exercise) {
        if (pickerSlotIndex == null) return;
        setSlots(prev => {
            const next = prev.slice();
            const prevSlot = next[pickerSlotIndex] ?? {};
            next[pickerSlotIndex] = {
                exerciseId: ex.id,
                reps: prevSlot.reps ?? 10,
                weight: prevSlot.weight ?? 20
            };
            return next;
        });
        closePicker();
    }

    function addSlot() {
        setSlots(prev => [...prev, {}]);
    }

    function removeSlot(i: number) {
        setSlots(prev => prev.filter((_, idx) => idx !== i));
    }

    function updateReps(i: number, repsText: string) {
        const n = Number(repsText.replace(/[^0-9]/g, ""));
        setSlots(prev => {
            const next = prev.slice();
            next[i] = { ...next[i], reps: Number.isFinite(n) ? n : undefined };
            return next;
        });
    }

    function updateWeight(i: number, weightText: string) {
        const n = Number(weightText.replace(/[^0-9.]/g, ""));
        setSlots(prev => {
            const next = prev.slice();
            next[i] = { ...next[i], weight: Number.isFinite(n) ? n : undefined };
            return next;
        });
    }

    function saveTemplate() {
        const filled = slots.filter(s => s.exerciseId);
        if (filled.length === 0) {
            alert("Please add at least one exercise.");
            return;
        }
        const exerciseIds = filled.map(s => s.exerciseId!) as string[];
        const t = repo.makeTemplate(name.trim() || "Workout", repo.listTemplates().length, exerciseIds);

        // collect targets keyed by exercise id
        const targets: Record<string, { reps: number; weight: number }> = {};
        filled.forEach(s => {
            if (s.exerciseId && typeof s.reps === "number" && typeof s.weight === "number") {
                targets[s.exerciseId] = { reps: s.reps, weight: s.weight };
            }
        });
        if (Object.keys(targets).length) {
            repo.setTemplateTargets(t.id, targets);
        }

        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={styles.h1}>Create Template</Text>

            <Text style={styles.label}>Template Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Workout name"
                style={styles.input}
            />

            <FlatList
                style={{ marginTop: 8 }}
                data={slots}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                    const exerciseName = item.exerciseId ? repo.getExerciseName(item.exerciseId) : undefined;
                    return (
                        <View style={styles.slotCard}>
                            <View style={styles.slotHeader}>
                                <Text style={styles.slotTitle}>Exercise {index + 1}</Text>
                                <TouchableOpacity onPress={() => removeSlot(index)}>
                                    <Text style={styles.removeLink}>Remove</Text>
                                </TouchableOpacity>
                            </View>

                            {!item.exerciseId ? (
                                <AppButton title="+ Add Exercise" onPress={() => openPicker(index)} />
                            ) : (
                                <>
                                    <Text style={styles.exerciseName}>{exerciseName}</Text>
                                    <View style={styles.row}>
                                        <View style={styles.field}>
                                            <Text style={styles.fieldLabel}>Reps</Text>
                                            <TextInput
                                                keyboardType="number-pad"
                                                value={item.reps?.toString() ?? ""}
                                                onChangeText={t => updateReps(index, t)}
                                                placeholder="10"
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.field}>
                                            <Text style={styles.fieldLabel}>Weight</Text>
                                            <TextInput
                                                keyboardType="decimal-pad"
                                                value={item.weight?.toString() ?? ""}
                                                onChangeText={t => updateWeight(index, t)}
                                                placeholder="20"
                                                style={styles.input}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 8 }}>
                                        <AppButton title="Change Exercise" onPress={() => openPicker(index)} />
                                    </View>
                                </>
                            )}
                        </View>
                    );
                }}
                ListFooterComponent={
                    <View style={{ marginTop: 8 }}>
                        <AppButton title="Add Another Slot" onPress={addSlot} />
                    </View>
                }
            />

            <View style={{ marginTop: 16 }}>
                <AppButton title="Save Template" onPress={saveTemplate} />
            </View>

            {/* Exercise Picker Modal */}
            <Modal visible={pickerVisible} animationType="slide" onRequestClose={closePicker}>
                <View style={{ flex: 1, padding: 16 }}>
                    <Text style={styles.h1}>Pick Exercise</Text>

                    <View style={styles.groupRow}>
                        <PressableGroup label="All" active={selectedGroup === "All"} onPress={() => setSelectedGroup("All")} />
                        {GROUPS.map(g => (
                            <PressableGroup key={g} label={g} active={selectedGroup === g} onPress={() => setSelectedGroup(g)} />
                        ))}
                    </View>

                    <FlatList
                        style={{ marginTop: 8 }}
                        data={filtered}
                        keyExtractor={ex => ex.id}
                        renderItem={({ item: ex }) => (
                            <TouchableOpacity style={styles.exerciseRow} onPress={() => pickExercise(ex)}>
                                <Text style={styles.exerciseRowName}>{ex.name}</Text>
                                <Text style={styles.exerciseRowMeta}>{ex.muscleGroup} / {ex.equipment}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <View style={{ marginTop: 8 }}>
                        <AppButton title="Close" onPress={closePicker} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function PressableGroup({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.groupPill, active && styles.groupPillActive]}>
            <Text style={[styles.groupPillText, active && styles.groupPillTextActive]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    h1: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
    label: { fontWeight: "600", marginTop: 8 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6, marginTop: 6 },
    slotCard: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 8, padding: 12, marginTop: 12 },
    slotHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    slotTitle: { fontWeight: "600" },
    removeLink: { color: "#b91c1c" },
    exerciseName: { marginTop: 8, fontSize: 16, fontWeight: "600" },
    row: { flexDirection: "row", gap: 12, marginTop: 8 },
    field: { flex: 1 },
    fieldLabel: { fontSize: 12, color: "#555" },
    groupRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    groupPill: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 16 },
    groupPillActive: { backgroundColor: "#eef2ff", borderColor: "#2563eb" },
    groupPillText: { fontSize: 12, color: "#444" },
    groupPillTextActive: { color: "#1f2937", fontWeight: "600" },
    exerciseRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
    exerciseRowName: { fontSize: 16, fontWeight: "600" },
    exerciseRowMeta: { fontSize: 12, color: "#666", marginTop: 2 },
});

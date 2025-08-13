import React, { useMemo, useState } from "react";
import { View, Text, TextInput, SectionList, TouchableOpacity, StyleSheet } from "react-native";
import { Exercise, MuscleGroup } from "@workout/domain";

type Props = { data: Exercise[]; onSelect: (ex: Exercise) => void; onCancel: () => void; };

const GROUPS: (MuscleGroup | "All")[] = ["All", "Lower Body", "Upper Body", "Arms", "Core", "Full Body"];

export default function ExercisePicker({ data, onSelect, onCancel }: Props) {
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState<MuscleGroup | "All">("All");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return data.filter(e => {
            if (group !== "All" && e.muscleGroup !== group) return false;
            if (!q) return true;
            return e.name.toLowerCase().includes(q) || e.equipment.toLowerCase().includes(q);
        });
    }, [data, query, group]);

    const sections = useMemo(() => {
        const m: Record<string, Exercise[]> = {};
        for (const ex of filtered) { (m[ex.muscleGroup] ||= []).push(ex); }
        return Object.keys(m).sort().map(k => ({ title: k, data: m[k] }));
    }, [filtered]);

    return (
        <View style={styles.wrap}>
            <View style={styles.header}>
                <Text style={styles.title}>Pick Exercise</Text>
                <TouchableOpacity onPress={onCancel}><Text style={styles.cancel}>Close</Text></TouchableOpacity>
            </View>

            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search exercises or equipment"
                style={styles.search}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
            />

            <View style={styles.chipsRow}>
                {GROUPS.map(g => (
                    <TouchableOpacity key={g} onPress={() => setGroup(g as any)} style={[styles.chip, group === g && styles.chipActive]}>
                        <Text style={[styles.chipText, group === g && styles.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
                        <Text style={styles.rowName}>{item.name}</Text>
                        <Text style={styles.rowMeta}>{item.muscleGroup} / {item.equipment}</Text>
                    </TouchableOpacity>
                )}
                initialNumToRender={24}
                maxToRenderPerBatch={32}
                windowSize={8}
                removeClippedSubviews
                stickySectionHeadersEnabled
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: "#fff" },
    header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 18, fontWeight: "700" },
    cancel: { color: "#2563eb", fontWeight: "600" },
    search: { marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: "#dedede", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
    chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
    chip: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 16 },
    chipActive: { backgroundColor: "#eef2ff", borderColor: "#2563eb" },
    chipText: { fontSize: 12, color: "#444" },
    chipTextActive: { color: "#1f2937", fontWeight: "700" },
    section: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, fontSize: 12, color: "#666", backgroundColor: "#fafafa" },
    row: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    rowName: { fontSize: 16, fontWeight: "600" },
    rowMeta: { fontSize: 12, color: "#666", marginTop: 2 }
});

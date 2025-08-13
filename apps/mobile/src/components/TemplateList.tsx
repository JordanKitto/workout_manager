import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export type TemplateRow = {
    id: string;
    name: string;
    previewNames: string[];
    expanded?: boolean;
};

type Props = {
    rows: TemplateRow[];
    selectedId?: string;
    onToggleExpand: (id: string) => void;
    onSelect: (id: string) => void;
    emptyHint?: string;
};

export default function TemplateList({
    rows,
    selectedId,
    onToggleExpand,
    onSelect,
    emptyHint,
}: Props) {
    if (!rows.length) {
        return (
            <View style={styles.emptyWrap}>
                <Text style={styles.sectionTitle}>Your workouts</Text>
                <Text style={styles.emptyHint}>{emptyHint ?? "No templates yet."}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.sectionTitle}>Your workouts</Text>
            <FlatList
                data={rows}
                keyExtractor={(r) => r.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => {
                    const selected = selectedId === item.id;
                    return (
                        <View style={styles.rowWrap}>
                            <Pressable style={styles.nameArea} onPress={() => onToggleExpand(item.id)}>
                                <Text style={styles.nameText}>{item.name}</Text>

                                {item.expanded && (
                                    <View style={styles.previewWrap}>
                                        {item.previewNames.slice(0, 4).map((n, i) => (
                                            <Text
                                                key={item.id + ":" + i}
                                                style={[styles.previewText, i > 0 && styles.previewGap]}
                                            >
                                                {n}
                                            </Text>
                                        ))}
                                        {item.previewNames.length > 4 && (
                                            <Text style={styles.moreText}>
                                                +{item.previewNames.length - 4} more
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </Pressable>

                            <Pressable
                                hitSlop={8}
                                onPress={() => onSelect(item.id)}
                                style={[styles.radioOuter, selected && styles.radioOuterSelected]}
                            >
                                {selected && <View style={styles.radioInner} />}
                            </Pressable>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { fontWeight: "600", marginBottom: 8 },
    separator: { height: 1, backgroundColor: "#eee" },
    rowWrap: {
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    nameArea: { flex: 1 },
    nameText: { fontSize: 16, fontWeight: "600" },
    previewWrap: { marginTop: 6 },
    previewText: { color: "#555" },
    previewGap: { marginTop: 4 },
    moreText: { color: "#999", marginTop: 4 },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#999",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    radioOuterSelected: { borderColor: "#2563eb" },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563eb" },
    emptyWrap: { gap: 6 },
    emptyHint: { color: "#777" },
});

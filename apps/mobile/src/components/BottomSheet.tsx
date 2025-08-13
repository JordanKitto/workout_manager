import React, { ReactNode } from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function BottomSheet({ visible, onClose, children }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.grabber} />
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
    sheet: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        backgroundColor: "#fff", padding: 16, maxHeight: "80%"
    },
    grabber: {
        alignSelf: "center", width: 36, height: 4, borderRadius: 2,
        backgroundColor: "#ddd", marginBottom: 12
    }
});

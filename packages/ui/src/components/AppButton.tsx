import { Pressable, Text, type ViewStyle, type TextStyle } from "react-native";

type Variant = "primary" | "secondary";

export type AppButtonProps = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    variant?: Variant;
    style?: ViewStyle;
    textStyle?: TextStyle;
    testID?: string;
};

export function AppButton({
    title,
    onPress,
    disabled = false,
    variant = "primary",
    style,
    textStyle,
    testID
}: AppButtonProps) {
    const bg = variant === "primary" ? "#2563eb" : "#e5e7eb";
    const fg = variant === "primary" ? "#ffffff" : "#111827";

    const baseStyle: ViewStyle = {
        backgroundColor: bg,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        opacity: disabled ? 0.6 : 1
    };

    const baseText: TextStyle = {
        color: fg,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center"
    };

    return (
        <Pressable
            testID={testID}
            onPress={disabled ? undefined : onPress}
            style={[baseStyle, style]}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            <Text style={[baseText, textStyle]}>{title}</Text>
        </Pressable>
    );
}

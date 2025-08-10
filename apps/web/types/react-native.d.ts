// Web-only type shim so Next's TS checker does not choke on RN symbols.
// Runtime is still provided by react-native-web via webpack alias.

declare module "react-native" {
    import * as React from "react";

    export type ViewStyle = any;
    export type TextStyle = any;

    export type PressableProps = {
        onPress?: () => void;
        disabled?: boolean;
        children?: React.ReactNode;
        style?: any;
        testID?: string;
        accessibilityRole?: string;
        accessibilityState?: { disabled?: boolean };
    };

    export const Pressable: React.ComponentType<PressableProps>;
    export const Text: React.ComponentType<{ style?: any; children?: React.ReactNode }>;
}

export type Greeting = "Good morning" | "Good afternoon" | "Good evening";

export function getGreeting(now: Date = new Date()): Greeting {
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export function greet(name: string, now: Date = new Date()): string {
    const base = getGreeting(now);
    const clean = name?.trim() || "there";
    return `${base}, ${clean}.`;
}

import { useMemo } from "react";
import { greet } from "packages/domain";

export default function HomePage() {
    const message = useMemo(() => greet("Jordan"), []);
    return (
        <main style= {{ padding: 24, fontFamily: "system-ui, sans-serif" }
}>
    <h1>Workout Manager </h1>
        < p > { message } </p>
        < p > Domain utilities are working across web.</p>
            </main>
  );
}

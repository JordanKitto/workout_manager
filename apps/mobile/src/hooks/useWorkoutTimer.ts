import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useWorkoutTimer() {
    const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
    const [elapsed, setElapsed] = useState<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        const now = Date.now();
        setStartedAt(now);
        setElapsed(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setElapsed(Date.now() - now), 1000);
    }, []);

    const stop = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setStartedAt(undefined);
        setElapsed(0);
    }, []);

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const formatted = useMemo(() => {
        const totalSec = Math.floor(elapsed / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");
        return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
    }, [elapsed]);

    return { startedAt, elapsed, formatted, start, stop };
}

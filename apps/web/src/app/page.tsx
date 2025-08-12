"use client";
import React, { useState } from "react";
// import { greet } from "@workout/domain";
import { AppButton } from "@workout/ui";
import { calcOneRepMax } from "@workout/domain";

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Workout Manager</h1>
      {/* <p>{greet("Jordan")}</p> */}
      <AppButton title={`Clicks: ${count}`} onPress={() => setCount(c => c + 1)} />
      <p className="text-sm text-gray-600">Shared UI works on web.</p>
      <p> 1RM estimate for 100 x 5: {calcOneRepMax(100, 5)}</p>
    </main>
  );
}

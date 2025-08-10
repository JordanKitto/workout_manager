import { greet } from "@workout/domain";

export default function Page() {
  const message = greet("Jordan");
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Workout Manager</h1>
      <p className="mt-2">{message}</p>
      <p className="text-sm text-gray-600 mt-1">Domain utilities are working across web.</p>
    </main>
  );
}

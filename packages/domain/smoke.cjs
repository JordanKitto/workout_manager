const {
    repo,
    DEFAULT_EXERCISES,
    totalVolumeForLog
} = require("./dist/index.js");

// 1) seed
repo.seedExercises(DEFAULT_EXERCISES);

// 2) template
const tpl = repo.makeTemplate("Day A", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);

// 3) start session
const w = repo.startSessionFromTemplate(tpl.id, "2025-08-10");

// 4) add two sets to first exercise
repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });

// 5) compute volume
const vol0 = totalVolumeForLog(repo.getWorkout(w.id).logs[0]);

// 6) print
console.log("Template:", tpl.name);
console.log("Workout date:", w.dateISO);
console.log("Exercises in session:", w.logs.length);
console.log("First log sets:", repo.getWorkout(w.id).logs[0].sets.length);
console.log("First log volume:", vol0);

// 7) assert
function assert(cond, msg) { if (!cond) { console.error("SMOKE FAIL:", msg); process.exit(1); } }
assert(tpl.name === "Day A", "template name mismatch");
assert(w.dateISO === "2025-08-10", "workout date mismatch");
assert(w.logs.length === 3, "expected 3 exercises in session");
assert(vol0 === 1000, "expected volume 1000 for two sets of 5x100");
console.log("SMOKE OK");

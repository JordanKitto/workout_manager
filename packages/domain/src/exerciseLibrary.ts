
import { EquipmentType, MuscleGroup, Exercise } from "./models";

export const EQUIPMENT_TYPES: EquipmentType[] = [
    "Barbell", "Dumbbell", "Bodyweight", "Machine", "Cable", "Kettlebell",
    "Ab Wheel", "Sled", "Battle Rope", "Medicine Ball"
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
    "Lower Body", "Upper Body", "Arms", "Core", "Full Body"
];

export const DEFAULT_EXERCISES: Array<
    Pick<Exercise, "name" | "muscleGroup" | "type" | "equipment">
> = [
        // Lower Body - Compound
        { name: "Back Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Front Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Goblet Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Box Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Bulgarian Split Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Leg Press", muscleGroup: "Lower Body", type: "Compound", equipment: "Machine" },
        { name: "Lunge", muscleGroup: "Lower Body", type: "Compound", equipment: "Bodyweight" },
        { name: "Walking Lunge", muscleGroup: "Lower Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Step-Up", muscleGroup: "Lower Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Hack Squat", muscleGroup: "Lower Body", type: "Compound", equipment: "Machine" },

        // Lower Body - Posterior Chain
        { name: "Deadlift", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Sumo Deadlift", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Romanian Deadlift", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Stiff-Leg Deadlift", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Hip Thrust", muscleGroup: "Lower Body", type: "Isolation", equipment: "Barbell" },
        { name: "Glute Bridge", muscleGroup: "Lower Body", type: "Isolation", equipment: "Bodyweight" },
        { name: "Good Morning", muscleGroup: "Lower Body", type: "Compound", equipment: "Barbell" },
        { name: "Cable Pull-Through", muscleGroup: "Lower Body", type: "Isolation", equipment: "Cable" },

        // Upper Body - Push
        { name: "Bench Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Incline Bench Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Decline Bench Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Overhead Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Seated Overhead Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Push Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Incline Dumbbell Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Flat Dumbbell Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Arnold Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },
        { name: "Dumbbell Shoulder Press", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },

        // Upper Body - Pull
        { name: "Barbell Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Pendlay Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Barbell" },
        { name: "Dumbbell Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Dumbbell" },
        { name: "T-Bar Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Machine" },
        { name: "Chest Supported Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Machine" },
        { name: "Pull Up", muscleGroup: "Upper Body", type: "Compound", equipment: "Bodyweight" },
        { name: "Chin Up", muscleGroup: "Upper Body", type: "Compound", equipment: "Bodyweight" },
        { name: "Lat Pulldown", muscleGroup: "Upper Body", type: "Compound", equipment: "Machine" },
        { name: "Neutral Grip Pull Up", muscleGroup: "Upper Body", type: "Compound", equipment: "Bodyweight" },
        { name: "Face Pull", muscleGroup: "Upper Body", type: "Isolation", equipment: "Cable" },
        { name: "Cable Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Cable" },
        { name: "Inverted Row", muscleGroup: "Upper Body", type: "Compound", equipment: "Bodyweight" },

        // Arms - Biceps
        { name: "Barbell Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Barbell" },
        { name: "Dumbbell Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Dumbbell" },
        { name: "Hammer Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Dumbbell" },
        { name: "Preacher Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Machine" },
        { name: "Incline Dumbbell Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Dumbbell" },
        { name: "Cable Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Cable" },
        { name: "Concentration Curl", muscleGroup: "Arms", type: "Isolation", equipment: "Dumbbell" },

        // Arms - Triceps
        { name: "Close Grip Bench Press", muscleGroup: "Arms", type: "Compound", equipment: "Barbell" },
        { name: "Dips", muscleGroup: "Arms", type: "Compound", equipment: "Bodyweight" },
        { name: "Tricep Pushdown", muscleGroup: "Arms", type: "Isolation", equipment: "Cable" },
        { name: "Overhead Tricep Extension", muscleGroup: "Arms", type: "Isolation", equipment: "Dumbbell" },
        { name: "Skull Crusher", muscleGroup: "Arms", type: "Isolation", equipment: "Barbell" },
        { name: "Cable Overhead Extension", muscleGroup: "Arms", type: "Isolation", equipment: "Cable" },

        // Core
        { name: "Plank", muscleGroup: "Core", type: "Isolation", equipment: "Bodyweight" },
        { name: "Side Plank", muscleGroup: "Core", type: "Isolation", equipment: "Bodyweight" },
        { name: "Hanging Leg Raise", muscleGroup: "Core", type: "Isolation", equipment: "Bodyweight" },
        { name: "Captain's Chair Knee Raise", muscleGroup: "Core", type: "Isolation", equipment: "Machine" },
        { name: "Cable Crunch", muscleGroup: "Core", type: "Isolation", equipment: "Cable" },
        { name: "Russian Twist", muscleGroup: "Core", type: "Isolation", equipment: "Bodyweight" },
        { name: "Ab Rollout", muscleGroup: "Core", type: "Isolation", equipment: "Ab Wheel" },
        { name: "Bicycle Crunch", muscleGroup: "Core", type: "Isolation", equipment: "Bodyweight" },

        // Lower Body Isolation
        { name: "Leg Extension", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },
        { name: "Leg Curl", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },
        { name: "Seated Leg Curl", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },
        { name: "Standing Calf Raise", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },
        { name: "Seated Calf Raise", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },
        { name: "Donkey Calf Raise", muscleGroup: "Lower Body", type: "Isolation", equipment: "Machine" },

        // Olympic Lifts & Variations
        { name: "Clean", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Power Clean", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Clean and Jerk", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Snatch", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Power Snatch", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Push Jerk", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Hang Clean", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },
        { name: "Hang Snatch", muscleGroup: "Full Body", type: "Compound", equipment: "Barbell" },

        // Conditioning & Misc
        { name: "Kettlebell Swing", muscleGroup: "Full Body", type: "Conditioning", equipment: "Kettlebell" },
        { name: "Farmer's Carry", muscleGroup: "Full Body", type: "Conditioning", equipment: "Dumbbell" },
        { name: "Sled Push", muscleGroup: "Full Body", type: "Conditioning", equipment: "Sled" },
        { name: "Sled Pull", muscleGroup: "Full Body", type: "Conditioning", equipment: "Sled" },
        { name: "Battle Ropes", muscleGroup: "Full Body", type: "Conditioning", equipment: "Battle Rope" },
        { name: "Box Jump", muscleGroup: "Full Body", type: "Conditioning", equipment: "Bodyweight" },
        { name: "Burpee", muscleGroup: "Full Body", type: "Conditioning", equipment: "Bodyweight" },
        { name: "Medicine Ball Slam", muscleGroup: "Full Body", type: "Conditioning", equipment: "Medicine Ball" }
    ];

// Example derived lists if you want to expose them
export const BODYWEIGHT_CORE = DEFAULT_EXERCISES.filter(
    ex => ex.muscleGroup === "Core" && ex.equipment === "Bodyweight"
);

export const EQUIPMENT_OPTIONS = Array.from(
    new Set(DEFAULT_EXERCISES.map(ex => ex.equipment))
);
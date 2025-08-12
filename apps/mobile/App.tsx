import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, FlatList, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { repo, DEFAULT_EXERCISES, Workout, WorkoutTemplate, totalVolumeForLog } from "@workout/domain";
import { AppButton } from "@workout/ui";

const Tab = createBottomTabNavigator();

// Simple placeholders for three tabs
function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Home</Text>
        <Text style={{ marginTop: 8 }}>Greeting and quick actions will go here.</Text>
      </View>
    </SafeAreaView>
  );
}

function HistoryScreen() {
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>History</Text>
        <Text style={{ marginTop: 8 }}>Past workouts list will go here.</Text>
      </View>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Profile</Text>
        <Text style={{ marginTop: 8 }}>Name, units, dark mode will go here.</Text>
      </View>
    </SafeAreaView>
  );
}

// Your current session code lives here unchanged
function StartScreen() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [workout, setWorkout] = useState<Workout | undefined>(undefined);

  // Optional: simple on-device smoke state
  const [smokeResult, setSmokeResult] = useState<string>("");

  useEffect(() => {
    // Seed library and a Day A template once per cold start
    if (repo.listExercises().length === 0) {
      repo.seedExercises(DEFAULT_EXERCISES);
      repo.makeTemplate("Day A", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
    }
    setTemplates(repo.listTemplates());
  }, []);

  function startDayA() {
    const tpl = templates.find(t => t.name === "Day A");
    if (!tpl) return;
    const w = repo.startSessionFromTemplate(tpl.id, "2025-08-10");
    setWorkout(w);
  }

  function runDomainSmoke() {
    try {
      if (repo.listExercises().length === 0) {
        repo.seedExercises(DEFAULT_EXERCISES);
      }
      const tpl = repo.makeTemplate("Day A", 0, ["Bench Press", "Barbell Row", "Overhead Press"]);
      const w = repo.startSessionFromTemplate(tpl.id, "2025-08-10");
      repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
      repo.addSet(w.id, 0, { reps: 5, weight: 100, ts: Date.now() });
      const vol = totalVolumeForLog(repo.getWorkout(w.id)!.logs[0]);
      if (tpl.name === "Day A" && w.logs.length === 3 && vol === 1000) {
        setSmokeResult("SMOKE OK (volume 1000)");
      } else {
        setSmokeResult(`SMOKE FAIL (logs=${w.logs.length}, vol=${vol})`);
      }
    } catch (e: any) {
      setSmokeResult("SMOKE ERROR: " + (e?.message || String(e)));
    }
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Start</Text>

        {/* Smoke test button & output */}
        <View style={{ marginTop: 16 }}>
          <AppButton title="Run domain smoke" onPress={runDomainSmoke} />
          {!!smokeResult && <Text style={{ marginTop: 8 }}>{smokeResult}</Text>}
        </View>

        {!workout && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ marginBottom: 8 }}>Templates</Text>
            <AppButton title="Start Day A" onPress={startDayA} />
          </View>
        )}

        {workout && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "600" }}>Session for {workout.dateISO}</Text>
            <FlatList
              style={{ marginTop: 8 }}
              data={workout.logs}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item, index }) => {
                const name = repo.getExerciseName(item.exerciseId) ?? "Unknown";
                return (
                  <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                    <Text>{index + 1}. {name}</Text>
                    <Text style={{ color: "#666" }}>Sets: {item.sets.length}</Text>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Start" component={StartScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

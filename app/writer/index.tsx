import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { WriterProfile } from "../../types";

export default function WriterDirectoryScreen() {
  const [writers, setWriters] = useState<WriterProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWriters();
  }, []);

  const fetchWriters = async () => {
    try {
      // In a real app, filtering by role='WRITER' would handle this.
      // Since we're using a single 'profiles' table, we filter key accounts.
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "WRITER");

      if (error) throw error;
      if (data) {
        const formattedWriters = data.map((p) => ({
          id: p.id,
          username: p.username,
          email: p.email, // Note: sensitive info usually kept private
          role: "WRITER" as const,
          avatarUrl: p.avatar_url,
          bio: p.bio,
          isProWriter: true,
          expertise: p.expertise || [],
          rating: p.rating || 5.0,
          completedJobs: p.completed_jobs || 0,
          portfolio: [],
        }));
        setWriters(formattedWriters);
      } else {
        // Fallback mock if database is empty for demo
        setWriters(MOCK_WRITERS);
      }
    } catch (e) {
      console.error(e);
      // Use mock data on error for demo continuity
      setWriters(MOCK_WRITERS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-carbon pt-12">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-6 pb-6 border-b border-gray-800">
        <Text className="text-electricBlue text-xs font-ui tracking-[0.3em] mb-1">
          THE SOURCE
        </Text>
        <Text className="text-white text-3xl font-heading">
          Writer Directory
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {loading ? (
          <ActivityIndicator color="#00F0FF" />
        ) : (
          <View className="gap-4 pb-12">
            {writers.map((writer) => (
              <TouchableOpacity
                key={writer.id}
                onPress={() => router.push(`/writer/${writer.id}`)}
                className="bg-graphite p-4 rounded-lg flex-row gap-4 border border-gray-700"
              >
                <Image
                  source={{
                    uri:
                      writer.avatarUrl ||
                      "https://images.unsplash.com/photo-1549834125-9bfc08873280?w=200",
                  }}
                  className="w-20 h-20 rounded bg-gray-600"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-white font-heading text-xl">
                      {writer.username}
                    </Text>
                    <Text className="text-gold font-bold text-xs">
                      ★ {writer.rating}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-xs font-body line-clamp-2 my-1">
                    {writer.bio ||
                      "Professional music journalist available for features."}
                  </Text>

                  <View className="flex-row flex-wrap gap-2 mt-2">
                    {writer.expertise?.slice(0, 3).map((tag) => (
                      <View
                        key={tag}
                        className="bg-carbon px-2 py-1 rounded border border-gray-800"
                      >
                        <Text className="text-electricBlue text-[10px] font-ui uppercase">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Fallback Mock Data
const MOCK_WRITERS: WriterProfile[] = [
  {
    id: "w1",
    username: "Sarah Jenkins",
    email: "sarah@voltage.com",
    role: "WRITER",
    isProWriter: true,
    bio: "Senior editor specializing in Industrial and Hyperpop scenes.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    expertise: ["Industrial", "Hyperpop", "Reviews"],
    rating: 4.9,
    completedJobs: 142,
    portfolio: [],
  },
  {
    id: "w2",
    username: "Marcus V",
    email: "mv@voltage.com",
    role: "WRITER",
    isProWriter: true,
    bio: "Documenting the rise of algorithmic noise music.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    expertise: ["Noise", "Algorithmic", "Essays"],
    rating: 4.7,
    completedJobs: 89,
    portfolio: [],
  },
];

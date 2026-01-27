import { router, Stack, useLocalSearchParams } from "expo-router";
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

export default function WriterProfileScreen() {
  const { id } = useLocalSearchParams();
  const [writer, setWriter] = useState<WriterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchWriter();
  }, [id]);

  const fetchWriter = async () => {
    try {
      // First check if it's a mock ID for demo purposes
      if (id === "w1" || id === "w2") {
        const mock = MOCK_WRITERS.find((w) => w.id === id);
        if (mock) setWriter(mock);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setWriter({
          id: data.id,
          username: data.username,
          email: data.email,
          role: "WRITER",
          isProWriter: true,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          expertise: data.expertise || [],
          rating: data.rating || 5.0,
          completedJobs: data.completed_jobs || 0,
          hourlyRate: 85, // Default for now
          portfolio: [],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 bg-carbon items-center justify-center">
        <ActivityIndicator color="#00F0FF" />
      </View>
    );
  if (!writer)
    return (
      <View className="flex-1 bg-carbon items-center justify-center">
        <Text className="text-white">Writer not found.</Text>
      </View>
    );

  return (
    <>
      <Stack.Screen
        options={{
          title: writer.username,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#E0E0E0",
          headerTitleStyle: { fontFamily: "PlayfairDisplay-Bold" },
        }}
      />

      <ScrollView className="flex-1 bg-carbon">
        {/* Header Section */}
        <View className="items-center pt-8 pb-6 px-4 border-b border-graphite">
          <Image
            source={{
              uri:
                writer.avatarUrl ||
                "https://images.unsplash.com/photo-1549834125-9bfc08873280?w=200",
            }}
            className="w-24 h-24 rounded-full border-2 border-electricBlue mb-4"
          />
          <Text className="text-2xl text-platinum font-bold font-heading">
            {writer.username}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-electricBlue font-ui tracking-wider text-xs bg-graphite px-2 py-1 rounded border border-electricBlue/30">
              PRO WRITER
            </Text>
            <Text className="text-gold ml-3 font-bold">
              ★ {writer.rating} ({writer.completedJobs} jobs)
            </Text>
          </View>
        </View>

        {/* Bio & Hire Section */}
        <View className="p-6">
          <Text className="text-gray-400 font-ui mb-2 text-xs uppercase tracking-widest">
            About
          </Text>
          <Text className="text-platinum font-body leading-6 mb-6">
            {writer.bio || "No bio available."}
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-8">
            {writer.expertise.map((tag) => (
              <View
                key={tag}
                className="bg-graphite px-3 py-1 rounded-full border border-gray-700"
              >
                <Text className="text-gray-300 text-xs font-ui">{tag}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push(`/questionnaire/${writer.id}`)}
              className="bg-electricBlue py-4 rounded-lg items-center shadow-lg shadow-electricBlue/20 active:opacity-90"
            >
              <Text className="text-carbon font-bold font-ui tracking-wider text-base">
                HIRE FOR FEATURE (${writer.hourlyRate}/hr)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-graphite border border-gray-700 py-4 rounded-lg items-center">
              <Text className="text-platinum font-ui tracking-wider">
                VIEW PORTFOLIO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// Keeping mocks for fallback demo
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
    hourlyRate: 85,
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
    hourlyRate: 75,
    portfolio: [],
  },
];

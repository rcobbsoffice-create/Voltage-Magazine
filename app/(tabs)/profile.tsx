import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../ctx";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      // Alert.alert('Error loading user data!');
      console.log(error.message);
    }
  };

  if (!session) {
    return (
      <View className="flex-1 bg-carbon items-center justify-center p-6 gap-6">
        <StatusBar style="light" />
        <Stack.Screen options={{ headerShown: false }} />

        <Text className="text-white font-heading text-3xl text-center">
          Identity Required
        </Text>
        <Text className="text-gray-400 text-center mb-4">
          Access to the network is restricted. Please identify yourself.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-electricBlue py-4 px-12 rounded shadow-lg shadow-electricBlue/20"
        >
          <Text className="text-carbon font-bold font-ui tracking-wider">
            LOGIN / SIGNUP
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-carbon pt-12">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-6 pb-6 border-b border-gray-800 flex-row items-center justify-between">
        <Text className="text-white font-heading text-3xl">Profile</Text>
        <TouchableOpacity onPress={signOut}>
          <Text className="text-red-500 font-ui text-xs tracking-widest border border-red-500/50 px-3 py-1 rounded">
            DISCONNECT
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* User Info */}
        <View className="items-center py-8 border-b border-gray-800 bg-graphite">
          <View className="w-24 h-24 rounded-full bg-electricBlue/10 items-center justify-center border-2 border-electricBlue mb-4">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Text className="text-electricBlue font-heading text-4xl">
                {session.user.email?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text className="text-white font-heading text-xl mb-1">
            {profile?.username || "Anonymous User"}
          </Text>
          <Text className="text-gray-500 font-ui text-xs tracking-wider uppercase">
            {profile?.role || "User"} access
          </Text>
          <Text className="text-gray-600 text-xs mt-2">
            {session.user.email}
          </Text>
        </View>

        {/* Settings / Options */}
        <View className="p-6 gap-4">
          <TouchableOpacity className="flex-row items-center justify-between bg-graphite p-4 rounded border border-gray-700">
            <Text className="text-platinum font-ui">My Saved Articles</Text>
            <Text className="text-gray-500">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-graphite p-4 rounded border border-gray-700">
            <Text className="text-platinum font-ui">Account Settings</Text>
            <Text className="text-gray-500">→</Text>
          </TouchableOpacity>

          {profile?.role === "WRITER" && (
            <TouchableOpacity className="flex-row items-center justify-between bg-graphite p-4 rounded border border-electricBlue/30">
              <Text className="text-electricBlue font-ui">
                Writer Dashboard
              </Text>
              <Text className="text-electricBlue">→</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

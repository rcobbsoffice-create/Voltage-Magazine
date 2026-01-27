import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert(
          "Success",
          "Please check your inbox for email verification!",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Router replacement handled by AuthProvider protected route
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-carbon justify-center p-6">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="mb-12">
        <Text className="text-electricBlue text-xs font-ui tracking-[0.3em] mb-1">
          WELCOME TO THE UNDERGROUND
        </Text>
        <Text className="text-white text-5xl font-heading tracking-tighter">
          VOLTAGE
        </Text>
      </View>

      <View className="gap-4">
        <View>
          <Text className="text-gray-400 font-ui text-xs mb-2 ml-1">
            IDENTITY
          </Text>
          <TextInput
            className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-400 font-ui text-xs mb-2 ml-1">KEY</Text>
          <TextInput
            className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleAuth}
          disabled={loading}
          className="bg-electricBlue py-4 rounded mt-4 items-center shadow-lg shadow-electricBlue/20"
        >
          {loading ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text className="text-carbon font-bold font-ui tracking-wider text-base">
              {isSignUp ? "INITIATE SEQUENCE" : "ACCESS TERMINAL"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          className="mt-4 items-center"
        >
          <Text className="text-gray-500 font-ui text-xs">
            {isSignUp
              ? "Already have an identity? Login"
              : "New along the wire? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

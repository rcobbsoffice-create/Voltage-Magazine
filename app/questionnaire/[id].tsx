import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import PaymentModal from "../../components/PaymentModal";
import { generateArticleFromAnswers } from "../../services/ai";

export default function QuestionnaireScreen() {
  const { id: writerId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    bioPoints: "",
    influences: "",
    latestRelease: "",
    deepCut: "",
  });

  const isHiringSpecificWriter = writerId && writerId !== "q1";

  const handlePreSubmit = () => {
    if (!formData.artistName)
      return Alert.alert("Missing Info", "Please enter an artist name.");

    if (isHiringSpecificWriter) {
      setShowPayment(true);
    } else {
      handleSubmit();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const article = await generateArticleFromAnswers(
        formData.artistName,
        formData.genre,
        formData.bioPoints,
        formData.influences,
        formData.deepCut,
      );

      // If hiring a specific writer, override the author details with the Writer ID
      if (isHiringSpecificWriter) {
        // For this demo, we simulate it by setting the author to a "Pro" indicator
        article.author.username = "HIRED PRO";
      }

      console.log("Generated Article:", article);
      router.push({
        pathname: "/article/preview",
        params: { data: JSON.stringify(article) },
      });
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Error",
        "Failed to generate story. Please check your connection or API key.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: isHiringSpecificWriter ? "Hire Request" : "VOLTAGE Spotlight",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#E0E0E0",
          headerTitleStyle: { fontFamily: "PlayfairDisplay-Bold" },
        }}
      />

      <ScrollView className="flex-1 bg-carbon">
        <View className="p-6 pb-12 max-w-2xl w-full self-center">
          {/* Intro */}
          <View className="mb-8 border-l-2 border-electricBlue pl-4">
            <Text className="text-electricBlue font-ui text-xs tracking-widest mb-2">
              ARTIST FEATURE
            </Text>
            <Text className="text-white text-3xl font-heading mb-2">
              {isHiringSpecificWriter
                ? "Brief Your Writer."
                : "Tell Your Story."}
            </Text>
            <Text className="text-gray-400 font-body">
              {isHiringSpecificWriter
                ? "Provide the raw data for your hired professional to craft into a masterpiece."
                : "Answer these questions to help our writers (and AI engine) craft your feature story."}
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-6">
            <View>
              <Text className="text-platinum font-ui mb-2">
                ARTIST / BAND NAME
              </Text>
              <TextInput
                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
                placeholder="e.g. The Neon Hearts"
                placeholderTextColor="#666"
                value={formData.artistName}
                onChangeText={(t) =>
                  setFormData({ ...formData, artistName: t })
                }
              />
            </View>

            <View>
              <Text className="text-platinum font-ui mb-2">PRIMARY GENRE</Text>
              <TextInput
                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
                placeholder="e.g. Industrial Techno"
                placeholderTextColor="#666"
                value={formData.genre}
                onChangeText={(t) => setFormData({ ...formData, genre: t })}
              />
            </View>

            <View>
              <Text className="text-platinum font-ui mb-2">KEY BIO POINTS</Text>
              <Text className="text-gray-500 text-xs mb-2">
                Where are you from? How did you start?
              </Text>
              <TextInput
                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue h-24"
                multiline
                placeholderTextColor="#666"
                style={{ textAlignVertical: "top" }}
                value={formData.bioPoints}
                onChangeText={(t) => setFormData({ ...formData, bioPoints: t })}
              />
            </View>

            <View>
              <Text className="text-platinum font-ui mb-2">INFLUENCES</Text>
              <TextInput
                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
                placeholder="e.g. Nine Inch Nails, Prince, The Prodigy"
                placeholderTextColor="#666"
                value={formData.influences}
                onChangeText={(t) =>
                  setFormData({ ...formData, influences: t })
                }
              />
            </View>

            <View>
              <Text className="text-platinum font-ui mb-2">
                DEEP CUT QUESTION
              </Text>
              <Text className="text-electricBlue text-sm mb-2 font-bold italic">
                "What is the one thing you want fans to feel when they hear your
                track?"
              </Text>
              <TextInput
                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue h-24"
                multiline
                placeholderTextColor="#666"
                style={{ textAlignVertical: "top" }}
                value={formData.deepCut}
                onChangeText={(t) => setFormData({ ...formData, deepCut: t })}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handlePreSubmit}
              disabled={loading}
              className={`bg-electricBlue py-4 rounded mt-4 items-center shadow-lg shadow-electricBlue/20 ${loading ? "opacity-50" : "opacity-100"}`}
            >
              <Text className="text-carbon font-bold font-ui tracking-wider text-base">
                {loading
                  ? "TRANSMITTING..."
                  : isHiringSpecificWriter
                    ? "PROCEED TO PAYMENT ($85)"
                    : "SUBMIT ANSWERS"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={85}
        title="Hire Professional"
        description={`Secure a feature story written by a Voltage Pro. Your funds are held in escrow until the draft is delivered.`}
      />
    </>
  );
}

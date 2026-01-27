import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import PaymentModal from "../../components/PaymentModal";
import { useAuth } from "../../ctx";

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams();
  const { isPremium, upgradeToPro } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    // TODO: Replace with actual API fetch
    // Simulating fetch for now
    setArticle({
      title: "Future of Sound",
      coverImage:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
      author: { username: "SonicMaster" },
      publishedAt: new Date().toISOString(),
      excerpt:
        "Explore the depths of sonic innovation and what it means for the next generation of producers.",
      content:
        "This is a meaningful article content that would typically be fetched from a database. " +
        "It contains markdown formatting and provides value to the user.\n\n" +
        "# Chapter 1\nThis is a heading.\n\n" +
        "Referencing the deep learning algorithms that power modern synthesis...",
      isPremium: true,
    });
  }, [slug]);

  const isLocked = article?.isPremium && !isPremium;

  const handleUpgrade = () => {
    upgradeToPro();
    setShowPaywall(false);
    Alert.alert("Welcome", "You now have full access to the signal.");
  };

  if (!article) {
    return (
      <View className="flex-1 bg-carbon items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerTintColor: "#fff",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView className="flex-1 bg-carbon">
        {/* Hero Section */}
        <View className="h-[500px] w-full relative">
          <Image
            source={{ uri: article.coverImage }}
            className="w-full h-full"
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(18, 18, 18, 0.6)",
              "rgba(18, 18, 18, 1)",
            ]}
            className="absolute inset-0"
          />
          <View className="absolute bottom-0 w-full p-8 pb-12">
            <View className="flex-row items-center mb-4">
              <View className="bg-electricBlue/20 px-3 py-1 rounded border border-electricBlue/50 mr-3">
                <Text className="text-electricBlue font-ui text-xs tracking-widest uppercase">
                  FEATURE STORY
                </Text>
              </View>
              <Text className="text-gray-300 font-ui text-xs tracking-[0.2em] uppercase">
                VOLTAGE • {article.author.username}
              </Text>
            </View>

            <Text className="text-white text-5xl font-heading leading-[52px] shadow-lg mb-4">
              {article.title}
            </Text>

            {article.isPremium && (
              <View className="self-start bg-gold/20 border border-gold px-3 py-1.5 rounded mt-2 flex-row items-center">
                <Text className="text-gold text-[10px] font-bold tracking-wider mr-2">
                  PREMIUM ACCESS
                </Text>
                <View className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              </View>
            )}
          </View>
        </View>

        {/* Article Content */}
        <View className="px-6 py-8 relative max-w-3xl mx-auto w-full">
          {/* Meta Info & Excerpt */}
          <View className="flex-row items-center mb-10 pb-6 border-b border-surfaceHighlight">
            <View className="w-12 h-12 rounded-full bg-surfaceHighlight items-center justify-center border border-surface mr-4 shadow-md">
              <Text className="text-electricBlue font-bold text-lg">
                {article.author.username.charAt(0)}
              </Text>
            </View>
            <View>
              <Text className="text-platinum font-ui text-sm uppercase tracking-wide mb-1">
                {article.author.username}
              </Text>
              <Text className="text-gray-500 text-xs tracking-wider">
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <Text className="text-gold font-body text-2xl italic mb-10 leading-9 opacity-90 pl-4 border-l-2 border-gold/50">
            {article.excerpt}
          </Text>

          {/* Markdown Body with Paywall Logic */}
          <View className="relative">
            <Markdown
              style={{
                body: {
                  color: "#E0E0E0",
                  fontFamily: "Inter-Regular",
                  fontSize: 18,
                  lineHeight: 30,
                },
                heading1: {
                  color: "#FFFFFF",
                  fontFamily: "PlayfairDisplay-Bold",
                  fontSize: 32,
                  marginTop: 32,
                  marginBottom: 16,
                },
                heading2: {
                  color: "#FFFFFF",
                  fontFamily: "PlayfairDisplay-Bold",
                  fontSize: 26,
                  marginTop: 28,
                  marginBottom: 14,
                },
                paragraph: { marginBottom: 24 },
                blockquote: {
                  borderLeftColor: "#FFD700",
                  borderLeftWidth: 4,
                  paddingLeft: 16,
                  fontStyle: "italic",
                  color: "#FFD700",
                  backgroundColor: "rgba(255, 215, 0, 0.05)",
                  paddingVertical: 8,
                  marginTop: 8,
                  marginBottom: 24,
                },
                link: { color: "#00F0FF", textDecorationLine: "underline" },
              }}
            >
              {isLocked
                ? article.content.substring(0, 400) + "..."
                : article.content}
            </Markdown>

            {/* Paywall Overlay */}
            {isLocked && (
              <View className="absolute inset-0 top-32 items-center justify-end pb-20">
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(18, 18, 18, 0.9)",
                    "rgba(18, 18, 18, 1)",
                  ]}
                  className="absolute inset-0 w-full h-full"
                />
                <BlurView
                  intensity={20}
                  tint="dark"
                  className="absolute inset-0 w-full h-full"
                />

                <View className="bg-surface p-8 rounded-2xl border border-surfaceHighlight items-center shadow-2xl w-[90%] max-w-md mx-auto relative overflow-hidden">
                  <View className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-electricBlue to-transparent opacity-50" />

                  <View className="w-16 h-16 rounded-full bg-surfaceHighlight items-center justify-center mb-6 border border-surface">
                    <Text className="text-3xl">🔒</Text>
                  </View>

                  <Text className="text-white font-heading text-3xl mb-3 text-center">
                    Exclusive Content
                  </Text>
                  <Text className="text-gray-400 text-center mb-8 leading-6">
                    Unlock this deep-dive feature and gain access to the entire
                    Voltage archive.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPaywall(true)}
                    className="bg-electricBlue w-full py-4 rounded shadow-lg shadow-electricBlue/20 active:scale-95 transition-transform"
                  >
                    <Text className="text-carbon font-bold font-ui tracking-widest text-center text-lg">
                      SUBSCRIBE ($5/mo)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          {!isLocked && (
            <View className="mt-20 pt-10 border-t border-surfaceHighlight items-center">
              <Text className="text-gray-600 font-ui text-[10px] tracking-[0.5em] mb-6 uppercase">
                END OF FREQUENCY
              </Text>
              <View className="w-16 h-1 bg-surfaceHighlight rounded-full mb-8" />
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1549834125-9bfc08873280?q=80&w=200&auto=format&fit=crop",
                }}
                className="w-12 h-12 rounded-full opacity-20 filter grayscale"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={handleUpgrade}
        amount={5}
        title="Voltage Premium"
        description="Unlimited access to deep-dive journalism, weekly reports, and our full archive."
      />
    </>
  );
}

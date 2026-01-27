import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from "../lib/supabase";
import { Article } from "../types";

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedArticles: Article[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          coverImage: item.cover_image,
          author: item.author_json,
          publishedAt: item.published_at,
          isPremium: item.is_premium,
        }));
        // Small delay to allow animation to replay on refresh
        setArticles([]);
        setTimeout(() => setArticles(formattedArticles), 100);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchArticles();
  }, []);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.slice(1);

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-carbon pt-12">
        {/* Header Logo Area */}
        <View className="px-6 pb-6 border-b border-surfaceHighlight flex-row justify-between items-end bg-carbon z-10">
          <View>
            <Text className="text-electricBlue text-xs font-ui tracking-[0.3em] mb-1">
              MAGAZINE
            </Text>
            <Text className="text-platinum text-4xl font-heading tracking-tighter">
              VOLTAGE
            </Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-gold/10 items-center justify-center border border-gold/50">
            <Text className="text-gold font-bold">V</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00F0FF"
            />
          }
        >
          {/* Featured Hero Article */}
          {featuredArticle ? (
            <Animated.View entering={FadeIn.duration(800)}>
              <TouchableOpacity
                onPress={() => router.push(`/article/${featuredArticle.slug}`)}
                className="h-[460px] bg-graphite relative border-b border-surfaceHighlight"
              >
                <Image
                  source={{ uri: featuredArticle.coverImage }}
                  className="absolute w-full h-full"
                />
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(18, 18, 18, 0.4)",
                    "rgba(18, 18, 18, 1)",
                  ]}
                  className="absolute inset-0"
                />

                <View className="absolute bottom-0 w-full p-8">
                  <View className="flex-row items-center mb-3">
                    <View className="bg-electricBlue/20 px-2 py-1 rounded mr-2 border border-electricBlue/50">
                      <Text className="text-electricBlue text-[10px] font-bold tracking-widest">
                        COVER STORY
                      </Text>
                    </View>
                    <Text className="text-gray-300 text-xs font-ui tracking-widest uppercase">
                      {featuredArticle.author.username}
                    </Text>
                  </View>

                  <Text className="text-white text-4xl font-heading leading-10 mb-3 shadow-sm">
                    {featuredArticle.title}
                  </Text>
                  <Text className="text-gray-300 font-body text-base line-clamp-2 leading-6">
                    {featuredArticle.excerpt}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View className="h-[400px] bg-graphite items-center justify-center border-b border-gray-800">
              <Text className="text-gray-500 font-ui italic">
                No cover story available.
              </Text>
            </View>
          )}

          {/* "Hire a Writer" CTA Section (Monetization) */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            className="p-8 bg-surface border-y border-surfaceHighlight my-6 mx-4 rounded-xl shadow-lg"
          >
            <Text className="text-gold font-ui text-xs tracking-widest mb-2 opacity-80">
              PROFESSIONAL NETWORK
            </Text>
            <Text className="text-white font-heading text-2xl mb-4 leading-8">
              Need a Rolling Stone quality write-up?
            </Text>
            <Link href="/writer" asChild>
              <TouchableOpacity className="bg-transparent border border-electricBlue/80 py-3 px-8 rounded self-start hover:bg-electricBlue/10 transition-colors">
                <Text className="text-electricBlue font-ui font-bold tracking-wider">
                  FIND A WRITER
                </Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Latest Feed */}
          <View className="px-6 pb-20 gap-8">
            <View className="flex-row items-center justify-between border-b border-surfaceHighlight pb-2 mb-2">
              <Text className="text-platinum font-ui text-lg tracking-wide">
                LATEST DROPS
              </Text>
              <View className="w-2 h-2 rounded-full bg-electricBlue animate-pulse" />
            </View>

            {loading && articles.length === 0 ? (
              <Text className="text-gray-500 italic mt-8 text-center">
                Scanning the frequency...
              </Text>
            ) : articles.length === 0 ? (
              <Text className="text-gray-500 italic mt-8 text-center">
                The feed is silent... for now.
              </Text>
            ) : (
              remainingArticles.map((article, index) => (
                <Animated.View
                  key={article.id}
                  entering={FadeInDown.delay((index + 2) * 100).duration(600)}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/article/${article.slug}`)}
                    className="flex-row gap-5"
                  >
                    <View className="w-28 h-28 bg-surface rounded-lg overflow-hidden shadow-md">
                      <Image
                        source={{ uri: article.coverImage }}
                        className="w-full h-full"
                      />
                    </View>
                    <View className="flex-1 py-1">
                      <Text className="text-electricBlue text-[10px] font-ui mb-2 uppercase tracking-wider opacity-80">
                        {article.author.username} •{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </Text>
                      <Text className="text-white font-heading text-xl leading-6 mb-2">
                        {article.title}
                      </Text>
                      <Text
                        className="text-gray-400 text-xs font-body line-clamp-2"
                        numberOfLines={2}
                      >
                        {article.excerpt}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

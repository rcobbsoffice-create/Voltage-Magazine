import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Article } from "../../types";

// Simple debounce hook could be added, but for now we'll just search on submit or loose debounce
export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "ARTICLES" | "WRITERS"
  >("ALL");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial "Trending" fetch
  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(5);

      if (data) setResults(mapArticles(data));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchTrending();

    setLoading(true);
    try {
      // Simple ILIKE search on title or excerpt
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .order("published_at", { ascending: false });

      if (data) setResults(mapArticles(data));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const mapArticles = (data: any[]): Article[] => {
    return data.map((item) => ({
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
  };

  return (
    <View className="flex-1 bg-carbon pt-12">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header / Search Area */}
      <View className="px-6 pb-4 border-b border-gray-800">
        <Text className="text-white font-heading text-3xl mb-4">Explore</Text>

        <View className="flex-row bg-graphite border border-gray-700 rounded-lg p-3 items-center">
          <Text className="text-gray-500 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-white font-body"
            placeholder="Search articles, artists, sounds..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                fetchTrending();
              }}
            >
              <Text className="text-gray-500">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 flex-row gap-3"
        >
          {["ALL", "ARTICLES", "WRITERS"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-full border ${activeFilter === filter ? "bg-electricBlue border-electricBlue" : "bg-transparent border-gray-600"}`}
            >
              <Text
                className={`text-xs font-bold tracking-wider ${activeFilter === filter ? "text-carbon" : "text-gray-400"}`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-gray-500 font-ui text-xs tracking-widest mb-4 uppercase">
          {searchQuery ? "SEARCH RESULTS" : "TRENDING NOW"}
        </Text>

        {loading ? (
          <ActivityIndicator color="#00F0FF" className="mt-10" />
        ) : results.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-gray-600 font-heading text-xl">
              No Signal Found
            </Text>
            <Text className="text-gray-700 text-sm mt-2">
              Try adjusting your frequency.
            </Text>
          </View>
        ) : (
          <View className="gap-6 pb-20">
            {results.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/article/${article.slug}`)}
                className="flex-row gap-4 border-b border-gray-800 pb-4"
              >
                <Image
                  source={{ uri: article.coverImage }}
                  className="w-20 h-20 rounded bg-gray-800"
                />
                <View className="flex-1">
                  <Text className="text-electricBlue text-[10px] font-ui mb-1 uppercase">
                    {article.author.username}
                  </Text>
                  <Text className="text-white font-heading text-lg leading-6 mb-1">
                    {article.title}
                  </Text>
                  <Text className="text-gray-500 text-xs line-clamp-1">
                    {article.excerpt}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { supabase } from "../../lib/supabase";
import { Stack, router } from "expo-router";
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

export default function AdminScreen() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    // TODO: Join with real profiles table if needed, for now using raw data
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const StatCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string;
    color: string;
  }) => (
    <View className="bg-surface p-4 rounded-xl border border-surfaceHighlight flex-1 shadow-sm">
      <Text className="text-gray-400 text-[10px] font-ui tracking-widest uppercase mb-1">
        {label}
      </Text>
      <Text className={`text-2xl font-heading ${color}`}>{value}</Text>
    </View>
  );

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: "Admin Dashboard",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#E0E0E0",
          headerTitleStyle: { fontFamily: "PlayfairDisplay-Bold" },
        }}
      />

      <ScrollView
        className="flex-1 bg-carbon"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchArticles}
            tintColor="#fff"
          />
        }
      >
        <View className="p-6">
          {/* Stats Row */}
          <View className="flex-row gap-4 mb-8">
            <StatCard
              label="Total Content"
              value={articles.length.toString()}
              color="text-white"
            />
            <StatCard
              label="Live Readers"
              value="1.2k"
              color="text-electricBlue"
            />
            <StatCard label="Revenue" value="$4.5k" color="text-gold" />
          </View>

          <Text className="text-white font-heading text-2xl mb-6 flex-row items-center">
            Management Console
          </Text>

          <TouchableOpacity
            className="bg-electricBlue py-4 rounded-xl mb-8 shadow-lg shadow-electricBlue/20 flex-row items-center justify-center border border-electricBlue/50"
            onPress={() => router.push("/questionnaire/new-invite")}
          >
            <Text className="text-carbon font-bold font-ui tracking-wider mr-2">
              GENERATE NEW INVITE LINK
            </Text>
            <Text className="text-carbon font-bold text-lg">→</Text>
          </TouchableOpacity>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-gray-400 font-ui text-xs tracking-widest uppercase">
              Content Library
            </Text>
          </View>

          <View className="gap-4">
            {articles.map((article) => (
              <View
                key={article.id}
                className="bg-surface p-4 rounded-xl border border-surfaceHighlight flex-row gap-4 shadow-sm"
              >
                <Image
                  source={{
                    uri:
                      article.cover_image || "https://via.placeholder.com/100",
                  }}
                  className="w-20 h-20 rounded bg-gray-700"
                />
                <View className="flex-1 justify-between py-0.5">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text
                        className="text-platinum font-bold text-base mb-1 flex-1 pr-2 leading-5"
                        numberOfLines={2}
                      >
                        {article.title}
                      </Text>
                      <View
                        className={`px-2 py-0.5 rounded border ${article.status === "published" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-gray-700/30 border-gray-600"}`}
                      >
                        <Text
                          className={`text-[9px] font-bold uppercase tracking-wider ${article.status === "published" ? "text-emerald-400" : "text-gray-400"}`}
                        >
                          {article.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-500 text-xs italic line-clamp-1 mt-1">
                      By{" "}
                      {typeof article.author_json === "string"
                        ? JSON.parse(article.author_json).username
                        : article.author_json?.username || "Unknown"}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-gray-600 text-[10px] uppercase tracking-widest">
                      {new Date(article.created_at).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity className="bg-surfaceHighlight px-3 py-1 rounded border border-gray-700">
                      <Text className="text-xs text-white">Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {articles.length === 0 && !loading && (
              <View className="items-center justify-center py-10 opacity-50">
                <Text className="text-gray-500 italic">
                  No articles yet. Send an artist invite!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Article } from '../../types';

import { supabase } from '../lib/supabase';

export default function ArticlePreviewScreen() {
    const { data } = useLocalSearchParams();
    const article: Article | null = data ? JSON.parse(data as string) : null;
    const [saving, setSaving] = React.useState(false);

    if (!article) {
        return (
            <View className="flex-1 bg-carbon items-center justify-center">
                <Text className="text-white">No article data found.</Text>
            </View>
        );
    }

    const handlePublish = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('articles')
                .insert({
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    content: article.content,
                    cover_image: article.coverImage,
                    author_json: article.author,
                    status: 'published',
                    published_at: new Date().toISOString()
                });

            if (error) throw error;

            Alert.alert("Success", "Article published to Home Feed!");
            router.push("/");

        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to save article");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <StatusBar style="light" />
            <Stack.Screen options={{
                title: "Draft Preview",
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#E0E0E0',
            }} />

            <ScrollView className="flex-1 bg-carbon">
                {/* Cover Image */}
                <Image
                    source={{ uri: article.coverImage }}
                    className="w-full h-72"
                />

                <View className="p-6">
                    <Text className="text-electricBlue font-ui text-xs tracking-widest mb-2 uppercase">
                        {article.author.username} GENESIS
                    </Text>

                    <Text className="text-white text-3xl font-heading leading-8 mb-4">
                        {article.title}
                    </Text>

                    <Text className="text-gray-400 font-body text-lg italic mb-6 border-l-2 border-gold pl-4">
                        {article.excerpt}
                    </Text>

                    {/* Content Rendering (Simple Text for now, Markdown later) */}
                    <Text className="text-platinum font-body leading-7 text-base">
                        {article.content}
                    </Text>
                </View>

                {/* Action Bar */}
                <View className="p-6 pb-12 border-t border-gray-800 bg-graphite">
                    <Text className="text-gray-400 text-xs mb-3 text-center">AI GENERATED DRAFT</Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            className="flex-1 bg-transparent border border-gray-600 py-4 rounded items-center"
                            onPress={() => router.back()}
                        >
                            <Text className="text-white font-ui font-bold">RETRY / EDIT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-electricBlue py-4 rounded items-center shadow-lg shadow-electricBlue/20"
                            onPress={handlePublish}
                        >
                            <Text className="text-carbon font-bold font-ui font-bold">PUBLISH</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

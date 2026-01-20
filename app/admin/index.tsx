import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { Article } from '../../types';

export default function AdminScreen() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        setLoading(true);
        // TODO: Join with real profiles table if needed, for now using raw data
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setArticles(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <>
            <StatusBar style="light" />
            <Stack.Screen options={{
                title: "Admin Dashboard",
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#E0E0E0',
            }} />

            <ScrollView
                className="flex-1 bg-carbon"
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchArticles} tintColor="#fff" />}
            >
                <View className="p-6">
                    <Text className="text-white font-heading text-2xl mb-6">Latest Content</Text>

                    <TouchableOpacity
                        className="bg-electricBlue py-3 px-6 rounded mb-8 self-start shadow-lg shadow-electricBlue/20"
                        onPress={() => router.push('/questionnaire/new-invite')}
                    >
                        <Text className="text-carbon font-bold font-ui">GENERATE NEW INVITE LINK</Text>
                    </TouchableOpacity>

                    <View className="gap-4">
                        {articles.map((article) => (
                            <View key={article.id} className="bg-graphite p-4 rounded border border-gray-800 flex-row gap-4">
                                <Image
                                    source={{ uri: article.cover_image || 'https://via.placeholder.com/100' }}
                                    className="w-16 h-16 rounded bg-gray-700"
                                />
                                <View className="flex-1">
                                    <Text className="text-platinum font-bold text-base mb-1" numberOfLines={1}>
                                        {article.title}
                                    </Text>
                                    <Text className="text-gray-400 text-xs mb-2">
                                        Status: <Text className="text-electricBlue uppercase">{article.status}</Text>
                                    </Text>
                                    <Text className="text-gray-500 text-xs italic">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {articles.length === 0 && !loading && (
                            <Text className="text-gray-500 italic">No articles yet. Send an artist invite!</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

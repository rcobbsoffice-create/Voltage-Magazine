import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { generateArticleFromAnswers } from '../services/ai';

export default function QuestionnaireScreen() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        artistName: '',
        genre: '',
        bioPoints: '',
        influences: '',
        latestRelease: '',
        deepCut: ''
    });

    const handleSubmit = async () => {
        if (!formData.artistName) return Alert.alert("Missing Info", "Please enter an artist name.");

        setLoading(true);
        try {
            const article = await generateArticleFromAnswers(
                formData.artistName,
                formData.genre,
                formData.bioPoints,
                formData.influences,
                formData.deepCut
            );

            // In a real app, we'd save this to Supabase. 
            // For now, let's just pass it to a preview screen (or log it)
            console.log("Generated Article:", article);

            // Navigate to a "Draft Preview" page 
            // (For simplicity in this step, we just alert success, but next we build the preview)
            Alert.alert("Draft Ready!", `Title: ${article.title}`);

            // Store in global state or pass param (TODO: Build ArticleView)
            router.push({ pathname: "/article/preview", params: { data: JSON.stringify(article) } });

        } catch (e) {
            Alert.alert("Error", "Failed to generate story. Check API Key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar style="light" />
            <Stack.Screen options={{
                title: "VOLTAGE Spotlight",
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#E0E0E0',
                headerTitleStyle: { fontFamily: 'PlayfairDisplay-Bold' }
            }} />

            <ScrollView className="flex-1 bg-carbon">
                <View className="p-6 pb-12 max-w-2xl w-full self-center">

                    {/* Intro */}
                    <View className="mb-8 border-l-2 border-electricBlue pl-4">
                        <Text className="text-electricBlue font-ui text-xs tracking-widest mb-2">ARTIST FEATURE</Text>
                        <Text className="text-white text-3xl font-heading mb-2">Tell Your Story.</Text>
                        <Text className="text-gray-400 font-body">
                            Answer these questions to help our writers (and AI engine) craft your feature story. Be specific, be raw.
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View className="gap-6">

                        <View>
                            <Text className="text-platinum font-ui mb-2">ARTIST / BAND NAME</Text>
                            <TextInput
                                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue"
                                placeholder="e.g. The Neon Hearts"
                                placeholderTextColor="#666"
                                value={formData.artistName}
                                onChangeText={(t) => setFormData({ ...formData, artistName: t })}
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
                            <Text className="text-gray-500 text-xs mb-2">Where are you from? How did you start?</Text>
                            <TextInput
                                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue h-24"
                                multiline
                                placeholderTextColor="#666"
                                style={{ textAlignVertical: 'top' }}
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
                                onChangeText={(t) => setFormData({ ...formData, influences: t })}
                            />
                        </View>

                        <View>
                            <Text className="text-platinum font-ui mb-2">DEEP CUT QUESTION</Text>
                            <Text className="text-electricBlue text-sm mb-2 font-bold italic">
                                "What is the one thing you want fans to feel when they hear your track?"
                            </Text>
                            <TextInput
                                className="bg-graphite text-white p-4 rounded border border-gray-700 focus:border-electricBlue h-24"
                                multiline
                                placeholderTextColor="#666"
                                style={{ textAlignVertical: 'top' }}
                                value={formData.deepCut}
                                onChangeText={(t) => setFormData({ ...formData, deepCut: t })}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-electricBlue py-4 rounded mt-4 items-center shadow-lg shadow-electricBlue/20"
                        >
                            <Text className="text-carbon font-bold font-ui tracking-wider text-base">SUBMIT ANSWERS</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </>
    );
}

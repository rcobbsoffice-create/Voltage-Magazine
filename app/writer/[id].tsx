import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { WriterProfile } from '../../types';

// Mock Data for "Pro Writer" View
const mockWriter: WriterProfile = {
    id: 'w1',
    username: 'Sarah Jenkins',
    email: 'sarah@voltage.com',
    role: 'WRITER',
    isProWriter: true,
    bio: 'Senior Music Journalist covering the underground integration of Industrial and Pop. Previously at Rolling Stone & Pitchfork.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    expertise: ['Industrial', 'Hyperpop', 'Live Reviews'],
    rating: 4.9,
    completedJobs: 142,
    hourlyRate: 85,
    portfolio: []
};

export default function WriterProfileScreen() {
    return (
        <>
            <Stack.Screen options={{
                title: mockWriter.username,
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#E0E0E0',
                headerTitleStyle: { fontFamily: 'PlayfairDisplay-Bold' }
            }} />

            <ScrollView className="flex-1 bg-carbon">
                {/* Header Section */}
                <View className="items-center pt-8 pb-6 px-4 border-b border-graphite">
                    <Image
                        source={{ uri: mockWriter.avatarUrl }}
                        className="w-24 h-24 rounded-full border-2 border-electricBlue mb-4"
                    />
                    <Text className="text-2xl text-platinum font-bold font-heading">{mockWriter.username}</Text>
                    <View className="flex-row items-center mt-2">
                        <Text className="text-electricBlue font-ui tracking-wider text-xs bg-graphite px-2 py-1 rounded border border-electricBlue/30">
                            PRO WRITER
                        </Text>
                        <Text className="text-gold ml-3 font-bold">★ {mockWriter.rating} ({mockWriter.completedJobs} jobs)</Text>
                    </View>
                </View>

                {/* Bio & Hire Section */}
                <View className="p-6">
                    <Text className="text-gray-400 font-ui mb-2 text-xs uppercase tracking-widest">About</Text>
                    <Text className="text-platinum font-body leading-6 mb-6">{mockWriter.bio}</Text>

                    <View className="flex-row flex-wrap gap-2 mb-8">
                        {mockWriter.expertise.map((tag) => (
                            <View key={tag} className="bg-graphite px-3 py-1 rounded-full border border-gray-700">
                                <Text className="text-gray-300 text-xs font-ui">{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3">
                        <TouchableOpacity className="bg-electricBlue py-4 rounded-lg items-center shadow-lg shadow-electricBlue/20 active:opacity-90">
                            <Text className="text-carbon font-bold font-ui tracking-wider text-base">
                                HIRE FOR FEATURE (${mockWriter.hourlyRate}/hr)
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-graphite border border-gray-700 py-4 rounded-lg items-center">
                            <Text className="text-platinum font-ui tracking-wider">VIEW PORTFOLIO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

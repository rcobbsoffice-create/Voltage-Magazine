import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
    return (
        <>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-carbon pt-12">
                {/* Header Logo Area */}
                <View className="px-6 pb-6 border-b border-graphite flex-row justify-between items-end">
                    <View>
                        <Text className="text-electricBlue text-xs font-ui tracking-[0.3em] mb-1">MAGAZINE</Text>
                        <Text className="text-platinum text-4xl font-heading tracking-tighter">VOLTAGE</Text>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gold/20 items-center justify-center border border-gold">
                        <Text className="text-gold font-bold">V</Text>
                    </View>
                </View>

                <ScrollView className="flex-1">
                    {/* Featured Hero Article */}
                    <View className="h-[400px] bg-graphite relative">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1549834125-9bfc08873280?q=80&w=800&auto=format&fit=crop' }}
                            className="absolute w-full h-full opacity-60"
                        />
                        <View className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-carbon to-transparent">
                            <Text className="text-electricBlue font-ui text-xs tracking-widest mb-2">COVER STORY</Text>
                            <Text className="text-white text-3xl font-heading leading-8 mb-2">
                                The Rise of Digital Noise: How AI is Breaking Music
                            </Text>
                            <Text className="text-gray-300 font-body text-sm line-clamp-2">
                                An exclusive deep dive into the algorithmic underground.
                            </Text>
                        </View>
                    </View>

                    {/* "Hire a Writer" CTA Section (Monetization) */}
                    <View className="p-6 bg-graphite border-y border-gray-800 my-4">
                        <Text className="text-gold font-ui text-xs tracking-widest mb-3">PROFESSIONAL NETWORK</Text>
                        <Text className="text-white font-heading text-xl mb-4">
                            Need a Rolling Stone quality write-up?
                        </Text>
                        <Link href="/writer/w1" asChild>
                            <TouchableOpacity className="bg-transparent border border-electricBlue py-3 px-6 rounded self-start">
                                <Text className="text-electricBlue font-ui font-bold">FIND A WRITER</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Latest Feed */}
                    <View className="px-6 pb-10 gap-6">
                        <Text className="text-white font-ui text-lg border-b border-gray-800 pb-2 mb-2">LATEST DROPS</Text>

                        {[1, 2, 3].map((i) => (
                            <View key={i} className="flex-row gap-4">
                                <View className="w-24 h-24 bg-gray-800 rounded overflow-hidden">
                                    <Image
                                        source={{ uri: `https://source.unsplash.com/random/200x200?music,concert&sig=${i}` }}
                                        className="w-full h-full"
                                    />
                                </View>
                                <View className="flex-1 justify-center">
                                    <Text className="text-gray-400 text-xs font-ui mb-1">INDIE • 2HRS AGO</Text>
                                    <Text className="text-white font-heading text-lg leading-6">
                                        Underground Kings: The New Wave of Memphis Rap
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

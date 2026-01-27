import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    title: string;
    description: string;
}

export default function PaymentModal({ visible, onClose, onSuccess, amount, title, description }: PaymentModalProps) {
    const [processing, setProcessing] = useState(false);
    const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');

    useEffect(() => {
        if (visible) setStage('idle');
    }, [visible]);

    const handlePay = () => {
        setProcessing(true);
        setStage('processing');

        // Simulate network delay for payment processing
        setTimeout(() => {
            setStage('success');
            setTimeout(() => {
                setProcessing(false);
                onSuccess();
            }, 1000);
        }, 2000);
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/80">
                <BlurView intensity={20} className="absolute w-full h-full" />

                <Animated.View
                    entering={FadeInUp.springify()}
                    className="w-[90%] bg-graphite border border-gray-700 rounded-2xl overflow-hidden shadow-2xl shadow-black"
                >
                    {/* Header */}
                    <View className="bg-[#1a1a1a] p-6 border-b border-gray-800 items-center">
                        <Text className="text-electricBlue text-xs font-ui tracking-[0.3em] mb-2">SECURE PAYMENT</Text>
                        <Text className="text-white text-2xl font-heading text-center">{title}</Text>
                        <Text className="text-3xl text-gold font-bold mt-2">${amount}<Text className="text-base text-gray-500 font-normal">.00</Text></Text>
                    </View>

                    {/* Content */}
                    <View className="p-6">
                        {stage === 'idle' && (
                            <Animated.View entering={FadeIn}>
                                <Text className="text-gray-400 text-center mb-6 font-body leading-5">
                                    {description}
                                </Text>

                                {/* Mock Card Form */}
                                <View className="gap-3 mb-6 opacity-60">
                                    <View className="h-12 bg-black/50 rounded border border-gray-700 justify-center px-4">
                                        <Text className="text-gray-500">•••• •••• •••• 4242</Text>
                                    </View>
                                    <View className="flex-row gap-3">
                                        <View className="flex-1 h-12 bg-black/50 rounded border border-gray-700 justify-center px-4">
                                            <Text className="text-gray-500">12 / 28</Text>
                                        </View>
                                        <View className="flex-1 h-12 bg-black/50 rounded border border-gray-700 justify-center px-4">
                                            <Text className="text-gray-500">CVV</Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handlePay}
                                    className="bg-electricBlue py-4 rounded-lg items-center shadow shadow-electricBlue/20"
                                >
                                    <Text className="text-carbon font-bold font-ui tracking-wider">CONFIRM PAYMENT</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onClose} className="mt-4 items-center">
                                    <Text className="text-gray-500 text-xs font-ui">CANCEL TRANSACTION</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {stage === 'processing' && (
                            <Animated.View entering={FadeIn} className="items-center py-10">
                                <ActivityIndicator size="large" color="#00F0FF" />
                                <Text className="text-electricBlue mt-4 font-ui text-xs tracking-widest animate-pulse">VERIFYING CREDENTIALS...</Text>
                            </Animated.View>
                        )}

                        {stage === 'success' && (
                            <Animated.View entering={FadeIn} className="items-center py-8">
                                <Text className="text-5xl mb-4">✅</Text>
                                <Text className="text-white font-heading text-xl mb-2">Transaction Complete</Text>
                                <Text className="text-gray-400 text-sm">Welcome to the inner circle.</Text>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

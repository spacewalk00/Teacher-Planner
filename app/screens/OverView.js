import React from 'react';
import { View, Text } from 'react-native';

export default function OverView() {
    return(
        <View className="flex-1 justify-center items-center bg-surface">
            <Text className="text-3xl font-bold text-primary">Teacher Planner</Text>
            <Text className="text-neutral mt-2">목록</Text>
        </View>
    );
}

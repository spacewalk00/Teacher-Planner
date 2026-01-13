import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from '../components/Calendar';
import * as testSupabase from '../utils/testSupabase';

export default function HomeScreen() {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        console.log('선택된 날짜:', date);
    };

    return (
        <SafeAreaView className="flex-1 bg-surface">
            <View className="flex-1 p-4 pb-24">
                <Calendar onDateSelect={handleDateSelect} />
            </View>
        </SafeAreaView>
    );
}

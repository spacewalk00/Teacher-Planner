import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from '../components/Calendar';
import {
    ScheduleDetailModal,
    AddScheduleBottomSheet,
} from '../components/Schedule';
// import * as testSupabase from '../utils/testSupabase';

export default function HomeScreen() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addScheduleVisible, setAddScheduleVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleAddSchedule = () => {
        setEditingSchedule(null);
        setAddScheduleVisible(true);
        // 모달은 닫지 않고 그대로 유지
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setAddScheduleVisible(true);
        // 모달은 닫지 않고 그대로 유지
    };

    const handleCloseAddSchedule = () => {
        setAddScheduleVisible(false);
        setEditingSchedule(null);
    };

    return (
        <SafeAreaView className="flex-1 bg-surface">
            <View className="flex-1 p-4 pb-24">
                <Calendar onDateSelect={handleDateSelect} />
            </View>
            <ScheduleDetailModal
                visible={modalVisible}
                selectedDate={selectedDate}
                onClose={handleCloseModal}
                onAddSchedule={handleAddSchedule}
                onEditSchedule={handleEditSchedule}
            />
            <AddScheduleBottomSheet
                visible={addScheduleVisible}
                selectedDate={selectedDate}
                schedule={editingSchedule}
                onClose={handleCloseAddSchedule}
            />
        </SafeAreaView>
    );
}

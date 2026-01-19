import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAddSchedule, useUpdateSchedule } from '../../hooks/useSchedules';

/**
 * 일정 추가/수정 양식 컴포넌트
 * 하단에서 올라오는 바텀시트 형태
 */
const AddScheduleBottomSheet = ({
    visible,
    selectedDate,
    schedule, // 수정 모드일 때 일정 데이터
    onClose,
}) => {
    const [title, setTitle] = useState('');
    const [memoEnabled, setMemoEnabled] = useState(false);
    const [memo, setMemo] = useState('');

    const isEditMode = !!schedule;
    
    const addMutation = useAddSchedule();
    const updateMutation = useUpdateSchedule();
    const loading = addMutation.isPending || updateMutation.isPending;

    // 수정 모드일 때 기존 데이터 로드
    useEffect(() => {
        if (schedule) {
            setTitle(schedule.title || '');
            setMemo(schedule.description || '');
            setMemoEnabled(!!schedule.description);
        } else {
            // 추가 모드일 때 초기화
            setTitle('');
            setMemo('');
            setMemoEnabled(false);
        }
    }, [schedule, visible]);

    const handleMemoToggle = () => {
        if (memoEnabled) {
            setMemo('');
        }
        setMemoEnabled(!memoEnabled);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '할일을 입력해주세요.');
            return;
        }

        // 수정 모드일 때는 원래 일정의 날짜 사용, 추가 모드일 때는 selectedDate 사용
        const startDate = isEditMode && schedule.startDate 
            ? schedule.startDate 
            : selectedDate;
        const endDate = isEditMode && schedule.endDate 
            ? schedule.endDate 
            : selectedDate;

        const scheduleData = {
            title: title.trim(),
            startDate: startDate,
            endDate: endDate,
            description: memoEnabled && memo.trim() ? memo.trim() : null,
        };

        try {
            if (isEditMode) {
                await updateMutation.mutateAsync({ id: schedule.id, updates: scheduleData });
            } else {
                await addMutation.mutateAsync(scheduleData);
            }
            // 성공 후 BottomSheet 닫기 (새로고침은 TanStack Query가 자동 처리)
            onClose();
        } catch (error) {
            console.error('Failed to save schedule:', error);
            Alert.alert('오류', `일정 ${isEditMode ? '수정' : '추가'}에 실패했습니다.`);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 bg-black/50"
            >
                <SafeAreaView className="flex-1 justify-end">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl max-h-[90%]"
                    >
                        {/* 상단 스크롤 영역 */}
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View className="p-4">
                                {/* 헤더 */}
                                <View className="mb-4">
                                    <Text className="text-lg font-bold text-neutral-900">
                                        {isEditMode ? '일정 수정' : '일정 추가'}
                                    </Text>
                                </View>

                                {/* 할일 입력 + 저장 버튼 */}
                                <View className="mb-4">
                                    <Text className="text-sm text-neutral-600 mb-2">
                                        할일 *
                                    </Text>
                                    <View className="flex-row items-center">
                                        <TextInput
                                            className="flex-1 bg-white rounded-lg p-4 border border-neutral-200 text-base text-neutral-900"
                                            placeholder="할일을 입력하세요"
                                            placeholderTextColor="#a8a29e"
                                            value={title}
                                            onChangeText={setTitle}
                                            maxLength={100}
                                            autoFocus={!isEditMode}
                                        />
                                        <TouchableOpacity
                                            onPress={handleSave}
                                            disabled={loading || !title.trim()}
                                            className={`ml-2 p-3 rounded-lg ${
                                                loading || !title.trim()
                                                    ? 'bg-neutral-300'
                                                    : 'bg-primary'
                                            }`}
                                            activeOpacity={0.8}
                                        >
                                            {loading ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#ffffff"
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="arrow-forward"
                                                    size={24}
                                                    color="#ffffff"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* 메모 상세 form (메모 ON일 때만) */}
                                {memoEnabled && (
                                    <View className="mb-4">
                                        <TextInput
                                            className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 text-base text-neutral-900"
                                            placeholder="메모를 입력하세요"
                                            placeholderTextColor="#a8a29e"
                                            value={memo}
                                            onChangeText={setMemo}
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                            maxLength={500}
                                        />
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* 하단 고정 영역 - 맨 바닥 */}
                        <View className="border-t border-neutral-200 bg-white p-4">
                            <View className="flex-row justify-around">
                                <TouchableOpacity
                                    onPress={handleMemoToggle}
                                    className={`p-3 rounded-lg ${
                                        memoEnabled ? 'bg-primary' : 'bg-neutral-200'
                                    }`}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons
                                        name="document-text"
                                        size={24}
                                        color={memoEnabled ? '#ffffff' : '#78716c'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddScheduleBottomSheet;

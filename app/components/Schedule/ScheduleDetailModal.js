import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useSchedulesByDate } from '../../hooks/useSchedules';
import ScheduleItem from './ScheduleItem';

/**
 * 일정 상세 모달 컴포넌트
 * 선택된 날짜의 일정 목록을 표시 (정중앙 모달)
 * TanStack Query를 사용하여 서버 상태 관리
 */
const ScheduleDetailModal = ({
    visible,
    selectedDate,
    onClose,
    onAddSchedule,
    onEditSchedule,
}) => {
    const {
        data: schedules = [],
        isLoading,
        error,
        refetch,
    } = useSchedulesByDate(visible && selectedDate ? selectedDate : null);

    const formatDateDisplay = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[d.getDay()];
        return `${year}년 ${month}월 ${day}일 (${weekday})`;
    };

    const renderScheduleItem = ({ item }) => (
        <ScheduleItem
            schedule={item}
            onPress={() => onEditSchedule?.(item)}
        />
    );

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 bg-black/50 justify-center items-center"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl w-[90%] max-w-md max-h-[80%] shadow-lg"
                >
                    {/* 헤더 */}
                    <View className="p-4 border-b border-neutral-200">
                        <Text className="text-lg font-bold text-neutral-900">
                            {formatDateDisplay(selectedDate)}
                        </Text>
                        <Text className="text-sm text-neutral-600 mt-1">
                            {schedules.length}개의 일정
                        </Text>
                    </View>

                    {/* 일정 목록 */}
                    <View className="flex-1">
                        {isLoading ? (
                            <View className="flex-1 justify-center items-center py-20">
                                <ActivityIndicator size="large" color="#92705b" />
                                <Text className="text-neutral-600 mt-4">
                                    일정을 불러오는 중...
                                </Text>
                            </View>
                        ) : error ? (
                            <View className="flex-1 justify-center items-center py-20 px-4">
                                <Text className="text-error text-center">
                                    일정을 불러오는데 실패했습니다.
                                </Text>
                                <TouchableOpacity
                                    onPress={() => refetch()}
                                    className="mt-4 px-4 py-2 bg-primary rounded-lg"
                                >
                                    <Text className="text-white font-semibold">
                                        다시 시도
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : schedules.length === 0 ? (
                            <View className="flex-1 justify-center items-center py-20 px-4">
                                <Text className="text-neutral-600 text-center">
                                    등록된 일정이 없습니다
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={schedules}
                                renderItem={renderScheduleItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingVertical: 16 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>

                    {/* 하단 버튼 */}
                    <View className="p-4 border-t border-neutral-200 bg-white">
                        <TouchableOpacity
                            onPress={onAddSchedule}
                            className="bg-primary rounded-lg py-4 flex-row items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold text-base">
                                + 일정 추가
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ScheduleDetailModal;

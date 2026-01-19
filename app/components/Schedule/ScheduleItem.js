import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useDeleteSchedule } from '../../hooks/useSchedules';

/**
 * 일정 아이템 컴포넌트
 * 왼쪽 스와이프 시 오른쪽 끝에 휴지통 표시, 삭제 확인 다이얼로그
 */
const ScheduleItem = ({ schedule, onPress }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const deleteButtonOpacity = useRef(new Animated.Value(0)).current;
    const startX = useRef(0); // 제스처 시작 시점의 translateX 값
    const [isSwiping, setIsSwiping] = useState(false);
    const [isSwipeOpen, setIsSwipeOpen] = useState(false); // 스와이프가 열려있는지 상태
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 모달 표시 여부
    const SWIPE_THRESHOLD = -80;
    
    const deleteMutation = useDeleteSchedule();

    const handleDelete = () => {
        // 삭제 확인 모달 표시
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        // 취소 시 원래 위치로 복귀
        Animated.parallel([
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.spring(deleteButtonOpacity, {
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsSwipeOpen(false);
        });
    };

    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false);
        // 삭제 전에 스와이프 상태 초기화
        Animated.parallel([
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.spring(deleteButtonOpacity, {
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsSwipeOpen(false);
        });

        try {
            await deleteMutation.mutateAsync(schedule.id);
            // 삭제 성공 후 새로고침은 TanStack Query가 자동 처리
        } catch (error) {
            console.error('Failed to delete schedule:', error);
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10]) // 수평 움직임이 10px 이상일 때만 활성화
        .onStart(() => {
            setIsSwiping(true); // 제스처 시작 시 스와이프 상태로 설정
            startX.current = translateX._value || 0; // 시작 위치 저장
        })
        .onUpdate((e) => {
            // 시작 위치에서 translationX만큼 이동한 위치 계산
            const newValue = Math.min(0, Math.max(-80, startX.current + e.translationX));
            translateX.setValue(newValue);
            
            // 스와이프 거리에 따라 삭제 버튼 opacity 조절 (0 ~ 1)
            const opacity = Math.min(Math.abs(newValue) / 80, 1);
            deleteButtonOpacity.setValue(opacity);
        })
        .onEnd((e) => {
            const finalTranslateX = translateX._value || 0;
            
            if (finalTranslateX < SWIPE_THRESHOLD) {
                // 왼쪽으로 임계값을 넘으면 삭제 버튼 표시
                setIsSwipeOpen(true);
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: -80,
                        useNativeDriver: true,
                        damping: 15,
                        stiffness: 150,
                    }),
                    Animated.timing(deleteButtonOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else if (finalTranslateX > -40) {
                // 오른쪽으로 당겨서 원래 위치로 복귀 (절반 이상 복귀했으면)
                setIsSwipeOpen(false);
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 15,
                        stiffness: 150,
                    }),
                    Animated.timing(deleteButtonOpacity, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setIsSwiping(false);
                });
            } else {
                // 그 외의 경우 (임계값 미만이지만 완전히 복귀하지 않은 경우)
                // 다시 열린 상태로 유지
                setIsSwipeOpen(true);
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: -80,
                        useNativeDriver: true,
                        damping: 15,
                        stiffness: 150,
                    }),
                    Animated.timing(deleteButtonOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        })
        .onFinalize(() => {
            // 제스처가 완전히 종료되면 스와이프 상태 해제 (약간의 지연)
            setTimeout(() => {
                if (!isSwipeOpen) {
                    setIsSwiping(false);
                }
            }, 100);
        });

    return (
        <View className="mb-3 flex-row overflow-hidden px-4">
            {/* 메인 컨텐츠 - 모달 가로를 꽉 채움 */}
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{ translateX }],
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            // 스와이프 중이거나 스와이프가 열려있으면 클릭 무시
                            if (!isSwiping && !isSwipeOpen) {
                                onPress?.();
                            }
                        }}
                        activeOpacity={isSwipeOpen ? 1 : 0.7}
                        className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200"
                    >
                        <Text className="text-base font-semibold text-neutral-900">
                            {schedule.title}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>

            {/* 삭제 버튼 (오른쪽에 나란히 배치) - 스와이프 시에만 나타남 */}
            <Animated.View
                className="justify-center items-center bg-error/10 rounded-lg"
                style={{
                    opacity: deleteButtonOpacity,
                    width: 80,
                    transform: [
                        {
                            translateX: deleteButtonOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [80, 0], // opacity가 0일 때는 오른쪽 밖에, 1일 때는 보임
                            }),
                        },
                    ],
                }}
                pointerEvents={isSwipeOpen ? 'auto' : 'none'}
            >
                <TouchableOpacity
                    onPress={handleDelete}
                    className="bg-error rounded-lg p-3"
                    activeOpacity={0.8}
                >
                    <Ionicons name="trash" size={24} color="#ffffff" />
                </TouchableOpacity>
            </Animated.View>

            {/* 삭제 확인 모달 */}
            <Modal
                visible={showDeleteConfirm}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancelDelete}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-4">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <Text className="text-lg font-bold text-neutral-900 mb-2">
                            일정 삭제
                        </Text>
                        <Text className="text-base text-neutral-600 mb-6">
                            정말 삭제하시겠습니까?
                        </Text>
                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                onPress={handleCancelDelete}
                                className="px-6 py-3 rounded-lg"
                                activeOpacity={0.7}
                            >
                                <Text className="text-base text-neutral-600">취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirmDelete}
                                className="px-6 py-3 bg-error rounded-lg"
                                activeOpacity={0.7}
                            >
                                <Text className="text-base text-white font-semibold">삭제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ScheduleItem;

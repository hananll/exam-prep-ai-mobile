import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  lightBlue: '#A5C4D4',
};

type Option = {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
};

type Question = {
  id: string;
  lesson: string;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: string;
  questionText: string;
  options: Option[];
};

const sampleQuestion: Question = {
  id: 'tarih-14',
  lesson: 'OSMANLI TARIHI - ISLAHATLAR',
  questionNumber: 14,
  totalQuestions: 30,
  timeLeft: '24:15 dk',
  questionText:
    "Aşağıdakilerden hangisi, Osmanlı Devleti'nde padişahın yetkilerini ilk kez sınırlandıran ve anayasal düzene geçişin ilk adımı kabul edilen gelişmedir?",
  options: [
    { key: 'A', text: 'Lale Devri Islahatları' },
    { key: 'B', text: "Tanzimat Fermanı'nın İlanı" },
    { key: 'C', text: "Nizam-ı Cedit Ordusu’nun Kurulması" },
    { key: 'D', text: "Sened-i İttifak’ın İmzalanması" },
    { key: 'E', text: "Kanun-i Esasi’nin Kabul Edilmesi" },
  ],
};

type Props = NativeStackScreenProps<RootStackParamList, 'Question'>;

export default function QuestionScreen({ navigation }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const question = useMemo(() => sampleQuestion, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerIcon}>◷</Text>
            <Text style={styles.timerText}>{question.timeLeft}</Text>
          </View>

          <Text style={styles.questionCounter}>
            Soru {question.questionNumber} / {question.totalQuestions}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.bookmarkButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setIsBookmarked((prev) => !prev)}
          >
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '⌑'}</Text>
            <Text style={styles.bookmarkText}>İşaretle</Text>
          </Pressable>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.lessonRow}>
            <View style={styles.lessonBar} />
            <Text style={styles.lessonText}>{question.lesson}</Text>
          </View>

          <Text style={styles.questionText}>{question.questionText}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => {
            const isSelected = selectedOption === option.key;

            return (
              <Pressable
                key={option.key}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  pressed && styles.pressed,
                ]}
                onPress={() => setSelectedOption(option.key)}
              >
                <View
                  style={[
                    styles.optionLetterCircle,
                    isSelected && styles.optionLetterCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      isSelected && styles.optionLetterSelected,
                    ]}
                  >
                    {option.key}
                  </Text>
                </View>

                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottomButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.prevButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.prevButtonText}>← Önceki</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('AnswerResult')}
          >
            <Text style={styles.nextButtonText}>Sonraki Soru →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerIcon: {
    color: COLORS.orange,
    fontSize: 16,
    fontFamily: 'RethinkSansBold',
  },
  timerText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },
  questionCounter: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
  },
  bookmarkButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookmarkIcon: {
    color: COLORS.orange,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },
  bookmarkText: {
    color: COLORS.orange,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonBar: {
    width: 3,
    height: 14,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    marginRight: 8,
  },
  lessonText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },
  questionText: {
    color: COLORS.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'BesleyBold',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  optionCard: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: COLORS.orange,
    backgroundColor: '#FFF7F3',
  },
  optionLetterCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: COLORS.background,
  },
  optionLetterCircleSelected: {
    borderColor: COLORS.orange,
    backgroundColor: '#FDE9E2',
  },
  optionLetter: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'BesleyBold',
  },
  optionLetterSelected: {
    color: COLORS.orange,
  },
  optionText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'RethinkSansSemiBold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  prevButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },
  pressed: {
    opacity: 0.86,
  },
});
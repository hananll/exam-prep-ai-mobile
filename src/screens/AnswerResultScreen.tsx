import React from 'react';
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
  danger: '#B73A32',
  success: '#5F7F3B',
  successBg: '#EAF2E1',
  successBorder: '#6D8D47',
  dangerBg: '#FFF3F2',
  dangerBorder: '#C34A42',
  darkButton: '#1F3A4B',
};

type Props = NativeStackScreenProps<RootStackParamList, 'AnswerResult'>;

type OptionState = 'default' | 'correct' | 'wrong';

type ResultOption = {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  state?: OptionState;
};

const options: ResultOption[] = [
  { key: 'A', text: 'Lale Devri Islahatları', state: 'default' },
  { key: 'B', text: "Tanzimat Fermanı’nın İlanı", state: 'default' },
  { key: 'C', text: "Nizam-ı Cedid Ordusu’nun Kurulması", state: 'default' },
  { key: 'D', text: "Sened-i İttifak’ın İmzalanması", state: 'correct' },
  { key: 'E', text: "Kanun-i Esasi’nin Kabul Edilmesi", state: 'wrong' },
];

export default function AnswerResultScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.resultStatus}>Yanlış Cevap ❌</Text>
          <Text style={styles.questionCounter}>Soru 14 / 30</Text>

          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeIcon}>⌑</Text>
            <Text style={styles.savedBadgeText}>Kayıtlı</Text>
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            Aşağıdakilerden hangisi, Osmanlı Devleti'nde padişahın yetkilerini
            ilk kez sınırlandıran ve anayasal düzene geçişin ilk adımı kabul
            edilen gelişmedir?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <ResultOptionCard key={option.key} option={option} />
          ))}
        </View>

        <View style={styles.analysisCard}>
          <Text style={styles.analysisTitle}>💡 Ders Notu Çözüm Analizi</Text>

          <Text style={styles.analysisHeading}>
            Sened-i İttifak (1808):{' '}
            <Text style={styles.analysisBody}>
              II. Mahmut ile Ayanlar arasında imzalanmıştır. Bu fermanla Osmanlı
              padişahı yetkilerini kendi isteği dışında sınırlandıran ilk
              belgeyi onaylamıştır. Dolayısıyla doğru cevap D şıkkıdır.
              Kanun-i Esasi ise ilk anayasadır fakat ilk sınırlandırma değildir.
            </Text>
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.nextQuestionButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('QuizSummary')}
        >
          <Text style={styles.nextQuestionButtonText}>Sıradaki Soruya Geç</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultOptionCard({ option }: { option: ResultOption }) {
  const isCorrect = option.state === 'correct';
  const isWrong = option.state === 'wrong';

  return (
    <View
      style={[
        styles.optionCard,
        isCorrect && styles.optionCardCorrect,
        isWrong && styles.optionCardWrong,
      ]}
    >
      <View
        style={[
          styles.optionLetterCircle,
          isCorrect && styles.optionLetterCircleCorrect,
          isWrong && styles.optionLetterCircleWrong,
        ]}
      >
        <Text
          style={[
            styles.optionLetter,
            isCorrect && styles.optionLetterCorrect,
            isWrong && styles.optionLetterWrong,
          ]}
        >
          {option.key}
        </Text>
      </View>

      <Text
        style={[
          styles.optionText,
          isCorrect && styles.optionTextCorrect,
          isWrong && styles.optionTextWrong,
        ]}
      >
        {option.text}
      </Text>

      {isCorrect && <Text style={styles.optionResultIcon}>✓</Text>}
      {isWrong && <Text style={styles.optionResultIconWrong}>⊗</Text>}
    </View>
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
    paddingBottom: 30,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  resultStatus: {
    color: COLORS.danger,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  questionCounter: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
  },

  savedBadge: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFF7F3',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  savedBadgeIcon: {
    color: COLORS.orange,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },

  savedBadgeText: {
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
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  questionText: {
    color: COLORS.primary,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'BesleyBold',
  },

  optionsContainer: {
    gap: 10,
    marginBottom: 14,
  },

  optionCard: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionCardCorrect: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
  },

  optionCardWrong: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
  },

  optionLetterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: COLORS.background,
  },

  optionLetterCircleCorrect: {
    borderColor: COLORS.successBorder,
    backgroundColor: COLORS.successBg,
  },

  optionLetterCircleWrong: {
    borderColor: COLORS.dangerBorder,
    backgroundColor: COLORS.dangerBg,
  },

  optionLetter: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'BesleyBold',
  },

  optionLetterCorrect: {
    color: COLORS.success,
  },

  optionLetterWrong: {
    color: COLORS.danger,
  },

  optionText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'RethinkSansBold',
  },

  optionTextCorrect: {
    color: COLORS.success,
  },

  optionTextWrong: {
    color: COLORS.danger,
  },

  optionResultIcon: {
    color: COLORS.success,
    fontSize: 18,
    fontFamily: 'RethinkSansBold',
    marginLeft: 10,
  },

  optionResultIconWrong: {
    color: COLORS.danger,
    fontSize: 18,
    fontFamily: 'RethinkSansBold',
    marginLeft: 10,
  },

  analysisCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
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

  analysisTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'BesleyBold',
    marginBottom: 10,
  },

  analysisHeading: {
    color: COLORS.orange,
    fontSize: 13,
    lineHeight: 21,
    fontFamily: 'RethinkSansBold',
  },

  analysisBody: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 21,
    fontFamily: 'RethinkSansRegular',
  },

  nextQuestionButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.darkButton,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextQuestionButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  pressed: {
    opacity: 0.86,
  },
});
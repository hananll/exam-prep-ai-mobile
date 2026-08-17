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
  secondary: '#6B7C88',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  success: '#5A7A2D',
  successBg: '#EEF4E8',
  danger: '#C13E36',
  dangerBg: '#FFF1F0',
  ai_button_background : '#F9ECE8',
  shadow: 'rgba(31, 58, 75, 0.06)',
};

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionReview'>;

type ReviewItem = {
  id: string;
  questionNo: number;
  status: 'Doğru' | 'Yanlış';
  yourAnswer: string;
  correctAnswer: string;
  questionText: string;
  showReviewButton?: boolean;
};

const reviewData: ReviewItem[] = [
  {
    id: '1',
    questionNo: 1,
    status: 'Yanlış',
    yourAnswer: 'E',
    correctAnswer: 'D',
    questionText:
      'Aşağıdakilerden hangisi padişahın yetkilerini ilk kez sınırlandırmıştır?',
    showReviewButton: true,
  },
  {
    id: '2',
    questionNo: 2,
    status: 'Doğru',
    yourAnswer: 'B',
    correctAnswer: 'B',
    questionText:
      'Osmanlı Devleti\'nde ilk geçici elçilikler hangi dönemde açılmıştır?',
  },
  {
    id: '3',
    questionNo: 3,
    status: 'Doğru',
    yourAnswer: 'A',
    correctAnswer: 'A',
    questionText:
      "Sivas Kongresi'nde ulusal birliği sağlamak amacıyla alınan karar hangisidir?",
  },
  {
    id: '4',
    questionNo: 4,
    status: 'Doğru',
    yourAnswer: 'C',
    correctAnswer: 'C',
    questionText:
      "Kutü'l Amare Kuşatması'nda büyük bir zafer kazanılan cephe hangisidir?",
  },
  {
    id: '5',
    questionNo: 5,
    status: 'Yanlış',
    yourAnswer: 'D',
    correctAnswer: 'B',
    questionText:
      "Amasya Genelgesi'nin ihtilal beyannamesi niteliği taşımasının sebebi nedir?",
    showReviewButton: true,
  },
  {
    id: '6',
    questionNo: 6,
    status: 'Doğru',
    yourAnswer: 'A',
    correctAnswer: 'A',
    questionText:
      'Tarihte ilk Türk devletlerinde hükümdara yön veren temel anlayış nedir?',
  },
  {
    id: '7',
    questionNo: 7,
    status: 'Yanlış',
    yourAnswer: 'C',
    correctAnswer: 'E',
    questionText:
      "Lozan Barış Antlaşması'nda çözüme kavuşturulamayan sorun hangisidir?",
    showReviewButton: true,
  },
  {
    id: '8',
    questionNo: 8,
    status: 'Doğru',
    yourAnswer: 'D',
    correctAnswer: 'D',
    questionText:
      "Osmanlı Devleti'nde eyalet askerlerinin en kalabalık grubunu hangisi oluşturur?",
  },
  {
    id: '9',
    questionNo: 9,
    status: 'Doğru',
    yourAnswer: 'B',
    correctAnswer: 'B',
    questionText:
      'Atatürk döneminde çok partili hayata geçiş denemelerinden biri hangisidir?',
  },
  {
    id: '10',
    questionNo: 10,
    status: 'Yanlış',
    yourAnswer: 'A',
    correctAnswer: 'C',
    questionText:
      "Anadolu Selçuklu Devleti'nde ticareti geliştirmek için yapılan uygulama hangisidir?",
    showReviewButton: true,
  },
  {
    id: '11',
    questionNo: 11,
    status: 'Doğru',
    yourAnswer: 'E',
    correctAnswer: 'E',
    questionText:
      "I. TBMM'nin çıkardığı ilk kanun aşağıdakilerden hangisidir?",
  },
];

export default function QuestionReviewScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Soru İnceleme</Text>
            <Text style={styles.headerSubtitle}>Tarih Karma Pratik #14</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Rapor Özeti</Text>

          <Text style={styles.summaryStats}>
            <Text style={styles.summaryMuted}>30 Soru • </Text>
            <Text style={styles.summarySuccess}>22 D</Text>
            <Text style={styles.summaryMuted}> • </Text>
            <Text style={styles.summaryDanger}>8 Y</Text>
          </Text>
        </View>

        <View style={styles.reviewList}>
          {reviewData.map((item) => (
            <ReviewCard
              key={item.id}
              item={item}
              onPressReview={() => navigation.navigate('AnswerResult')}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Anasayfaya Dön</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReviewCard({
  item,
  onPressReview,
}: {
  item: ReviewItem;
  onPressReview?: () => void;
}) {
  const isWrong = item.status === 'Yanlış';

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.leftTopRow}>
          <View
            style={[
              styles.questionBadge,
              isWrong ? styles.questionBadgeWrong : styles.questionBadgeCorrect,
            ]}
          >
            <Text
              style={[
                styles.questionBadgeText,
                isWrong
                  ? styles.questionBadgeTextWrong
                  : styles.questionBadgeTextCorrect,
              ]}
            >
              Soru {item.questionNo}
            </Text>
          </View>

          <View style={styles.statusWrap}>
            <Text
              style={[
                styles.statusIcon,
                isWrong ? styles.wrongText : styles.correctText,
              ]}
            >
              {isWrong ? '✕' : '✓'}
            </Text>
            <Text
              style={[
                styles.statusText,
                isWrong ? styles.wrongText : styles.correctText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.answerMeta}>
          Cevabın:
          <Text
            style={isWrong ? styles.answerWrongHighlight : styles.answerCorrectHighlight}
          >
            {' '}{item.yourAnswer}
          </Text>
          {' | '}
          Doğru:
          <Text style={styles.answerCorrectHighlight}> {item.correctAnswer}</Text>
        </Text>
      </View>

      <Text style={styles.questionPreview} numberOfLines={2}>
        {item.questionText}
      </Text>

      {item.showReviewButton && (
        <View style={styles.cardBottomRow}>
          <Text style={styles.noteHint}>Anlamadığın bir nokta mı var?</Text>

          <Pressable
            style={({ pressed }) => [
              styles.aiButton,
              pressed && styles.pressed,
            ]}
            onPress={onPressReview}
          >
            <Text style={styles.aiButtonText}>AI’a Sor 🤖</Text>
          </Pressable>
        </View>
      )}
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
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 26,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backArrow: {
    color: COLORS.primary,
    fontSize: 17,
    fontFamily: 'RethinkSansBold',
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: COLORS.primary,
    fontSize: 23,
    lineHeight: 34,
    fontFamily: 'BesleyBold',
    marginBottom: 2,
  },

  headerSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },

  summaryCard: {
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
  },

  summaryTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
  },

  summaryStats: {
    fontSize: 13,
    fontFamily: 'RethinkSansBold',
  },

  summaryMuted: {
    color: COLORS.secondary,
    fontFamily: 'RethinkSansRegular',
  },

  summarySuccess: {
    color: COLORS.success,
    fontFamily: 'RethinkSansBold',
  },

  summaryDanger: {
    color: COLORS.danger,
    fontFamily: 'RethinkSansBold',
  },

  reviewList: {
    gap: 12,
    marginBottom: 18,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  leftTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },

  questionBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
  },

  questionBadgeCorrect: {
    backgroundColor: COLORS.successBg,
  },

  questionBadgeWrong: {
    backgroundColor: COLORS.dangerBg,
  },

  questionBadgeText: {
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },

  questionBadgeTextCorrect: {
    color: COLORS.success,
  },

  questionBadgeTextWrong: {
    color: COLORS.danger,
  },

  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    fontSize: 13,
    fontFamily: 'RethinkSansBold',
    marginRight: 5,
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },

  correctText: {
    color: COLORS.success,
  },

  wrongText: {
    color: COLORS.danger,
  },

  answerMeta: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  answerCorrectHighlight: {
    color: COLORS.success,
    fontFamily: 'RethinkSansBold',
  },

  answerWrongHighlight: {
    color: COLORS.danger,
    fontFamily: 'RethinkSansBold',
  },

  questionPreview: {
    color: COLORS.primary,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'BesleyMedium',
    marginBottom: 14,
  },

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  noteHint: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
    flex: 1,
    marginRight: 10,
  },

  aiButton: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ai_button_background,
  },

  aiButtonText: {
    color: COLORS.orange,
    fontSize: 12,
    fontFamily: 'RethinkSansBold',
  },

  homeButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'RethinkSansBold',
  },

  pressed: {
    opacity: 0.86,
  },
});
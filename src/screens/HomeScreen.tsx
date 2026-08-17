import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  blue: '#4E7385',
  green: '#5F7464',
  purple: '#7B6B8D',
  olive: '#8E9A70',
  lightBlue: '#A5C4D4',
  amber: '#DDA15E',
  palePink: '#F9ECF8',
};

const CARD_HORIZONTAL_PADDING = 16;
const SCREEN_PADDING = 16;
const SUBJECT_CARD_GAP = 14;
const SUBJECT_CARD_WIDTH =
  (width - SCREEN_PADDING * 2 - SUBJECT_CARD_GAP) / 2;

type Subject = {
  id: string;
  title: string;
  solvedText: string;
  progress: number;
  color: string;
};

const subjects: Subject[] = [
  {
    id: 'turkce',
    title: 'Türkçe',
    solvedText: '1.420 Soru çözüldü',
    progress: 84,
    color: COLORS.blue,
  },
  {
    id: 'matematik',
    title: 'Matematik',
    solvedText: '920 Soru çözüldü',
    progress: 42,
    color: COLORS.orange,
  },
  {
    id: 'tarih',
    title: 'Tarih',
    solvedText: '2.100 Soru çözüldü',
    progress: 76,
    color: COLORS.amber,
  },
  {
    id: 'cografya',
    title: 'Coğrafya',
    solvedText: '1.150 Soru çözüldü',
    progress: 58,
    color: COLORS.green,
  },
  {
    id: 'vatandaslik',
    title: 'Vatandaşlık',
    solvedText: '740 Soru çözüldü',
    progress: 30,
    color: COLORS.purple,
  },
  {
    id: 'guncel',
    title: 'Güncel Bilgiler',
    solvedText: '510 Soru çözüldü',
    progress: 95,
    color: COLORS.olive,
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Sınav Yolu</Text>
            <Text style={styles.appSubtitle}>KPSS HAZIRLIK REHBERİ</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.dayBadge,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.dayBadgeText}>♨ 12 Gün</Text>
          </Pressable>
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle}>Günün Notu ✍️</Text>
            <Text style={styles.noteTag}>ÖSYM Tarzı</Text>
          </View>

          <Text style={styles.noteText}>
            "Büyük başarılar, her gün atılan küçük adımların toplamıdır. Tarih
            tekrardan ibarettir, senin başarın ise kalıcı olacak!"
          </Text>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Bugünkü Hedefin</Text>
            <Text style={styles.goalCount}>120 / 200 Soru</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.goalStats}>
            <View>
              <Text style={styles.statLabel}>Çözülen Soru</Text>
              <Text style={styles.statValue}>120 Soru</Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Süre</Text>
              <Text style={styles.statValue}>45 Dk</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.quickPracticeCard,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            console.log('Hızlı Karma Pratik');
          }}
        >
          <View>
            <Text style={styles.quickPracticeTitle}>Hızlı Karma Pratik</Text>
            <Text style={styles.quickPracticeSubtitle}>
              ÖSYM çıkmış sorularından seçmeler
            </Text>
          </View>

          <Text style={styles.quickPracticeArrow}>→</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Ders Çalışma Alanı</Text>

        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPress={() => {
                if (subject.id === 'tarih') {
                  navigation.navigate('SubjectTopics');
                } else {
                  console.log(subject.title);
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SubjectCard({
  subject,
  onPress,
}: {
  subject: Subject;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.subjectCard,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.subjectTopRow}>
        <View
          style={[
            styles.subjectDot,
            {
              backgroundColor: subject.color,
            },
          ]}
        />
        <Text style={styles.subjectProgress}>{subject.progress}%</Text>
      </View>

      <Text style={styles.subjectTitle}>{subject.title}</Text>
      <Text style={styles.subjectSolved}>{subject.solvedText}</Text>
    </Pressable>
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
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 52,
    paddingHorizontal: 4,
  },

  appTitle: {
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
  },

  appSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansRegular',
    letterSpacing: 0.2,
  },

  dayBadge: {
    marginTop: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: COLORS.palePink,
    borderWidth: 1,
    borderColor: COLORS.orange,
  },

  dayBadgeText: {
    color: COLORS.orange,
    fontSize: 14,
    fontFamily: 'RethinkSansBold',
  },

  noteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
  },

  noteTag: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },

  noteText: {
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'BesleyItalic',
  },

  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 22,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  goalTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  goalCount: {
    color: COLORS.orange,
    fontSize: 14,
    fontFamily: 'RethinkSansBold',
  },

  progressTrack: {
    height: 6,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginTop: 14,
    marginBottom: 13,
    overflow: 'hidden',
  },

  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: COLORS.orange,
    borderRadius: 20,
  },

  goalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 100,
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'RethinkSansRegular',
  },

  statValue: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  quickPracticeCard: {
    minHeight: 66,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },

  quickPracticeTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
    marginBottom: 5,
  },

  quickPracticeSubtitle: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },

  quickPracticeArrow: {
    color: COLORS.white,
    fontSize: 31,
    lineHeight: 33,
    fontFamily: 'RethinkSansRegular',
  },

  sectionTitle: {
    color: COLORS.primary,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'BesleyBold',
    marginBottom: 14,
  },

  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: SUBJECT_CARD_GAP,
    rowGap: 26,
  },

  subjectCard: {
    width: SUBJECT_CARD_WIDTH,
    minHeight: 99,
    backgroundColor: COLORS.white,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  subjectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  subjectDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
  },

  subjectProgress: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansSemiBold',
  },

  subjectTitle: {
    color: COLORS.primary,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'BesleyBold',
    marginBottom: 8,
  },

  subjectSolved: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },

  pressed: {
    opacity: 0.85,
  },
});
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
  success: '#5F7F3B',
  track: '#EEE8DF',
};

type Props = NativeStackScreenProps<RootStackParamList, 'QuizSummary'>;

type TopicAnalysis = {
  id: string;
  title: string;
  scoreText: string;
  progress: number;
  color: string;
};

const topicAnalyses: TopicAnalysis[] = [
  {
    id: '1',
    title: 'İslamiyet Öncesi Türk Tarihi',
    scoreText: '5/5',
    progress: 100,
    color: COLORS.success,
  },
  {
    id: '2',
    title: 'İlk Türk-İslam Devletleri',
    scoreText: '5/5',
    progress: 100,
    color: COLORS.success,
  },
  {
    id: '3',
    title: 'Osmanlı Devleti Islahatları',
    scoreText: '8/12',
    progress: 67,
    color: COLORS.orange,
  },
  {
    id: '4',
    title: 'Kurtuluş Savaşı Hazırlık',
    scoreText: '4/8',
    progress: 50,
    color: COLORS.orange,
  },
];

export default function QuizSummaryScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sınav Rapor Kartı</Text>
          <Text style={styles.subtitle}>Tarih Karma Tarama Pratiği #14</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreMain}>22 / 30</Text>
            <Text style={styles.scoreLabel}>DOĞRU</Text>
          </View>

          <Text style={styles.congratsText}>Tebrikler, Güzel İlerleme! 🎉</Text>
          <Text style={styles.descText}>
            Sınav barajını geçerek hedefine bir adım daha yaklaştın.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Soru Sayısı</Text>
            <Text style={styles.statValue}>30 Soru</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Doğru</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              22 Doğru
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Yanlış</Text>
            <Text style={[styles.statValue, { color: '#B73A32' }]}>
              8 Yanlış
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Süre</Text>
            <Text style={[styles.statValue, { color: COLORS.orange }]}>
              18 Dk 40 Sn
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Konu Başarı Analizleri</Text>

        <View style={styles.analysisList}>
          {topicAnalyses.map((item) => (
            <View key={item.id} style={styles.analysisCard}>
              <View style={styles.analysisTopRow}>
                <Text style={styles.analysisTopic}>{item.title}</Text>
                <Text style={styles.analysisScore}>{item.scoreText}</Text>
              </View>

              <View style={styles.analysisTrack}>
                <View
                  style={[
                    styles.analysisFill,
                    {
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.reviewButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('QuestionReview')}
          >
            <Text style={styles.reviewButtonText}>Soruları İncele</Text>
          </Pressable>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate('Question')}
            >
              <Text style={styles.retryButtonText}>↺ Tekrar Çöz</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.homeButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.homeButtonText}>Anasayfa</Text>
            </Pressable>
          </View>
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
    paddingTop: 18,
    paddingBottom: 32,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    color: COLORS.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'BesleyBold',
    marginBottom: 4,
  },

  subtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansRegular',
  },

  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  scoreCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  scoreMain: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
    marginBottom: 2,
  },

  scoreLabel: {
    color: COLORS.secondary,
    fontSize: 11,
    fontFamily: 'RethinkSansRegular',
  },

  congratsText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
    marginBottom: 6,
    textAlign: 'center',
  },

  descText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
    textAlign: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16,
  },

  statCard: {
    width: '48.5%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
    marginBottom: 8,
  },

  statValue: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'BesleyBold',
  },

  sectionTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'BesleyBold',
    marginBottom: 12,
  },

  analysisList: {
    gap: 10,
    marginBottom: 20,
  },

  analysisCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  analysisTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  analysisTopic: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'RethinkSansSemiBold',
    marginRight: 8,
  },

  analysisScore: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'RethinkSansSemiBold',
  },

  analysisTrack: {
    height: 4,
    borderRadius: 99,
    backgroundColor: COLORS.track,
    overflow: 'hidden',
  },

  analysisFill: {
    height: '100%',
    borderRadius: 99,
  },

  bottomSection: {
    gap: 12,
  },

  reviewButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  retryButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.orange,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  homeButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansBold',
  },

  pressed: {
    opacity: 0.86,
  },
});
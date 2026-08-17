import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
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
};

type Topic = {
  id: string;
  title: string;
  solved: string;
  progress: number;
  color: string;
  completed?: boolean;
};

const topics: Topic[] = [
  {
    id: '1',
    title: 'İslamiyet Öncesi Türk\nTarihi',
    solved: '100/100 Soru',
    progress: 100,
    color: '#4E7A20',
    completed: true,
  },
  {
    id: '2',
    title: 'İlk Türk-İslam Devletleri',
    solved: '96/120 Soru',
    progress: 80,
    color: COLORS.orange,
  },
  {
    id: '3',
    title: 'Osmanlı Devleti Kuruluş\nve Yükselme',
    solved: '180/300 Soru',
    progress: 60,
    color: COLORS.orange,
  },
  {
    id: '4',
    title: 'Osmanlı Devleti Kültür ve\nUygarlık',
    solved: '90/200 Soru',
    progress: 45,
    color: COLORS.orange,
  },
  {
    id: '5',
    title: 'Kurtuluş Savaşı Hazırlık\nDönemi',
    solved: '20/200 Soru',
    progress: 10,
    color: COLORS.orange,
  },
  {
    id: '6',
    title: 'İnkılap Tarihi ve\nAtatürkçülük',
    solved: '0/250 Soru',
    progress: 0,
    color: '#EEE8DF',
  },
  {
    id: '7',
    title: 'Çağdaş Türk ve Dünya\nTarihi',
    solved: '0/150 Soru',
    progress: 0,
    color: '#EEE8DF',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectTopics'>;

export default function SubjectTopicsScreen({ navigation }: Props) {
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
            <Text style={styles.headerTitle}>Tarih Konuları</Text>
            <Text style={styles.headerSubtitle}>
              Önem Sırasına Göre Listelenmiştir
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Tarih Net Durumu 📈</Text>
            <Text style={styles.summaryText}>
              Toplam 27 Tarih sorusundan ortalama{'\n'}netin: 18.5
            </Text>
          </View>

          <View style={styles.summaryCircle}>
            <Text style={styles.summaryCircleText}>%65</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onPress={() => navigation.navigate('Question')}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TopicCard({
  topic,
  onPress,
}: {
  topic: Topic;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.topicCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitle}>{topic.title}</Text>

        <View style={styles.topicRight}>
          {topic.completed ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>TAMAMLANDI</Text>
            </View>
          ) : (
            <Text style={styles.topicSolved}>{topic.solved}</Text>
          )}
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${topic.progress}%`,
                backgroundColor:
                  topic.progress === 100 ? '#4E7A20' : topic.color,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>%{topic.progress}</Text>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  backArrow: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'RethinkSansSemiBold',
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
    marginBottom: 2,
  },

  headerSubtitle: {
    fontSize: 13,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansRegular',
  },

  summaryCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1.2,
    borderColor: COLORS.orange,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  summaryLeft: {
    flex: 1,
    paddingRight: 12,
  },

  summaryTitle: {
    color: COLORS.orange,
    fontSize: 16,
    fontFamily: 'BesleyBold',
    marginBottom: 6,
  },

  summaryText: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'RethinkSansRegular',
  },

  summaryCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  summaryCircleText: {
    color: COLORS.orange,
    fontSize: 14,
    fontFamily: 'BesleyBold',
  },

  listContainer: {
    gap: 12,
  },

  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  topicTitle: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'BesleyBold',
    paddingRight: 10,
  },

  topicRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  topicSolved: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansSemiBold',
  },

  completedBadge: {
    backgroundColor: '#DDE7C9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  completedBadgeText: {
    color: '#6F7E45',
    fontSize: 11,
    fontFamily: 'RethinkSansBold',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#EEE8DF',
    borderRadius: 99,
    overflow: 'hidden',
    marginRight: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 99,
  },

  progressText: {
    width: 34,
    textAlign: 'right',
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'RethinkSansSemiBold',
  },

  pressed: {
    opacity: 0.85,
  },
});
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizSummary'>;

export default function QuizSummaryScreen({ route, navigation }: any) {
  const resultData = route?.params?.resultData || {
    testAdi: 'KPSS Karma Tarama Testi',
    toplamSoru: 0,
    dogruSayisi: 0,
    yanlisSayisi: 0,
    gecenSure: '0 Dk 0 Sn',
    konuAnalizleri: [],
    sorular: [],
    userAnswers: {},
  };

  const testId = route?.params?.testId || 1;

  const basariYuzdesi =
    resultData.toplamSoru > 0
      ? Math.round((resultData.dogruSayisi / resultData.toplamSoru) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sınav Rapor Kartı</Text>
          <Text style={styles.headerSubtitle}>{resultData.testAdi}</Text>
        </View>

        {/* Skor Dairesi */}
        <View style={styles.mainCard}>
          <View style={styles.circleContainer}>
            <Text style={styles.circleScore}>
              {resultData.dogruSayisi} / {resultData.toplamSoru}
            </Text>
            <Text style={styles.circleLabel}>DOĞRU</Text>
          </View>

          <Text style={styles.motivationalTitle}>
            {basariYuzdesi >= 70 ? 'Tebrikler, Güzel İlerleme! 🎉' : 'Çalışmaya Devam! 💪'}
          </Text>
          <Text style={styles.motivationalDesc}>
            {basariYuzdesi >= 70
              ? 'Sınav barajını geçerek hedefine bir adım daha yaklaştın.'
              : 'Eksik konularını tekrar ederek netlerini artırabilirsin.'}
          </Text>
        </View>

        {/* 2x2 İstatistik Kartları */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Soru Sayısı</Text>
            <Text style={styles.statValueDark}>{resultData.toplamSoru} Soru</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Doğru</Text>
            <Text style={styles.statValueGreen}>{resultData.dogruSayisi} Doğru</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Yanlış</Text>
            <Text style={styles.statValueRed}>{resultData.yanlisSayisi} Yanlış</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Süre</Text>
            <Text style={styles.statValueOrange}>{resultData.gecenSure}</Text>
          </View>
        </View>

        {/* Konu Başarı Analizleri */}
        <Text style={styles.sectionTitle}>Konu Başarı Analizleri</Text>

        <View style={styles.analysisList}>
          {resultData.konuAnalizleri.map((item: any, index: number) => {
            const oran = item.toplam > 0 ? (item.dogru / item.toplam) * 100 : 0;
            return (
              <View key={index} style={styles.analysisCard}>
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisSubject}>{item.konuAdi}</Text>
                  <Text style={styles.analysisCount}>{item.dogru}/{item.toplam}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${oran}%`, backgroundColor: oran >= 60 ? '#486940' : '#D2603D' },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Alt Butonlar: Tekrar Çöz & Anasayfa */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              navigation.replace('Question', {
                testId: testId,
                lessonName: resultData.testAdi,
              })
            }
          >
            <Text style={styles.retryButtonText}>🔄 Tekrar Çöz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Anasayfa</Text>
          </TouchableOpacity>
        </View>

        {/* Soru İnceleme Butonu */}
        <TouchableOpacity
          style={styles.reviewLinkButton}
          onPress={() =>
            navigation.navigate('QuestionReview', {
              sorular: resultData.sorular || [],
              userAnswers: resultData.userAnswers || {},
              testAdi: resultData.testAdi,
              dogru: resultData.dogruSayisi,
              yanlis: resultData.yanlisSayisi,
            })
          }
        >
          <Text style={styles.reviewLinkText}>Detaylı Soru İncelemesine Git ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7EE' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  header: { alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#163143', fontFamily: 'BesleyBold' },
  headerSubtitle: { fontSize: 14, color: '#6E7781', marginTop: 4, fontFamily: 'RethinkSansRegular' },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#D2603D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  circleScore: { fontSize: 18, fontWeight: '700', color: '#163143', fontFamily: 'BesleyBold' },
  circleLabel: { fontSize: 10, fontWeight: '600', color: '#6E7781', marginTop: 2 },
  motivationalTitle: { fontSize: 18, fontWeight: '700', color: '#163143', marginBottom: 6, fontFamily: 'BesleyBold' },
  motivationalDesc: { fontSize: 13, color: '#6E7781', textAlign: 'center', lineHeight: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0EBE1',
  },
  statLabel: { fontSize: 12, color: '#6E7781', marginBottom: 8 },
  statValueDark: { fontSize: 18, fontWeight: '700', color: '#163143', fontFamily: 'BesleyBold' },
  statValueGreen: { fontSize: 18, fontWeight: '700', color: '#486940', fontFamily: 'BesleyBold' },
  statValueRed: { fontSize: 18, fontWeight: '700', color: '#D2603D', fontFamily: 'BesleyBold' },
  statValueOrange: { fontSize: 17, fontWeight: '700', color: '#D2603D', fontFamily: 'BesleyBold' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#163143', marginBottom: 12, fontFamily: 'BesleyBold' },
  analysisList: { marginBottom: 24 },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0EBE1',
  },
  analysisRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  analysisSubject: { fontSize: 14, fontWeight: '600', color: '#163143', flex: 1 },
  analysisCount: { fontSize: 13, fontWeight: '700', color: '#163143' },
  progressBarBackground: { height: 5, backgroundColor: '#EAE5DB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  retryButton: {
    flex: 1,
    backgroundColor: '#CE6A4A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', fontFamily: 'RethinkSansBold' },
  homeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: { color: '#1F3A4B', fontSize: 15, fontWeight: '600', fontFamily: 'RethinkSansBold' },
  reviewLinkButton: { alignItems: 'center', paddingVertical: 8 },
  reviewLinkText: { color: '#1F3A4B', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
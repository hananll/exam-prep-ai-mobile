import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { SoruApi } from './QuestionScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionReview'>;

export default function QuestionReviewScreen({ route, navigation }: Props) {
  const sorular: SoruApi[] = route?.params?.sorular || [];
  const userAnswers: { [soruId: number]: string } = route?.params?.userAnswers || {};
  const testAdi = route?.params?.testAdi || 'Soru İnceleme';
  const dogruSayisi = route?.params?.dogru ?? 0;
  const yanlisSayisi = route?.params?.yanlis ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Üst Başlık & Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Soru İnceleme</Text>
          <Text style={styles.headerSubtitle}>{testAdi}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Rapor Özeti Barı */}
        <View style={styles.reportSummaryBar}>
          <Text style={styles.reportSummaryTitle}>Rapor Özeti</Text>
          <Text style={styles.reportSummaryCounts}>
            {sorular.length} Soru • <Text style={{ color: '#486940' }}>{dogruSayisi} D</Text> •{' '}
            <Text style={{ color: '#9E2A2B' }}>{yanlisSayisi} Y</Text>
          </Text>
        </View>

        {/* Soruların Kart Listesi */}
        {sorular.map((soru, index) => {
          const userSelected = userAnswers[soru.id] || 'Boş';
          const isCorrect = userSelected === soru.dogru_secenek;

          return (
            <View key={soru.id || index} style={styles.cardItem}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={[styles.badgeSoruNo, isCorrect ? styles.bgCorrectBadge : styles.bgWrongBadge]}>
                    <Text style={[styles.badgeSoruNoText, isCorrect ? styles.textCorrect : styles.textWrong]}>
                      Soru {index + 1}
                    </Text>
                  </View>
                  <Text style={[styles.statusText, isCorrect ? styles.textCorrect : styles.textWrong]}>
                    {isCorrect ? '✓ Doğru' : '✕ Yanlış'}
                  </Text>
                </View>

                <Text style={styles.answerCompareText}>
                  Cevabın: <Text style={{ fontWeight: '700' }}>{userSelected}</Text> | Doğru:{' '}
                  <Text style={{ fontWeight: '700', color: '#486940' }}>{soru.dogru_secenek}</Text>
                </Text>
              </View>

              <Text style={styles.soruMetniShort} numberOfLines={2}>
                {soru.soru_metni}
              </Text>

              {/* Yanlış Sorularda Katie'ye Sor Butonu */}
              {!isCorrect && (
                <View style={styles.aiAskRow}>
                  <Text style={styles.aiAskPrompt}>Anlamadığın bir nokta mı var?</Text>
                  <TouchableOpacity
                    style={styles.aiAskButton}
                    onPress={() =>
                      navigation.navigate('KatieChat', {
                        soruId: soru.id,
                        soruMetni: soru.soru_metni,
                        userAnswer: userSelected,
                        correctAnswer: soru.dogru_secenek,
                        explanation: soru.cozum_aciklamasi,
                      })
                    }
                  >
                    <Text style={styles.aiAskButtonText}>Katie'ye Sor 👩‍💼</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Anasayfaya Dön Butonu */}
        <TouchableOpacity
          style={styles.bottomHomeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.bottomHomeButtonText}>Anasayfaya Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF6F0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E0D2',
    backgroundColor: '#FAF6F0',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 18, color: '#1F3A4B', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F3A4B', fontFamily: 'BesleyBold' },
  headerSubtitle: { fontSize: 12, color: '#6E7781', fontFamily: 'RethinkSansRegular' },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingVertical: 14 },
  reportSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  reportSummaryTitle: { fontSize: 15, fontWeight: '700', color: '#1F3A4B', fontFamily: 'BesleyBold' },
  reportSummaryCounts: { fontSize: 13, fontWeight: '600', color: '#1F3A4B' },
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0288D1',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeSoruNo: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bgCorrectBadge: { backgroundColor: '#E7EFE6' },
  bgWrongBadge: { backgroundColor: '#FDE9E2' },
  badgeSoruNoText: { fontSize: 12, fontWeight: '700' },
  statusText: { fontSize: 12, fontWeight: '700' },
  textCorrect: { color: '#486940' },
  textWrong: { color: '#9E2A2B' },
  answerCompareText: { fontSize: 12, color: '#1F3A4B' },
  soruMetniShort: { fontSize: 13.5, color: '#1F3A4B', lineHeight: 19, fontFamily: 'BesleyBold', marginBottom: 10 },
  aiAskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    paddingTop: 8,
  },
  aiAskPrompt: { fontSize: 12, color: '#6E7781' },
  aiAskButton: {
    backgroundColor: '#FFF1EC',
    borderWidth: 1,
    borderColor: '#CE6A4A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiAskButtonText: { fontSize: 12, color: '#CE6A4A', fontWeight: '700' },
  bottomHomeButton: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomHomeButtonText: { color: '#1F3A4B', fontSize: 14, fontWeight: '700' },
});
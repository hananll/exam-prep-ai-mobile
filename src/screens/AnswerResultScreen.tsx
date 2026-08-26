import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const API_BASE_URL = 'http://192.168.137.205:8000/api';

export interface SoruApi {
  id: number;
  soru_metni: string;
  secenek_a: string;
  secenek_b: string;
  secenek_c: string;
  secenek_d: string;
  secenek_e: string;
  dogru_secenek: 'A' | 'B' | 'C' | 'D' | 'E';
  cozum_aciklamasi?: string;
  sira_numarasi?: number;
  konu_adi?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'AnswerResult'>;

export default function AnswerResultScreen({ route, navigation }: any) {
  const testId = route.params?.testId || 1;
  const lessonName = route.params?.lessonName || 'KPSS DENEME TESTİ';

  const [sorular, setSorular] = useState<SoruApi[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [soruId: number]: string }>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Kronometre
  const [secondsPassed, setSecondsPassed] = useState(0);

  useEffect(() => {
    fetchSorular();
    const timer = setInterval(() => setSecondsPassed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSorular = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testler/${testId}/sorular`);
      const data = await response.json();
      if (response.ok && data.length > 0) {
        setSorular(data);
      } else {
        Alert.alert('Bilgi', 'Bu teste henüz soru eklenmemiş.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sorular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#CE6A4A" />
      </SafeAreaView>
    );
  }

  if (sorular.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={styles.questionText}>Kayıtlı soru bulunamadı.</Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.goBack()}>
          <Text style={styles.nextButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQ = sorular[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.dogru_secenek;

  const options = [
    { key: 'A', text: currentQ.secenek_a },
    { key: 'B', text: currentQ.secenek_b },
    { key: 'C', text: currentQ.secenek_c },
    { key: 'D', text: currentQ.secenek_d },
    { key: 'E', text: currentQ.secenek_e },
  ].filter((opt) => opt.text !== null && opt.text !== undefined && opt.text !== '');

  const handleSelectOption = (key: string) => {
    if (isAnswered) return; // Zaten cevaplandıysa tekrar tıklanamaz
    setSelectedOption(key);
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
  };

  const handleNext = () => {
    if (currentIndex < sorular.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null); // Sıradaki soru için seçimi sıfırla
    } else {
      // Test bitti -> QuizSummary (Rapor Kartı) ekranına geç
      let dogru = 0;
      let yanlis = 0;
      const konuMap: { [key: string]: { dogru: number; toplam: number } } = {};

      sorular.forEach((soru) => {
        const secilen = userAnswers[soru.id] || (soru.id === currentQ.id ? selectedOption : null);
        const konu = soru.konu_adi || lessonName;

        if (!konuMap[konu]) konuMap[konu] = { dogru: 0, toplam: 0 };
        konuMap[konu].toplam += 1;

        if (secilen === soru.dogru_secenek) {
          dogru += 1;
          konuMap[konu].dogru += 1;
        } else if (secilen) {
          yanlis += 1;
        }
      });

      const mins = Math.floor(secondsPassed / 60);
      const secs = secondsPassed % 60;

      navigation.navigate('QuizSummary', {
        resultData: {
          testAdi: lessonName,
          toplamSoru: sorular.length,
          dogruSayisi: dogru,
          yanlisSayisi: yanlis,
          gecenSure: `${mins} Dk ${secs} Sn`,
          konuAnalizleri: Object.keys(konuMap).map((k) => ({
            konuAdi: k,
            dogru: konuMap[k].dogru,
            toplam: konuMap[k].toplam,
          })),
          sorular: sorular,
          userAnswers: { ...userAnswers, [currentQ.id]: selectedOption || '' },
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst Durum Çubuğu */}
        <View style={styles.topBar}>
          <View style={styles.statusBox}>
            {isAnswered && (
              <Text style={[styles.statusText, { color: isCorrect ? '#486940' : '#D2603D' }]}>
                {isCorrect ? 'Doğru Cevap ✓' : 'Yanlış Cevap ✕'}
              </Text>
            )}
          </View>

          <Text style={styles.questionCounter}>
            Soru {currentIndex + 1} / {sorular.length}
          </Text>

          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>🔖 Kayıtlı</Text>
          </View>
        </View>

        {/* Soru Kartı */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.soru_metni}</Text>
        </View>

        {/* Şıklar */}
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isThisCorrect = isAnswered && option.key === currentQ.dogru_secenek;
            const isThisWrong = isAnswered && selectedOption === option.key && !isThisCorrect;

            return (
              <TouchableOpacity
                key={option.key}
                disabled={isAnswered}
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  isThisCorrect && styles.optionCardCorrect,
                  isThisWrong && styles.optionCardWrong,
                ]}
                onPress={() => handleSelectOption(option.key)}
              >
                <View
                  style={[
                    styles.optionLetterCircle,
                    isThisCorrect && styles.optionLetterCircleCorrect,
                    isThisWrong && styles.optionLetterCircleWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      isThisCorrect && styles.optionLetterCorrect,
                      isThisWrong && styles.optionLetterWrong,
                    ]}
                  >
                    {option.key}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optionText,
                    isThisCorrect && styles.optionTextCorrect,
                    isThisWrong && styles.optionTextWrong,
                  ]}
                >
                  {option.text}
                </Text>

                {isThisCorrect && <Text style={styles.checkIcon}>✓</Text>}
                {isThisWrong && <Text style={styles.crossIcon}>✕</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Anlık Açılan Ders Notu / Çözüm Analizi */}
        {isAnswered && currentQ.cozum_aciklamasi ? (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>🪶 Ders Notu Çözüm Analizi 💡</Text>
            <Text style={styles.explanationText}>{currentQ.cozum_aciklamasi}</Text>
          </View>
        ) : null}

        {/* Sıradaki Soru Butonu (Cevap verilince aktifleşir) */}
        {isAnswered && (
          <TouchableOpacity style={styles.nextButton} activeOpacity={0.85} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === sorular.length - 1 ? 'Testi Bitir' : 'Sıradaki Soruya Geç'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF6F0' },
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBox: { minWidth: 100 },
  statusText: { fontSize: 14, fontWeight: '700', fontFamily: 'BesleyBold' },
  questionCounter: { fontSize: 16, fontWeight: '700', color: '#1F3A4B', fontFamily: 'BesleyBold' },
  saveBadge: { backgroundColor: '#FDE9E2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  saveBadgeText: { fontSize: 12, color: '#CE6A4A', fontWeight: '600' },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  questionText: { fontSize: 15, lineHeight: 23, color: '#1F3A4B', fontFamily: 'BesleyBold' },
  optionsContainer: { gap: 10, marginBottom: 16 },
  optionCard: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9E0D2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardCorrect: { borderColor: '#486940', backgroundColor: '#F3F7F2' },
  optionCardWrong: { borderColor: '#9E2A2B', backgroundColor: '#FDF4F4' },
  optionLetterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9E0D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FAF6F0',
  },
  optionLetterCircleCorrect: { borderColor: '#486940', backgroundColor: '#E7EFE6' },
  optionLetterCircleWrong: { borderColor: '#9E2A2B', backgroundColor: '#F8E7E7' },
  optionLetter: { fontSize: 13, color: '#1F3A4B', fontFamily: 'BesleyBold' },
  optionLetterCorrect: { color: '#486940' },
  optionLetterWrong: { color: '#9E2A2B' },
  optionText: { flex: 1, fontSize: 13.5, color: '#1F3A4B', fontFamily: 'RethinkSansSemiBold' },
  optionTextCorrect: { color: '#284E20', fontWeight: '700' },
  optionTextWrong: { color: '#9E2A2B', fontWeight: '700' },
  checkIcon: { fontSize: 18, color: '#486940', fontWeight: 'bold', marginLeft: 8 },
  crossIcon: { fontSize: 16, color: '#9E2A2B', fontWeight: 'bold', marginLeft: 8 },
  explanationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E0D2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  explanationTitle: { fontSize: 15, fontWeight: '700', color: '#1F3A4B', fontFamily: 'BesleyBold', marginBottom: 8 },
  explanationText: { fontSize: 13, lineHeight: 20, color: '#4A5568', fontFamily: 'RethinkSansRegular' },
  nextButton: {
    backgroundColor: '#1F3A4B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', fontFamily: 'RethinkSansBold' },
});
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_BASE_URL = 'http://192.168.137.251:8000/api';

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  success: '#5F7F3B',
  danger: '#B73A32',
};

interface DersItem {
  id: number;
  ders_adi: string;
}

interface KonuItem {
  id: number;
  konu_adi: string;
}

interface SoruItem {
  id: number;
  soru_metni: string;
  konu_adi: string;
  ders_adi: string;
}

export default function AdminQuestionScreen() {
  const [dersler, setDersler] = useState<DersItem[]>([]);
  const [konular, setKonular] = useState<KonuItem[]>([]);
  const [questions, setQuestions] = useState<SoruItem[]>([]);
  const [selectedDersId, setSelectedDersId] = useState<number | null>(null);
  const [selectedKonuId, setSelectedKonuId] = useState<number | null>(null);

  // Form State
  const [soruMetni, setSoruMetni] = useState('');
  const [secenekA, setSecenekA] = useState('');
  const [secenekB, setSecenekB] = useState('');
  const [secenekC, setSecenekC] = useState('');
  const [secenekD, setSecenekD] = useState('');
  const [secenekE, setSecenekE] = useState('');
  const [dogruSecenek, setDogruSecenek] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [cozumAciklamasi, setCozumAciklamasi] = useState('');
  const [zorlukSeviyesi, setZorlukSeviyesi] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchDersler();
    fetchQuestions();
  }, []);

  const fetchDersler = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dersler`);
      const data = await res.json();
      const dersListesi = Array.isArray(data) ? data : (data.data || []);
      setDersler(dersListesi);
      if (dersListesi.length > 0) {
        setSelectedDersId(dersListesi[0].id);
        fetchKonular(dersListesi[0].id);
      }
    } catch (err) {
      Alert.alert('Hata', 'Dersler getirilemedi.');
    }
  };

  const fetchKonular = async (dersId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/dersler/${dersId}/konular`);
      const data = await res.json();
      const konuListesi = Array.isArray(data) ? data : (data.data || []);
      setKonular(konuListesi);
      if (konuListesi.length > 0) {
        setSelectedKonuId(konuListesi[0].id);
      } else {
        setSelectedKonuId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Sorular yüklenirken hata:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleDersChange = (dersId: number) => {
    setSelectedDersId(dersId);
    fetchKonular(dersId);
  };

  const handleSaveQuestion = async () => {
    if (!selectedKonuId || !soruMetni.trim() || !secenekA.trim() || !secenekB.trim()) {
      Alert.alert('Uyarı', 'Lütfen ders, konu, soru metni ve en az A-B seçeneklerini doldurun.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          konu_id: selectedKonuId,
          soru_metni: soruMetni,
          secenek_a: secenekA,
          secenek_b: secenekB,
          secenek_c: secenekC,
          secenek_d: secenekD,
          secenek_e: secenekE,
          dogru_secenek: dogruSecenek,
          cozum_aciklamasi: cozumAciklamasi,
          zorluk_seviyesi: zorlukSeviyesi,
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        Alert.alert('Başarılı', 'Soru veritabanına kaydedildi!');
        setSoruMetni('');
        setSecenekA('');
        setSecenekB('');
        setSecenekC('');
        setSecenekD('');
        setSecenekE('');
        setCozumAciklamasi('');
        fetchQuestions(); // Listeyi güncelle
      } else {
        Alert.alert('Hata', resData.message || 'Soru eklenemedi.');
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    Alert.alert('Soru Sil', 'Bu soruyu veritabanından kalıcı olarak silmek istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/admin/questions/${id}`, {
              method: 'DELETE',
              headers: { Accept: 'application/json' },
            });
            if (res.ok) {
              setQuestions((prev) => prev.filter((q) => q.id !== id));
              Alert.alert('Başarılı', 'Soru silindi.');
            } else {
              Alert.alert('Hata', 'Soru silinemedi.');
            }
          } catch (error) {
            Alert.alert('Hata', 'Sunucuya ulaşılamadı.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Admin Panel ⚙️</Text>
        <Text style={styles.pageSubtitle}>Yeni Soru Oluştur & Yönet</Text>

        {/* DERS SEÇİMİ */}
        <Text style={styles.label}>1. Ders Seçimi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {dersler.map((d) => (
            <Pressable
              key={d.id}
              style={[styles.chip, selectedDersId === d.id && styles.chipActive]}
              onPress={() => handleDersChange(d.id)}
            >
              <Text style={[styles.chipText, selectedDersId === d.id && styles.chipTextActive]}>
                {d.ders_adi}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* KONU SEÇİMİ */}
        <Text style={styles.label}>2. Konu Seçimi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {konular.map((k) => (
            <Pressable
              key={k.id}
              style={[styles.chip, selectedKonuId === k.id && styles.chipActive]}
              onPress={() => setSelectedKonuId(k.id)}
            >
              <Text style={[styles.chipText, selectedKonuId === k.id && styles.chipTextActive]}>
                {k.konu_adi}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* SORU METNİ */}
        <Text style={styles.label}>3. Soru Metni</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Soru metnini buraya yazın..."
          multiline
          numberOfLines={4}
          value={soruMetni}
          onChangeText={setSoruMetni}
        />

        {/* SEÇENEKLER */}
        <Text style={styles.label}>4. Seçenekler & Doğru Cevap</Text>
        {[
          { key: 'A', val: secenekA, set: setSecenekA },
          { key: 'B', val: secenekB, set: setSecenekB },
          { key: 'C', val: secenekC, set: setSecenekC },
          { key: 'D', val: secenekD, set: setSecenekD },
          { key: 'E', val: secenekE, set: setSecenekE },
        ].map((opt) => (
          <View key={opt.key} style={styles.optionRow}>
            <Pressable
              style={[
                styles.correctBadge,
                dogruSecenek === opt.key && styles.correctBadgeActive,
              ]}
              onPress={() => setDogruSecenek(opt.key as any)}
            >
              <Text
                style={[
                  styles.correctBadgeText,
                  dogruSecenek === opt.key && styles.correctBadgeTextActive,
                ]}
              >
                {opt.key}
              </Text>
            </Pressable>
            <TextInput
              style={[styles.input, styles.optionInput]}
              placeholder={`${opt.key} seçeneği metni`}
              value={opt.val}
              onChangeText={opt.set}
            />
          </View>
        ))}

        {/* ÇÖZÜM VE AÇIKLAMA */}
        <Text style={styles.label}>5. Çözüm Açıklaması (Opsiyonel)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Doğru cevabın ders notu / analiz açıklaması..."
          multiline
          numberOfLines={3}
          value={cozumAciklamasi}
          onChangeText={setCozumAciklamasi}
        />

        {/* KAYDET BUTONU */}
        <Pressable
          style={[styles.saveButton, loading && styles.disabled]}
          onPress={handleSaveQuestion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Soruyu Veritabanına Kaydet ➔</Text>
          )}
        </Pressable>

        {/* VERİTABANINDAKİ SORULARI LİSTELEME VE SİLME */}
        <View style={styles.divider} />
        <Text style={styles.sectionHeading}>Veritabanındaki Sorular ({questions.length})</Text>

        {loadingQuestions ? (
          <ActivityIndicator color={COLORS.orange} style={{ marginTop: 15 }} />
        ) : (
          questions.map((q) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.questionMeta}>{q.ders_adi} • {q.konu_adi}</Text>
                <Text style={styles.questionText} numberOfLines={2}>{q.soru_metni}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.deleteButton, pressed && { opacity: 0.7 }]}
                onPress={() => handleDeleteQuestion(q.id)}
              >
                <Text style={styles.deleteButtonText}>Sil</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 50 },
  pageTitle: { fontSize: 24, fontFamily: 'BesleyBold', color: COLORS.primary },
  pageSubtitle: { fontSize: 13, color: COLORS.secondary, marginBottom: 16 },
  label: { fontSize: 14, fontFamily: 'BesleyBold', color: COLORS.primary, marginTop: 12, marginBottom: 6 },
  chipScroll: { flexDirection: 'row', marginBottom: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  chipText: { fontSize: 13, color: COLORS.primary },
  chipTextActive: { color: COLORS.white, fontWeight: 'bold' },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.primary,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  correctBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  correctBadgeActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  correctBadgeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  correctBadgeTextActive: { color: COLORS.white },
  optionInput: { flex: 1 },
  saveButton: {
    marginTop: 20,
    backgroundColor: COLORS.orange,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  disabled: { opacity: 0.7 },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 25,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: 'BesleyBold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionMeta: {
    fontSize: 11,
    color: COLORS.orange,
    fontFamily: 'RethinkSansBold',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: 'RethinkSansRegular',
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
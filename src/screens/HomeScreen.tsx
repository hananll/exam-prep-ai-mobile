import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  cardBg: '#FFFFFF',
};

const API_BASE_URL = 'http://192.168.137.251:8000/api';

export interface DersApi {
  id: number;
  ders_adi: string;
  sira_numarasi?: number;
}

export default function HomeScreen({ navigation }: any) {
  const [dersler, setDersler] = useState<DersApi[]>([]);
  const [loading, setLoading] = useState(true);

  const getDersIcon = (dersAdi: string) => {
    const name = dersAdi.toLowerCase();
    if (name.includes('türkçe')) return '📚';
    if (name.includes('matematik') || name.includes('geometri')) return '📐';
    if (name.includes('tarih')) return '🏛️';
    if (name.includes('coğrafya')) return '🌍';
    if (name.includes('vatandaşlık')) return '⚖️';
    if (name.includes('güncel')) return '📰';
    return '📝';
  };

  const fetchDersler = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dersler`);
      const data = await response.json();
      
      if (response.ok) {
        const dersListesi = Array.isArray(data) ? data : (data.data || []);
        setDersler(dersListesi);
      } else {
        Alert.alert('Hata', 'Ders listesi alınamadı.');
      }
    } catch (error) {
      console.error('Dersler yüklenirken hata:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı. IP adresini kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDersler();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER & LOGIN TETİKLEYİCİ STREAK ROZETİ */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Sınav Yolu</Text>
            <Text style={styles.headerSubtitle}>KPSS HAZIRLIK REHBERİ</Text>
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.streakBadge,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Login' as any)}
          >
            <Text style={styles.streakText}>🔥 Giriş Yap & Serini Koru</Text>
          </Pressable>
        </View>

        {/* GÜNÜN NOTU */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteTitle}>Günün Notu ✍️</Text>
            <Text style={styles.quoteBadge}>ÖSYM Tarzı</Text>
          </View>
          <Text style={styles.quoteBody}>
            "Büyük başarılar, her gün atılan küçük adımların toplamıdır. Tarih tekrardan ibarettir, senin başarın ise kalıcı olacak!"
          </Text>
        </View>

        {/* GÜNLÜK HEDEF KARTI */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Bugünkü Hedefin</Text>
            <Text style={styles.goalProgressText}>120 / 200 Soru</Text>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: '60%' }]} />
          </View>
          <View style={styles.goalStatsRow}>
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

        {/* HIZLI KARMA PRATİK */}
        <Pressable
          style={({ pressed }) => [styles.quickPracticeCard, pressed && styles.pressed]}
          onPress={() => Alert.alert('Bilgi', 'Karma deneme modu hazırlanıyor.')}
        >
          <View>
            <Text style={styles.quickTitle}>Hızlı Karma Pratik</Text>
            <Text style={styles.quickSubtitle}>ÖSYM çıkmış sorularından seçmeler</Text>
          </View>
          <Text style={styles.quickArrow}>➔</Text>
        </Pressable>

        {/* DERS ÇALIŞMA ALANI */}
        <Text style={styles.sectionTitle}>Ders Çalışma Alanı</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.subjectList}>
            {dersler.map((ders) => (
              <Pressable
                key={ders.id}
                style={({ pressed }) => [styles.subjectCard, pressed && styles.pressed]}
                onPress={() => {
                  navigation.navigate('SubjectTopics' as any, {
                    dersId: ders.id,
                    dersAdi: ders.ders_adi,
                  });
                }}
              >
                <View style={styles.subjectCardLeft}>
                  <View style={styles.subjectIconCircle}>
                    <Text style={styles.subjectIcon}>{getDersIcon(ders.ders_adi)}</Text>
                  </View>
                  <View>
                    <Text style={styles.subjectName}>{ders.ders_adi}</Text>
                    <Text style={styles.subjectSubText}>Konu testleri & denemeler</Text>
                  </View>
                </View>

                <View style={styles.arrowCircle}>
                  <Text style={styles.cardArrow}>➔</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
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
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansBold',
    letterSpacing: 0.5,
  },
  streakBadge: {
    borderWidth: 1.2,
    borderColor: '#F3C4B3',
    backgroundColor: '#FFF0EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: COLORS.orange,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  streakText: {
    color: COLORS.orange,
    fontSize: 12.5,
    fontFamily: 'RethinkSansBold',
  },
  quoteCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'BesleyBold',
  },
  quoteBadge: {
    fontSize: 11,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansSemiBold',
  },
  quoteBody: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
    fontFamily: 'RethinkSansRegular',
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'BesleyBold',
  },
  goalProgressText: {
    color: COLORS.orange,
    fontSize: 13,
    fontFamily: 'RethinkSansBold',
  },
  goalTrack: {
    height: 6,
    backgroundColor: '#EEE8DF',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 12,
  },
  goalFill: {
    height: '100%',
    backgroundColor: COLORS.orange,
    borderRadius: 99,
  },
  goalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansRegular',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
  },
  quickPracticeCard: {
    backgroundColor: '#1C384A',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'BesleyBold',
    marginBottom: 2,
  },
  quickSubtitle: {
    color: '#B0C4D0',
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },
  quickArrow: {
    color: COLORS.white,
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: 'BesleyBold',
    marginBottom: 12,
  },
  subjectList: {
    gap: 10,
  },
  subjectCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  subjectCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FDE0D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIcon: {
    fontSize: 20,
  },
  subjectName: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'BesleyBold',
    marginBottom: 2,
  },
  subjectSubText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrow: {
    color: COLORS.orange,
    fontSize: 13,
    fontFamily: 'RethinkSansBold',
  },
  pressed: {
    opacity: 0.85,
  },
});
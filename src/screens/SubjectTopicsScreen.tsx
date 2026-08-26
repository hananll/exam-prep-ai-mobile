import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
};

const API_BASE_URL = 'http://192.168.137.251:8000/api';

export interface TestPaketiApi {
  id: number;
  test_adi: string;
  konu_adi: string;
  hedef_soru_sayisi: number;
  eklenen_soru_sayisi: number;
}

export default function SubjectTopicsScreen({ navigation, route }: any) {
  const dersId = route.params?.dersId || 1;
  const dersAdi = route.params?.dersAdi || 'Türkçe';

  const [testler, setTestler] = useState<TestPaketiApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTestler = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dersler/${dersId}/test-paketleri`);
      const data = await response.json();
      if (response.ok) {
        setTestler(data);
      } else {
        Alert.alert('Bilgi', 'Bu derse ait test paketi bulunamadı.');
      }
    } catch (error) {
      console.error('Testler yüklenirken hata:', error);
      Alert.alert('Bağlantı Hatası', 'Testler sunucudan yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestler();
  }, [dersId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTestler();
  }, [dersId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.orange]} />
        }
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
            <Text style={styles.headerTitle}>{dersAdi} Testleri</Text>
            <Text style={styles.headerSubtitle}>
              Mevcut Test Paketleri ve Denemeler
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>{dersAdi} Başarı Durumu 📈</Text>
            <Text style={styles.summaryText}>
              Veritabanında çözülmeye hazır toplam {testler.length} test paketi bulunuyor.
            </Text>
          </View>

          <View style={styles.summaryCircle}>
            <Text style={styles.summaryCircleText}>%{testler.length > 0 ? '100' : '0'}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.listContainer}>
            {testler.length === 0 ? (
              <Text style={{ textAlign: 'center', color: COLORS.secondary, marginTop: 20 }}>
                Bu derse ait tanımlı test paketi bulunmuyor.
              </Text>
            ) : (
              testler.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [styles.topicCard, pressed && styles.pressed]}
                  onPress={() => {
                    if (item.eklenen_soru_sayisi === 0) {
                      Alert.alert('Bilgi', 'Bu teste henüz soru eklenmemiştir.');
                      return;
                    }
                    navigation.navigate('Question' as any, {
                      testId: item.id,
                      lessonName: `${dersAdi} - ${item.test_adi}`,
                    });
                  }}
                >
                  <View style={styles.topicHeader}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.topicTitle}>
                        {index + 1}. {item.test_adi}
                      </Text>
                      <Text style={styles.subTopicText}>{item.konu_adi}</Text>
                    </View>

                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>TESTE BAŞLA ➔</Text>
                    </View>
                  </View>

                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(100, (item.eklenen_soru_sayisi / item.hedef_soru_sayisi) * 100)}%`,
                            backgroundColor: COLORS.orange,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.progressText}>
                      {item.eklenen_soru_sayisi}/{item.hedef_soru_sayisi} Soru
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
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
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  topicTitle: {
    color: COLORS.primary,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'BesleyBold',
  },
  subTopicText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: '#FDE9E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    color: COLORS.orange,
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
    textAlign: 'right',
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: 'RethinkSansSemiBold',
  },
  pressed: {
    opacity: 0.85,
  },
});
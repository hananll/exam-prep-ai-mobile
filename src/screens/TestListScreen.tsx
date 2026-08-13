import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';

const DUMMY_TESTS = [
  { id: 1, baslik: 'Tarih - Osmanlı Yükselme Dönemi', soru_sayisi: 10 },
  { id: 2, baslik: 'Coğrafya - Türkiye Coğrafi Konumu', soru_sayisi: 10 },
  { id: 3, baslik: 'Vatandaşlık - Anayasa Hukuku', soru_sayisi: 10 },
  { id: 4, baslik: 'Türkçe - Paragrafta Anlam', soru_sayisi: 10 },
  { id: 5, baslik: 'Matematik - Sayı Problemleri', soru_sayisi: 10 },
];

export const TestListScreen = () => {
  const [userUuid] = useState<string>('e4a1b2c3-8f9d-4e5a');
  const [kalanHak, setKalanHak] = useState<number>(1);
  const [toplamDogru] = useState<number>(18);
  const [toplamYanlis] = useState<number>(4);

  const handleTestStart = (testBaslik: string) => {
    if (kalanHak <= 0) {
      Alert.alert(
        'Çözüm Hakkınız Bitti!',
        'Soru çözmeye devam edebilmek için reklam izleyerek veya hak satın alarak çözüm hakkı kazanabilirsiniz.',
        [{ text: 'Tamam', style: 'cancel' }]
      );
      return;
    }

    Alert.alert(
      'Test Başlatılsın mı?',
      `"${testBaslik}" testine başlamak üzeresiniz. 1 çözüm hakkınız düşülecektir.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Başla',
          onPress: () => {
            setKalanHak(prev => prev - 1);
            Alert.alert('Başarılı', 'Test başladı! Hak 1 düşürüldü.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.statsCard}>
        <View style={styles.uuidRow}>
          <Text style={styles.uuidLabel}>Cihaz UUID:</Text>
          <Text style={styles.uuidValue}>{userUuid}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{kalanHak}</Text>
            <Text style={styles.statLabel}>Çözüm Hakkı</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#2ecc71' }]}>{toplamDogru}</Text>
            <Text style={styles.statLabel}>Toplam Doğru</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#e74c3c' }]}>{toplamYanlis}</Text>
            <Text style={styles.statLabel}>Toplam Yanlış</Text>
          </View>
        </View>
      </View>

      {/* ALT PANEL: Testler Listesi */}
      <Text style={styles.sectionTitle}>Mevcut Testler</Text>

      <FlatList
        data={DUMMY_TESTS}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.testCard}>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>{item.baslik}</Text>
              <Text style={styles.testSubTitle}>{item.soru_sayisi} Soru</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.solveButton,
                kalanHak <= 0 && styles.disabledButton,
              ]}
              onPress={() => handleTestStart(item.baslik)}
            >
              <Text style={styles.solveButtonText}>Çöz</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default TestListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uuidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  uuidLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  uuidValue: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  statLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  testSubTitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  solveButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  solveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
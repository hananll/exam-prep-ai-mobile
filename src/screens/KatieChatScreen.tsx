import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const API_BASE_URL = 'http://192.168.137.205:8000/api';

interface Message {
  id: string;
  sender: 'katie' | 'user';
  text: string;
  time: string;
  fromCache?: boolean;
}

type Props = NativeStackScreenProps<RootStackParamList, 'KatieChat'>;

export default function KatieChatScreen({ route, navigation }: any) {
  const soruId = route?.params?.soruId || 1;
  const soruMetni = route?.params?.soruMetni || '';
  const userAnswer = route?.params?.userAnswer || '';
  const correctAnswer = route?.params?.correctAnswer || '';
  const explanation = route?.params?.explanation || '';

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 1. Katman: 0 Maliyetli ilk statik karşılama mesajı
  const initialText = explanation
    ? `${explanation}\n\nSen ${userAnswer} şıkkını seçmiştin fakat doğru cevap ${correctAnswer}. Bu soruyla veya konuyla ilgili aklına takılan herhangi bir nokta varsa bana sorabilirsin! 😊`
    : `Bu soruda doğru cevap ${correctAnswer} şıkkıdır. Konuyla ilgili aklına takılanları bana sorabilirsin!`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'katie',
      text: initialText,
      time: getCurrentTime(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (inputText.trim() === '' || loading) return;

    const userMessageText = inputText.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/katie/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          soru_id: soruId,
          message: userMessageText,
          user_answer: userAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        const katieReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'katie',
          text: data.answer,
          time: getCurrentTime(),
          fromCache: data.from_cache,
        };
        setMessages((prev) => [...prev, katieReply]);
      } else {
        Alert.alert('Bilgi', 'Katie şu anda yanıt veremiyor. Lütfen tekrar dene.');
      }
    } catch (error) {
      console.error('Katie API Hatası:', error);
      Alert.alert('Hata', 'Sunucuyla bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Üst Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Katie</Text>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerSubtitle}>Aktif • Size yardımcı olmaya hazır</Text>
        </View>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() =>
            Alert.alert(
              'Katie Hakkında',
              'Katie, yapay zeka destekli KPSS rehberinizdir. Sorularınıza anında ve kişiselleştirilmiş açıklamalar sunar.'
            )
          }
        >
          <Text style={styles.infoButtonText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* Mesajlaşma Alanı */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => {
            const isKatie = msg.sender === 'katie';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isKatie ? styles.wrapperKatie : styles.wrapperUser,
                ]}
              >
                {isKatie && (
                  <View style={styles.katieAvatar}>
                    <Text style={styles.avatarIcon}>👩‍💼</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isKatie ? styles.bubbleKatie : styles.bubbleUser,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isKatie ? styles.textKatie : styles.textUser,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isKatie ? styles.timeKatie : styles.timeUser,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Yükleniyor / Yazıyor Balonu */}
          {loading && (
            <View style={[styles.messageWrapper, styles.wrapperKatie]}>
              <View style={styles.katieAvatar}>
                <Text style={styles.avatarIcon}>👩‍💼</Text>
              </View>
              <View style={[styles.messageBubble, styles.bubbleKatie, { paddingVertical: 10 }]}>
                <ActivityIndicator size="small" color="#5C62F6" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Alt Mesaj Yazma Çubuğu */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachButtonText}>+</Text>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Mesajınızı yazın..."
              placeholderTextColor="#9EA5AD"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={styles.emojiIcon}>😊</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={loading}
          >
            <Text style={styles.sendButtonIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 30, color: '#163143', fontWeight: '300' },
  headerCenter: { flex: 1, marginLeft: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#163143', fontFamily: 'BesleyBold' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C853' },
  headerSubtitle: { fontSize: 12, color: '#8A94A6', marginTop: 2 },
  infoButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  infoButtonText: { fontSize: 20, color: '#8A94A6' },
  messageList: { flex: 1 },
  messageContent: { paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  wrapperKatie: { justifyContent: 'flex-start', paddingRight: 40 },
  wrapperUser: { justifyContent: 'flex-end', paddingLeft: 40 },
  katieAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  avatarIcon: { fontSize: 16 },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleKatie: {
    backgroundColor: '#F3F5F9',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#5C62F6',
    borderBottomRightRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 21 },
  textKatie: { color: '#2B3445', fontFamily: 'RethinkSansRegular' },
  textUser: { color: '#FFFFFF', fontFamily: 'RethinkSansRegular' },
  messageTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  timeKatie: { color: '#8A94A6' },
  timeUser: { color: '#D6D9FD' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    gap: 10,
  },
  attachButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonText: { fontSize: 20, color: '#6E7781' },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F9',
    borderRadius: 22,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#163143',
    paddingVertical: 8,
  },
  emojiButton: { padding: 4 },
  emojiIcon: { fontSize: 16 },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#5C62F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonIcon: { fontSize: 16, color: '#FFFFFF', transform: [{ rotate: '-20deg' }] },
});
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import type { RootStackParamList } from '../../App';

// OAuth tarayıcı oturumunun dönüşte doğru tamamlanması için zorunludur
WebBrowser.maybeCompleteAuthSession();

const COLORS = {
  primary: '#1F3A4B',
  secondary: '#5C6F7D',
  white: '#FFFFFF',
  border: '#E9E0D2',
  orange: '#CE6A4A',
  background: '#FAF6F0',
  softOrange: '#FFF3EC',
  lightText: '#8B97A2',
};

const BASE_API_URL = 'http://192.168.137.251:8000/api';
const GOOGLE_CLIENT_ID = '982482605809-dtam96dpod73hevjv541orcch9nd8bcq.apps.googleusercontent.com';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  // Şifremi Unuttum Modal State
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Google OAuth Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    redirectUri: 'https://auth.expo.io/@anonymous/KPSSAppExpo',
  });

  // Google Giriş Yanıtını Dinleme
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchGoogleUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // Google Token ile Kullanıcı Bilgilerini Çekme
  const fetchGoogleUserInfo = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();

      if (userInfo?.email) {
        await handleSocialBackendSync(
          'google',
          userInfo.email,
          userInfo.name || userInfo.email.split('@')[0]
        );
      } else {
        Alert.alert('Hata', 'Google hesap bilgileri alınamadı.');
      }
    } catch (error) {
      console.error('Google UserInfo Hatası:', error);
      Alert.alert('Hata', 'Google bilgileri çekilirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Laravel Backend Sosyal Giriş Senkronizasyonu
  const handleSocialBackendSync = async (
    provider: 'google' | 'apple',
    userEmail: string,
    userName?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          provider,
          email: userEmail,
          name: userName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Başarılı', `${provider === 'google' ? 'Google' : 'Apple'} ile giriş yapıldı!`);
        navigation.replace('Home');
      } else {
        Alert.alert('Hata', data.message || 'Sosyal giriş işlemi tamamlanamadı.');
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı. Wi-Fi ve IP ayarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Standart E-posta / Şifre Girişi
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Uyarı', 'Lütfen e-posta ve şifre alanlarını doldurunuz.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Başarılı', 'Giriş yapıldı, serin ve ilerlemen güvende!');
        navigation.replace('Home');
      } else {
        const errorMessage =
          data.errors?.email?.[0] ||
          data.errors?.password?.[0] ||
          data.message ||
          'Giriş bilgileri hatalı!';
        Alert.alert('Giriş Başarısız', errorMessage);
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı. Wi-Fi ve IP ayarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Şifre Sıfırlama Bağlantısı Gönderme
  const handleSendResetLink = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Uyarı', 'Lütfen e-posta adresinizi giriniz.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Alert.alert('E-posta Gönderildi', data.message || 'Şifre sıfırlama bağlantısı e-postanıza iletildi.');
        setForgotModalVisible(false);
        setForgotEmail('');
      } else {
        Alert.alert('İşlem Başarısız', data.message || 'Kullanıcı bulunamadı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandSection}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>📖</Text>
            </View>
            <Text style={styles.brandTitle}>Sınav Yolu</Text>
          </View>
          <Text style={styles.brandSubtitle}>KPSS yolculuğunda yanındayız</Text>
        </View>

        <View style={styles.reminderCard}>
          <Text style={styles.reminderLabel}>🔥 ÇALIŞMA SERİNİ KORU</Text>
          <Text style={styles.reminderText}>
            "12 günlük çalışma serin ve çözdüğün sorular kaybolmasın. Giriş yap veya kayıt ol, tüm istatistiklerini bulutta eşitle!"
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Giriş Yap</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>E-posta</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@sinavyolu.com"
                placeholderTextColor={COLORS.lightText}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Şifre</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.lightText}
                secureTextEntry={secureText}
                style={styles.input}
              />
              <Pressable onPress={() => setSecureText((prev) => !prev)}>
                <Ionicons
                  name={secureText ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={COLORS.secondary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.forgotPasswordWrap, pressed && styles.pressed]}
            onPress={() => setForgotModalVisible(true)}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </Pressable>

          <Pressable
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              (pressed || loading) && styles.pressed,
            ]}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Giriş Yap →</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* SOSYAL GİRİŞ BUTONLARI */}
          <View style={styles.socialRow}>
            <Pressable
              disabled={!request || loading}
              style={({ pressed }) => [styles.socialButton, (pressed || !request) && styles.pressed]}
              onPress={() => promptAsync()}
            >
              <Ionicons name="logo-google" size={18} color="#000000" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
              onPress={() => Alert.alert('Bilgi', 'Apple ile giriş yakında aktif edilecektir.')}
            >
              <Ionicons name="logo-apple" size={19} color="#000000" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Hesabın yok mu? </Text>
          <Pressable onPress={() => Alert.alert('Kayıt Ol', 'Kayıt olma sayfası hazırlanıyor.')}>
            <Text style={styles.signupLink}>Kayıt Ol</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ŞİFREMİ UNUTTUM MODAL */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Şifremi Unuttum 🔑</Text>
            <Text style={styles.modalSubtitle}>
              Kayıtlı e-posta adresini gir. Şifre sıfırlama bağlantısını anında gönderelim.
            </Text>

            <View style={[styles.inputRow, { marginTop: 14, marginBottom: 20 }]}>
              <Ionicons name="mail-outline" size={18} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                value={forgotEmail}
                onChangeText={setForgotEmail}
                placeholder="ornek@sinavyolu.com"
                placeholderTextColor={COLORS.lightText}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.modalActionRow}>
              <Pressable
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setForgotModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>İptal</Text>
              </Pressable>

              <Pressable
                disabled={forgotLoading}
                style={[styles.modalBtn, styles.modalSendBtn]}
                onPress={handleSendResetLink}
              >
                {forgotLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.modalSendBtnText}>Link Gönder</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.softOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoIcon: {
    fontSize: 16,
  },
  brandTitle: {
    color: COLORS.primary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'BesleyBold',
    paddingTop: 2,
  },
  brandSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansRegular',
  },
  reminderCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F3C4B3',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  reminderLabel: {
    color: COLORS.orange,
    fontSize: 12.5,
    fontFamily: 'RethinkSansBold',
    marginBottom: 4,
  },
  reminderText: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'BesleyItalic',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  formTitle: {
    color: COLORS.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'BesleyBold',
    marginBottom: 18,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansRegular',
    marginBottom: 6,
  },
  inputRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansRegular',
    paddingVertical: 8,
  },
  forgotPasswordWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansSemiBold',
  },
  loginButton: {
    height: 48,
    backgroundColor: COLORS.orange,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'RethinkSansBold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontFamily: 'RethinkSansRegular',
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'RethinkSansSemiBold',
  },
  signupRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontFamily: 'RethinkSansRegular',
  },
  signupLink: {
    color: COLORS.orange,
    fontSize: 14,
    fontFamily: 'RethinkSansBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 58, 75, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'BesleyBold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.secondary,
    fontFamily: 'RethinkSansRegular',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F0ECE4',
  },
  modalCancelBtnText: {
    color: COLORS.secondary,
    fontFamily: 'RethinkSansSemiBold',
    fontSize: 13,
  },
  modalSendBtn: {
    backgroundColor: COLORS.orange,
    minWidth: 100,
  },
  modalSendBtnText: {
    color: COLORS.white,
    fontFamily: 'RethinkSansBold',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.86,
  },
});
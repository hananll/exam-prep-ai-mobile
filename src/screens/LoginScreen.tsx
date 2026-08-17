import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
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
  softOrange: '#FFF3EC',
  lightText: '#8B97A2',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('ornek@sinavyolu.com');
  const [password, setPassword] = useState('123456789');
  const [secureText, setSecureText] = useState(true);

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

          <Text style={styles.brandSubtitle}>
            KPSS yolculuğunda yanındayız
          </Text>
        </View>

        <View style={styles.reminderCard}>
          <Text style={styles.reminderLabel}>✣ GÜNÜN HATIRLATICISI</Text>
          <Text style={styles.reminderText}>
            "Büyük başarılar, her gün atılan küçük ve istikrarlı adımlar ile
            inşa edilir. Bugün kendin için yeni bir başlangıç yap!"
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Giriş Yap</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>E-posta veya Telefon</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta veya Telefon"
                placeholderTextColor={COLORS.lightText}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Şifre</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Şifre"
                placeholderTextColor={COLORS.lightText}
                secureTextEntry={secureText}
                style={styles.input}
              />
              <Pressable onPress={() => setSecureText((prev) => !prev)}>
                <Text style={styles.eyeIcon}>{secureText ? '◔' : '◕'}</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.forgotPasswordWrap,
              pressed && styles.pressed,
            ]}
            onPress={() => console.log('Şifremi Unuttum')}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginButtonText}>Giriş Yap →</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log('Google')}
            >
              <Text style={styles.socialIcon}>◉</Text>
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log('Apple')}
            >
              <Text style={styles.socialIcon}>◧</Text>
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Hesabın yok mu? </Text>
          <Pressable onPress={() => console.log('Kayıt Ol')}>
            <Text style={styles.signupLink}>Kayıt Ol</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },

  brandSection: {
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 18,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
  },

  reminderLabel: {
    color: COLORS.orange,
    fontSize: 13,
    fontFamily: 'RethinkSansBold',
    marginBottom: 8,
  },

  reminderText: {
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'BesleyItalic',
  },

  formCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },

  formTitle: {
    color: COLORS.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'BesleyBold',
    marginBottom: 22,
  },

  fieldBlock: {
    marginBottom: 16,
  },

  fieldLabel: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansRegular',
    marginBottom: 8,
  },

  inputRow: {
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputIcon: {
    color: COLORS.secondary,
    fontSize: 15,
    width: 26,
    textAlign: 'center',
  },

  input: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'RethinkSansRegular',
    paddingVertical: 10,
  },

  eyeIcon: {
    color: COLORS.secondary,
    fontSize: 18,
    paddingHorizontal: 2,
  },

  forgotPasswordWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 22,
  },

  forgotPasswordText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontFamily: 'RethinkSansSemiBold',
  },

  loginButton: {
    height: 50,
    backgroundColor: COLORS.orange,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'RethinkSansBold',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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

  socialIcon: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 8,
  },

  socialText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: 'RethinkSansSemiBold',
  },

  signupRow: {
    marginTop: 22,
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

  pressed: {
    opacity: 0.86,
  },
});
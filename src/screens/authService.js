import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.137.251:8000/api';

// 1. Kayıt Olma
export async function register(name, email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return await response.json();
}

// 2. Giriş Yapma ve Token Alma
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  
  if (data.token) {
    await AsyncStorage.setItem('auth_token', data.token);
  }
  return data;
}

// 3. Giriş Yapan Kullanıcının Profilini Çekme
export async function getCurrentUser() {
  const token = await AsyncStorage.getItem('auth_token');

  const response = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
}
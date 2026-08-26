// src/api.ts

export const BASE_URL = 'http://192.168.137.251:8000/api';

// 1. Giriş Yapma (Login)
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Login Hatası:', error);
    throw error;
  }
};

// 2. Dersleri ve Altındaki Konuları Çekme
export const getDerslerApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}/dersler`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dersleri çekme hatası:', error);
    throw error;
  }
};

// 3. Belirli Bir Derse Ait Konuları Çekme (Eğer ayrı endpoint varsa)
export const getKonularByDersApi = async (dersId: number | string) => {
  try {
    const response = await fetch(`${BASE_URL}/dersler/${dersId}/konular`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Konuları çekme hatası:', error);
    throw error;
  }
};

// 4. Test Kullanıcılarını Çekme
export const getUsersApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: { 'Accept': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw error;
  }
};
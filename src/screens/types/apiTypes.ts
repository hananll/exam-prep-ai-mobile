export interface Ders {
  id: number;
  ders_adi: string;
  aktif_mi: boolean;
}

export interface Konu {
  id: number;
  ders_id: number;
  konu_adi: string;
  sira_numarasi: string;
}

export interface TestModel {
  id: number;
  konu_id: number;
  seviye_id: number;
  test_adi: string;
  soru_sayisi: number;
  sure_dakika: number | null;
  aktif_mi: boolean;
}

export interface Soru {
  id: number;
  soru_metni: string;
  secenek_a: string;
  secenek_b: string;
  secenek_c: string;
  secenek_d: string;
  secenek_e: string;
  dogru_secenek: 'A' | 'B' | 'C' | 'D' | 'E';
  cozum_aciklamasi?: string;
  zorluk_seviyesi: number;
  sira_numarasi?: number;
}
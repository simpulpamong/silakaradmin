/** Canonical Google Sheets contract shared by writers and init/repair code.
 * Indices are zero-based (the Sheets API uses one-based row numbers).
 * Keep these arrays in exact spreadsheet order; append rows depend on it.
 */
export const REPORT_HEADERS = [
  'Waktu Submit', 'ID Laporan', 'Kategori', 'Tanggal Kejadian', 'Hari', 'Lokasi',
  'Latitude', 'Longitude', 'Google Maps', 'Pelapor', 'Pemilik / Objek', 'Jumlah Penghuni',
  'Korban', 'Penyebab', 'Kronologi', 'Tindakan', 'Kerugian', 'Harta Terselamatkan',
  'Luas Area', 'Jarak Tempuh', 'Estimasi Perjalanan', 'Waktu Laporan', 'Waktu Berangkat',
  'Waktu Tiba', 'Waktu Mulai', 'Waktu Selesai', 'Waktu Kembali', 'Armada', 'Personel',
  'Kendala', 'Rincian Kegiatan', 'Narasi Asli', 'Folder Drive', 'Jumlah Foto', 'Status', 'Sumber',
] as const;

export const PHOTO_HEADERS = [
  'Waktu Upload', 'ID Laporan', 'Kategori', 'Tanggal', 'Nama File', 'URL Drive', 'File ID',
  'Folder Drive', 'Latitude', 'Longitude', 'Google Maps', 'Sumber Foto', 'Ada GPS', 'Waktu Foto',
  'Alamat Foto', 'Keterangan', 'Status',
] as const;

export const REPORT_INDEX = Object.freeze(Object.fromEntries(REPORT_HEADERS.map((name, index) => [name, index])));
export const PHOTO_INDEX = Object.freeze(Object.fromEntries(PHOTO_HEADERS.map((name, index) => [name, index])));

export function headersMatch(expected: readonly string[], actual: readonly unknown[]): boolean {
  return expected.length === actual.length && expected.every((name, index) =>
    String(actual[index] ?? '').trim().toLowerCase() === name.toLowerCase(),
  );
}

export const SCHEMA_CONTRACT = Object.freeze({
  reports: { sheets: ['KEBAKARAN', 'ODNK'] as const, headers: REPORT_HEADERS, index: REPORT_INDEX },
  photos: { sheets: ['DOKUMENTASI KEBAKARAN', 'DOKUMENTASI ODNK'] as const, headers: PHOTO_HEADERS, index: PHOTO_INDEX },
});

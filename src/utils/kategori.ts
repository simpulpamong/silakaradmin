/**
 * Sumber kebenaran kategori laporan untuk seluruh admin.
 * Dipakai sub menu sidebar (Rekap Laporan → percabangan kolaps), filter &
 * identitas halaman Rekap, dan tampilan label — supaya tidak ada label ganda.
 *
 * Metadata `description`/`tone`/`icon`/`flow` disinkronkan dengan aplikasi
 * pelaporan (silakar mobile) di `silakar/src/lib/constants.ts` → `CATEGORIES`.
 * Baris Spreadsheet tanpa kategori = Kebakaran (aturan data yang sama).
 */

/** Jenis alur kerja kategori — Damkar (kebakaran) vs struktur (ODNK). */
export type KategoriFlow = 'damkar' | 'structured';
/** Warna aksen kategori — sama dgn `CategoryTone` di mobile. */
export type KategoriTone = 'teal' | 'amber' | 'rose' | 'orange' | 'blue' | 'violet';
/** Nama ikon kategori — sama dgn `CategoryIcon` di mobile (dipetakan ke lucide). */
export type KategoriIconName = 'shield' | 'landmark' | 'heart' | 'flame' | 'users' | 'briefcase';

export interface KategoriDef {
  slug: string;
  label: string;
  /** Deskripsi singkat — sama dgn landing card silakar mobile. */
  description: string;
  tone: KategoriTone;
  icon: KategoriIconName;
  flow: KategoriFlow;
}

export const KATEGORI_LIST: KategoriDef[] = [
  {
    slug: 'kebakaran',
    label: 'Kebakaran',
    description: 'Laporan pemadaman dan penanganan kebakaran',
    tone: 'orange',
    icon: 'flame',
    flow: 'damkar',
  },
  {
    slug: 'odnk',
    label: 'ODNK (Non-Kebakaran)',
    description: 'Laporan evakuasi, rescue, dan kejadian non-kebakaran',
    tone: 'teal',
    icon: 'shield',
    flow: 'structured',
  },
];

/** Bentuk record (slug → label) untuk kebutuhan lookup/iterasi. */
export const KATEGORI_LABEL: Record<string, string> = Object.fromEntries(
  KATEGORI_LIST.map((k) => [k.slug, k.label])
);

/** Definisi lengkap per slug; guard untuk slug tak dikenal. */
export const kategoriBySlug = (slug: string): KategoriDef =>
  KATEGORI_LIST.find((k) => k.slug === slug) ?? KATEGORI_LIST[0];

/** Nama tampilan kategori; slug kosong/tanpa kategori = Kebakaran. */
export const normalizeKategori = (k?: string | null): string => {
  if (!k) return 'kebakaran';
  const s = k.toLowerCase().trim();
  if (s === 'kebakaran' || s === 'damkar' || s.includes('kebakar')) return 'kebakaran';
  if (s === 'odnk' || s.includes('non-kebakar')) return 'odnk';
  return 'odnk';
};

export const kategoriLabel = (k?: string | null): string =>
  KATEGORI_LABEL[normalizeKategori(k)];

export interface PdfTemplateSettings {
  judul: string;
  tujuan: string;
  anggota: string;
  pukul: string;
  jabatan: string;
  nama: string;
  pangkat: string;
  nip: string;
}

export type PdfTemplateField = keyof PdfTemplateSettings;

export const categoryPdfSettingKey = (category: string, field: PdfTemplateField): string =>
  category === 'kebakaran' ? `pdf_${field}` : `pdf_${category}_${field}`;

export const getCategoryPdfSettings = (
  settings: Record<string, string | undefined>,
  category: string
): PdfTemplateSettings => {
  const isFire = category === 'kebakaran';
  const prefix = isFire ? 'pdf' : `pdf_${category}`;
  const defaults: PdfTemplateSettings = {
    judul: isFire
      ? 'LAPORAN KEGIATAN DAMKAR PONOROGO'
      : `LAPORAN KEGIATAN ${kategoriLabel(category).toUpperCase()} KABUPATEN PONOROGO`,
    tujuan: isFire ? 'Melaksanakan Pemadaman Kebakaran' : '',
    anggota: isFire ? 'Regu Damkar, Anggota Bidang Damkar, Satpol PP' : '',
    pukul: isFire ? '16.00 – 00.00 WIB' : '',
    jabatan: 'Kepala Bidang SDA dan Damkar',
    nama: 'Erry Setiyoso Birowo, SP',
    pangkat: 'Pembina',
    nip: '19751029 200212 1 008',
  };

  const valueFor = (field: PdfTemplateField): string => {
    const value = settings[`${prefix}_${field}`];
    const legacySignature = !isFire && ['jabatan', 'nama', 'pangkat', 'nip'].includes(field)
      ? settings[`pdf_${field}`]
      : undefined;
    return value || legacySignature || defaults[field];
  };

  return {
    judul: valueFor('judul'),
    tujuan: valueFor('tujuan'),
    anggota: valueFor('anggota'),
    pukul: valueFor('pukul'),
    jabatan: valueFor('jabatan'),
    nama: valueFor('nama'),
    pangkat: valueFor('pangkat'),
    nip: valueFor('nip'),
  };
};

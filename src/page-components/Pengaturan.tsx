import { Key, Save, UserPlus, Edit, Shield, ChevronDown, Eye, EyeOff, FileText, Heading, Hash, PenTool, CheckSquare, MessageCircle, Loader2, Trash2, CheckCircle, Users, UserCog, Lock, AlertTriangle, ExternalLink } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useApp, useAuth } from '../App';
import { apiGet, apiPost } from '../services/api';
import { esc } from '../utils/helpers';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { AlertModal } from '../components/common/AlertModal';
import { Modal } from '../components/common/Modal';
import { categoryPdfSettingKey, getCategoryPdfSettings, KATEGORI_LIST } from '../utils/kategori';

/* ── Tailwind class mappings ── */
const PANEL_BASE = 'max-w-full overflow-hidden rounded-2xl border-[1.5px] border-border bg-card shadow-[var(--sh)] transition-all hover:shadow-[var(--shl)] min-[769px]:overflow-x-auto max-md:landscape:overflow-x-auto';
const PHD = 'flex flex-wrap cursor-pointer items-center justify-between gap-2 border-b-[1.5px] border-border bg-gradient-to-br from-[rgba(27,59,111,.06)] to-transparent px-4 py-3';
const PHD_ROW = 'flex w-full items-center justify-between';
const TGICO = 'w-4 h-4 text-muted transition-transform duration-300';
const SET_CARD = 'rounded-[var(--r)] border border-border bg-bg p-[15px]';
const SET_CARD_P4 = 'rounded-[var(--r)] border border-border bg-bg p-4';
const SET_TTL = 'mb-3 text-[.75rem] font-extrabold uppercase';
const FLBL = 'mb-1 block text-[.62rem] font-extrabold uppercase tracking-[.07em] text-mid';
const FGRP = 'mb-2.5';
const FROW = 'mb-2.5 grid grid-cols-2 gap-2.5 portrait:max-md:grid-cols-1';
const FCOL = 'flex flex-col';
const FCTL_BASE = 'w-full border border-border bg-card px-3 py-[9px] text-[.82rem] text-text transition-all duration-200 outline-none focus:border-blue focus:shadow-[0_0_0_3px_var(--bluelo)]';
const FCTL = `${FCTL_BASE} rounded-md`;
const PW_WRAP = 'relative flex items-center';
const PW_FIELD = 'flex-1 pr-[38px]';
const PW_EYE = 'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent p-1 text-[.8rem] text-muted transition-colors duration-150 hover:text-text';
const REQ = 'ml-0.5 text-red';
const BP_BASE = 'gap-1.5 rounded-md text-white transition-all duration-200 hover:bg-blueh hover:-translate-y-px active:translate-y-0';
const BP = `inline-flex ${BP_BASE} bg-blue px-4 py-2 text-[.74rem] font-bold`;
const BG2_BASE = 'items-center gap-1.5 rounded-md border border-border bg-card text-mid transition-all duration-200 hover:-translate-y-px hover:border-bdark hover:bg-bg hover:text-text';
const BG2_CORE = `inline-flex ${BG2_BASE}`;
const BG2 = `${BG2_CORE} px-[15px] py-2 text-[.74rem] font-semibold`;
const BFOT = 'inline-flex items-center justify-center gap-[5px] rounded-md border border-[rgba(16,185,129,.12)] bg-greenl text-[.66rem] font-bold text-green transition-all hover:bg-green hover:text-white';
const BE = 'inline-flex items-center justify-center gap-[5px] rounded-md border border-[rgba(30,111,217,.12)] bg-bluelo text-[.66rem] font-bold text-blue transition-all hover:bg-blue hover:text-white';
const BD = 'inline-flex items-center justify-center gap-[5px] rounded-md border border-[rgba(239,68,68,.12)] bg-redl text-[.66rem] font-bold text-red transition-all hover:bg-red hover:text-white';
const ICON_BTN = 'h-7 w-7 p-0';
const AG_CARD = 'relative flex items-center justify-between gap-2.5 rounded-md border border-border bg-card p-3 shadow-[var(--sh)] transition-all duration-200 hover:-translate-y-0.5 hover:border-bdark hover:shadow-[var(--shl)]';
const AG_INFO = 'min-w-0 flex-1';
const AG_NAME = 'mb-0.5 truncate text-[.85rem] font-bold leading-[1.25]';
const AG_ACT = 'z-[2] static ml-3 flex gap-1.5';
const AG_META = 'mt-1.5 flex flex-wrap gap-1.5';
const DESC = 'text-[.72rem] leading-[1.55] text-muted';

// Permission modules
const PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Dashboard', desc: 'Lihat dashboard utama' },
  { key: 'rekap', label: 'Rekap Laporan', desc: 'Lihat rekap laporan' },
  { key: 'rekap_damkar', label: 'Rekap Kebakaran', desc: 'Lihat rekap laporan kebakaran' },
  { key: 'rekap_odnk', label: 'Rekap ODNK', desc: 'Lihat rekap laporan non-kebakaran' },
  { key: 'input', label: 'Input Laporan', desc: 'Input laporan manual' },
  { key: 'damkar', label: 'Data Personil Damkar', desc: 'Kelola data personil Damkar' },
  { key: 'peta', label: 'Peta Damkar', desc: 'Lihat peta DAMKAR' },
  { key: 'sampah', label: 'Sampah', desc: 'Kelola sampah laporan' },
  { key: 'pengaturan', label: 'Pengaturan', desc: 'Akses pengaturan sistem' },
];

interface UserAccount {
  username: string;
  role: 'admin' | 'user';
  namaLengkap: string;
  permissions: Record<string, boolean>;
  _ri: string;
}

export const Pengaturan: React.FC = () => {
  const { showLoad, hideLoad, triggerToast } = useApp();
  const { session } = useAuth();

  // Panels Accordion States
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    akun: false,
    pdfTunggal: false,
    peta: false,
    unit: false,
    whatsapp: false,
    users: false,
  });

  // Custom Alert and Confirm Modal States
  const [confirmShow, setConfirmShow] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const [alertShow, setAlertShow] = useState(false);
  const [alertMsg] = useState('');

  const askConfirm = (msg: string, action: () => void) => {
    setConfirmMsg(msg);
    setConfirmAction(() => action);
    setConfirmShow(true);
  };

  // Account form states
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // User management states
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [userModalShow, setUserModalShow] = useState(false);
  const [userFormMode, setUserFormMode] = useState<'add' | 'edit'>('add');
  const [userFormUsername, setUserFormUsername] = useState('');
  const [userFormFullName, setUserFormFullName] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState<'admin' | 'user'>('user');
  const [userFormPermissions, setUserFormPermissions] = useState<Record<string, boolean>>({});
  const [showUserPassword, setShowUserPassword] = useState(false);

  // PDF Single form states
  const [pdfJudul, setPdfJudul] = useState('');
  const [pdfTujuan, setPdfTujuan] = useState('');
  const [pdfAnggota, setPdfAnggota] = useState('');
  const [pdfPukul, setPdfPukul] = useState('');
  const [pdfJabatan, setPdfJabatan] = useState('');
  const [pdfNama, setPdfNama] = useState('');
  const [pdfPangkat, setPdfPangkat] = useState('');
  const [pdfNip, setPdfNip] = useState('');
  const [pdfSettingsCategory, setPdfSettingsCategory] = useState('kebakaran');
  const [pdfCategorySettings, setPdfCategorySettings] = useState<Record<string, string>>({});
  const [pdfSinglePreviewHtml, setPdfSinglePreviewHtml] = useState('');


  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('');

  // Timers for live previews debouncing
  const pdfPreviewTimer = useRef<any>(null);

  const applyPdfCategorySettings = (category: string, settings: Record<string, string | undefined>) => {
    const values = getCategoryPdfSettings(settings, category);
    setPdfJudul(values.judul);
    setPdfTujuan(values.tujuan);
    setPdfAnggota(values.anggota);
    setPdfPukul(values.pukul);
    setPdfJabatan(values.jabatan);
    setPdfNama(values.nama);
    setPdfPangkat(values.pangkat);
    setPdfNip(values.nip);
  };

  const handlePdfCategoryChange = (category: string) => {
    setPdfSettingsCategory(category);
    applyPdfCategorySettings(category, pdfCategorySettings);
  };

  // Accordion Toggle
  const togglePanel = (panelKey: string) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panelKey]: !prev[panelKey],
    }));
  };

  // Fetch users
  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
      const res = await apiGet('getAllUsers');
      if (res.success) {
        setUsers(res.data || []);
      } else {
        triggerToast('Gagal memuat users: ' + (res.message || ''), 'er');
      }
    } catch (e: any) {
      triggerToast('Error memuat users: ' + e.message, 'er');
    } finally {
      setIsFetchingUsers(false);
    }
  };

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiGet('getSettings');
        if (res.success) {
          const d = res.data || {};
          setPdfCategorySettings(d);
          applyPdfCategorySettings('kebakaran', d);
          setWhatsappGroupUrl(typeof d.whatsappGroupUrl === 'string' ? d.whatsappGroupUrl.trim() : '');

        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
    fetchUsers();
  }, []);

  // User Management Handlers
  const openAddUser = () => {
    setUserFormMode('add');
    setUserFormUsername('');
    setUserFormFullName('');
    setUserFormPassword('');
    setUserFormRole('user');
    setUserFormPermissions({});
    setUserModalShow(true);
  };

  const openEditUser = (user: UserAccount) => {
    setUserFormMode('edit');
    setUserFormUsername(user.username);
    setUserFormFullName(user.namaLengkap);
    setUserFormPassword('');
    setUserFormRole(user.role);
    setUserFormPermissions(user.permissions || {});
    setUserModalShow(true);
  };

  const handleSaveUser = async () => {
    if (!userFormUsername.trim() || !userFormFullName.trim()) {
      triggerToast('Username dan nama lengkap wajib diisi.', 'er');
      return;
    }
    if (userFormMode === 'add' && !userFormPassword.trim()) {
      triggerToast('Password wajib diisi untuk user baru.', 'er');
      return;
    }
    if (userFormPassword.trim() && userFormPassword.trim().length < 6) {
      triggerToast('Password minimal 6 karakter.', 'er');
      return;
    }

    showLoad(userFormMode === 'edit' ? 'Memperbarui user...' : 'Membuat user...');
    try {
      if (userFormMode === 'add') {
        const res = await apiPost('createAccount', {
          username: userFormUsername.trim(),
          role: userFormRole,
          namaLengkap: userFormFullName.trim(),
          password: userFormPassword,
          permissions: userFormRole === 'admin' ? {} : userFormPermissions,
        });
        hideLoad();
        if (res.success) {
          triggerToast(`User ${userFormUsername} berhasil dibuat.`, 'ok');
          setUserModalShow(false);
          fetchUsers();
        } else {
          triggerToast(res.message || 'Gagal membuat user.', 'er');
        }
      } else {
        const res = await apiPost('updateUser', {
          username: userFormUsername,
          role: userFormRole,
          namaLengkap: userFormFullName,
          permissions: userFormRole === 'admin' ? {} : userFormPermissions,
        });
        hideLoad();
        if (res.success) {
          triggerToast(`User ${userFormUsername} berhasil diperbarui.`, 'ok');
          setUserModalShow(false);
          fetchUsers();
        } else {
          triggerToast(res.message || 'Gagal memperbarui user.', 'er');
        }
      }
    } catch (e: any) {
      hideLoad();
      triggerToast('Error: ' + e.message, 'er');
    }
  };

  const handleDeleteUser = (username: string) => {
    if (username === session?.username) {
      triggerToast('Tidak dapat menghapus akun sendiri.', 'er');
      return;
    }
    askConfirm(`Hapus user "${username}"? Tindakan ini tidak dapat dibatalkan.`, async () => {
      showLoad('Menghapus user...');
      try {
        const res = await apiPost('deleteUser', { username });
        hideLoad();
        if (res.success) {
          triggerToast(`User ${username} berhasil dihapus.`, 'ok');
          fetchUsers();
        } else {
          triggerToast(res.message || 'Gagal menghapus user.', 'er');
        }
      } catch (e: any) {
        hideLoad();
        triggerToast('Error: ' + e.message, 'er');
      }
    });
  };

  const togglePermission = (key: string) => {
    setUserFormPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Update Single PDF Preview in background
  const loadSinglePdfPreview = async () => {
    try {
      const res = await apiPost('generateLaporanHtml', {
        judulUtama: pdfJudul,
        hari: 'Senin',
        tanggal: '1 Januari 2026',
        tujuan: pdfTujuan,
        nomorSpt: '',
        lokasi: 'Area Damkar Kota Ponorogo',
        anggota: pdfAnggota,
        pukul: pdfPukul,
        identitas: '',
        keterangan: 'Contoh uraian laporan untuk preview template dari menu pengaturan.',
        uraian: 'Contoh uraian laporan untuk preview template dari menu pengaturan.',
        tglSurat: '1 Januari 2026',
        jabatanTtd: pdfJabatan,
        namaTtd: pdfNama,
        pangkatTtd: pdfPangkat,
        nipTtd: pdfNip,
        kopAktif: false,
        fotos: [],
      });
      if (res.success) {
        setPdfSinglePreviewHtml(res.data?.html || res.html || '');
      }
    } catch (e) {
      console.error(e);
    }
  };


  // Debounced side-effects when form values edit
  useEffect(() => {
    if (!openPanels.pdfTunggal) return;
    clearTimeout(pdfPreviewTimer.current);
    pdfPreviewTimer.current = setTimeout(loadSinglePdfPreview, 1000);
    return () => clearTimeout(pdfPreviewTimer.current);
  }, [pdfJudul, pdfTujuan, pdfAnggota, pdfPukul, pdfJabatan, pdfNama, pdfPangkat, pdfNip, openPanels.pdfTunggal]);


  // Form Submissions
  const handleChangePassword = async () => {
    if (!oldPass || !newPass) {
      triggerToast('Password lama & baru wajib diisi.', 'er');
      return;
    }
    showLoad('Memperbarui...');
    try {
      const res = await apiPost('changePassword', {
        oldPass,
        newPass,
        username: session?.username || '',
      });
      hideLoad();
      if (res.success) {
        triggerToast('Password berhasil diganti.', 'ok');
        setOldPass('');
        setNewPass('');
      } else {
        triggerToast(res.message || 'Gagal mengubah password.', 'er');
      }
    } catch (e: any) {
      hideLoad();
      triggerToast(e.message || 'Error', 'er');
    }
  };

  const handleSavePdfSingleSettings = async () => {
    showLoad('Menyimpan...');
    try {
      const values = {
        judul: pdfJudul,
        tujuan: pdfTujuan,
        anggota: pdfAnggota,
        pukul: pdfPukul,
        jabatan: pdfJabatan,
        nama: pdfNama,
        pangkat: pdfPangkat,
        nip: pdfNip,
      };
      const savedValues = Object.fromEntries(
        Object.entries(values).map(([field, value]) => [
          categoryPdfSettingKey(pdfSettingsCategory, field as keyof typeof values),
          value,
        ])
      );
      const res = await apiPost('saveSettings', {
        ...savedValues,
        ...(pdfSettingsCategory === 'kebakaran' ? { pdf_kop_aktif: 'false' } : {}),
      });
      hideLoad();
      if (res.success) {
        setPdfCategorySettings((previous) => ({ ...previous, ...savedValues }));
        triggerToast(`Pengaturan PDF ${KATEGORI_LIST.find((item) => item.slug === pdfSettingsCategory)?.label || 'kategori'} disimpan.`, 'ok');
      } else {
        triggerToast(res.message || 'Gagal menyimpan.', 'er');
      }
    } catch (e: any) {
      hideLoad();
      triggerToast(e.message || 'Error', 'er');
    }
  };



  const handleSaveWhatsAppGroupUrl = async () => {
    if (!whatsappGroupUrl.trim()) {
      triggerToast('Link grup WhatsApp wajib diisi atau kosongkan untuk menonaktifkan.', 'er');
      return;
    }
    showLoad('Menyimpan...');
    try {
      const res = await apiPost('saveSettings', { whatsappGroupUrl: whatsappGroupUrl.trim() });
      hideLoad();
      if (res.success) {
        triggerToast('Pengaturan grup WhatsApp DAMKAR berhasil disimpan.', 'ok');
      } else {
        triggerToast(res.message || 'Gagal menyimpan.', 'er');
      }
    } catch (e: any) {
      hideLoad();
      triggerToast(e.message || 'Error', 'er');
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* 1. USER MANAGEMENT PANEL */}
      <div className={`${PANEL_BASE} mb-4`}>
        <div className={PHD} onClick={() => togglePanel('users')}>
          <div className={PHD_ROW}>
            <span className="flex items-center gap-2">
              <UserCog className="w-4 h-4 text-purple" /> Manajemen Pengguna
            </span>
            <ChevronDown
              className={`${TGICO} ${openPanels.users ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
        </div>
        <div className={`p-4 ${openPanels.users ? 'block' : 'hidden'}`}>
          <div className={SET_CARD}>
            <div className="mb-3.5 flex items-center justify-between">
              <p className={DESC}>
                Kelola akun pengguna dengan role-based access control (RBAC). Admin memiliki akses penuh, user dapat diatur per-menunya.
              </p>
            </div>

            {/* User List */}
            {isFetchingUsers ? (
              <div className="flex items-center justify-center gap-2 p-5 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" /> Memuat users...
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
                {users.map((user) => (
                  <div key={user.username} className={AG_CARD}>
                    <div className={AG_INFO}>
                      <div className={`${AG_NAME} text-text`}>
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-amber">
                            <Shield className="w-3.5 h-3.5" /> {esc(user.namaLengkap || user.username)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue">
                            <Users className="w-3.5 h-3.5" /> {esc(user.namaLengkap || user.username)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-[.68rem] text-muted">
                        @{esc(user.username)}
                      </div>
                      <div className={AG_META}>
                        <span className={`inline-block rounded-[20px] px-[7px] py-0.5 text-[.58rem] font-extrabold uppercase tracking-[.04em] ${user.role === 'admin' ? 'bg-amberl text-amber' : 'bg-bluelo text-blue'}`}>
                          {user.role}
                        </span>
                        {user.role === 'user' && (
                          <span className="inline-block rounded-[20px] bg-bg px-[7px] py-0.5 text-[.58rem] font-extrabold text-muted">
                            {Object.values(user.permissions || {}).filter(Boolean).length} menu
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={AG_ACT}>
                      <button
                        className={`${BE} ${ICON_BTN}`}
                        onClick={() => openEditUser(user)}
                        title="Edit User"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {user.username !== session?.username && (
                        <button
                          className={`${BD} ${ICON_BTN}`}
                          onClick={() => handleDeleteUser(user.username)}
                          title="Hapus User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add User Button */}
            <button
              className={`mt-3 inline-flex ${BP_BASE} w-full bg-purple px-4 py-2 text-[.74rem] font-bold`}
              onClick={openAddUser}
            >
              <UserPlus className="w-4 h-4 inline-block align-middle" /> Tambah Pengguna Baru
            </button>
          </div>
        </div>
      </div>

      {/* 2. AKUN SECTION PANEL */}
      <div className={`${PANEL_BASE} mb-4`}>
        <div className={PHD} onClick={() => togglePanel('akun')}>
          <div className={PHD_ROW}>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Ganti Password
            </span>
            <ChevronDown
              className={`${TGICO} ${openPanels.akun ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
        </div>
        <div className={`p-4 ${openPanels.akun ? 'block' : 'hidden'}`}>
          <div className={SET_CARD}>
            <p className={`${SET_TTL} text-blue`}>
              <Key className="w-4 h-4 inline-block align-middle" /> Ganti Password
            </p>
            <div className={FGRP}>
              <label className={FLBL}>Password Lama</label>
              <div className={PW_WRAP}>
                <input
                  type={showOldPass ? 'text' : 'password'}
                  className={`${FCTL} ${PW_FIELD}`}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                />
                <button
                  type="button"
                  className={PW_EYE}
                  onClick={() => setShowOldPass(!showOldPass)}
                >
                  {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className={FGRP}>
              <label className={FLBL}>Password Baru</label>
              <div className={PW_WRAP}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  className={`${FCTL} ${PW_FIELD}`}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                  type="button"
                  className={PW_EYE}
                  onClick={() => setShowNewPass(!showNewPass)}
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button className={`${BP} w-full`} onClick={handleChangePassword}>
              <Save className="w-4 h-4 inline-block align-middle" /> Perbarui Password
            </button>
          </div>
        </div>
      </div>

      {/* 3. TEMPLATE CETAK PDF LAPORAN TUNGGAL */}
      <div className={`${PANEL_BASE} mb-4`}>
        <div className={PHD} onClick={() => togglePanel('pdfTunggal')}>
          <div className={PHD_ROW}>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-red" /> Template Cetak PDF Laporan Tunggal
            </span>
            <ChevronDown
              className={`${TGICO} ${openPanels.pdfTunggal ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
        </div>
        <div className={`p-4 flex-col gap-4 ${openPanels.pdfTunggal ? 'flex' : 'hidden'}`}>
          <div className={SET_CARD_P4}>
            <label className={FLBL} htmlFor="pdf-category-settings">Kategori laporan</label>
            <select
              id="pdf-category-settings"
              className={FCTL}
              value={pdfSettingsCategory}
              onChange={(event) => handlePdfCategoryChange(event.target.value)}
            >
              {KATEGORI_LIST.map((category) => (
                <option key={category.slug} value={category.slug}>{category.label}</option>
              ))}
            </select>
          </div>
          <div className={SET_CARD_P4}>
            <p className="mb-1.5 text-[.65rem] font-bold text-blue">
              <Heading className="w-4 h-4 inline-block align-middle mr-1" /> Header Laporan
            </p>
            <div className={FGRP}>
              <label className={FLBL}>Judul Utama (Header Laporan)</label>
              <input
                className={FCTL}
                value={pdfJudul}
                onChange={(e) => setPdfJudul(e.target.value)}
              />
            </div>
          </div>
          
          <div className={SET_CARD_P4}>
            <p className="mb-2 text-[.65rem] font-bold text-blue">
              <Hash className="w-4 h-4 inline-block align-middle mr-1" /> Nomor &amp; Isi Standar
            </p>
            <div className={FGRP}>
              <label className={FLBL}>Tujuan Kegiatan</label>
              <input
                className={FCTL}
                value={pdfTujuan}
                onChange={(e) => setPdfTujuan(e.target.value)}
              />
            </div>
            <div className={FROW}>
              <div className={FCOL}>
                <label className={FLBL}>Anggota</label>
                <input
                  className={FCTL}
                  value={pdfAnggota}
                  onChange={(e) => setPdfAnggota(e.target.value)}
                />
              </div>
              <div className={FCOL}>
                <label className={FLBL}>Pukul</label>
                <input
                  className={FCTL}
                  value={pdfPukul}
                  onChange={(e) => setPdfPukul(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={SET_CARD_P4}>
            <p className="mb-2 text-[.65rem] font-bold text-gold">
              <PenTool className="w-4 h-4 inline-block align-middle mr-1" /> Data Pejabat Penandatangan (TTD)
            </p>
            <div className={FROW}>
              <div className={FCOL}>
                <label className={FLBL}>Jabatan TTD</label>
                <input
                  className={FCTL}
                  value={pdfJabatan}
                  onChange={(e) => setPdfJabatan(e.target.value)}
                />
              </div>
              <div className={FCOL}>
                <label className={FLBL}>Nama Pejabat</label>
                <input
                  className={FCTL}
                  value={pdfNama}
                  onChange={(e) => setPdfNama(e.target.value)}
                />
              </div>
            </div>
            <div className={FROW}>
              <div className={FCOL}>
                <label className={FLBL}>Pangkat / Golongan</label>
                <input
                  className={FCTL}
                  value={pdfPangkat}
                  onChange={(e) => setPdfPangkat(e.target.value)}
                />
              </div>
              <div className={FCOL}>
                <label className={FLBL}>NIP</label>
                <input
                  className={FCTL}
                  value={pdfNip}
                  onChange={(e) => setPdfNip(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button className={`${BP} w-full`} onClick={handleSavePdfSingleSettings}>
            <CheckSquare className="w-4 h-4 inline-block align-middle mr-1.5" /> Simpan Pengaturan PDF Tunggal
          </button>
          
          <div className="rounded-[var(--r)] overflow-hidden border border-border bg-bg p-0">
            <div className="border-b border-border bg-card px-2.5 py-[7px] text-[.65rem] font-bold text-mid">
              Preview Template Single PDF
            </div>
            <iframe
              id="set-pdf-preview-frame"
              srcDoc={pdfSinglePreviewHtml}
              className="block h-[380px] w-full border-none"
            ></iframe>
          </div>
        </div>
      </div>

      {/* 6. WHATSAPP GROUP INTEGRATION PANEL */}
      <div className={`${PANEL_BASE} mb-4`}>
        <div className={PHD} onClick={() => togglePanel('whatsapp')}>
          <div className={PHD_ROW}>
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green" /> Integrasi Grup WhatsApp
            </span>
            <ChevronDown className={`${TGICO} ${openPanels.whatsapp ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </div>
        <div className={`p-4 ${openPanels.whatsapp ? 'block' : 'hidden'}`}>
          <div className={SET_CARD}>
            <div className="mb-3.5 flex items-center justify-between">
              <p className={DESC}>
                Atur link grup WhatsApp DAMKAR. Setelah laporan berhasil tersimpan, SILAKAR dapat menampilkan format lengkap laporan beserta album dokumentasi untuk diteruskan ke grup.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[.72rem] font-extrabold uppercase tracking-[.07em] text-mid">Link Grup WhatsApp</label>
              <input
                className={`${FCTL} w-full`}
                placeholder="https://chat.whatsapp.com/xxxxxxxxxx"
                value={whatsappGroupUrl}
                onChange={(e) => setWhatsappGroupUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <button className={BP} onClick={handleSaveWhatsAppGroupUrl}>
                  <Save className="w-4 h-4 inline-block align-middle" /> Simpan
                </button>
                {whatsappGroupUrl ? (
                  <a
                    className={BG2}
                    href={whatsappGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 inline-block align-middle" /> Buka
                  </a>
                ) : null}
              </div>
              <p className={DESC}>
                Pengiriman laporan ke grup menggunakan metode manual via WhatsApp. Sistem tetap berfungsi gratis tanpa API berbayar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={confirmShow}
        title="Konfirmasi Tindakan"
        msg={confirmMsg}
        onConfirm={() => {
          setConfirmShow(false);
          if (confirmAction) confirmAction();
        }}
        onCancel={() => setConfirmShow(false)}
        confirmText="Lanjutkan"
        confirmVariant="primary"
        confirmIcon={<CheckCircle className="w-4 h-4" />}
      />

      {/* Alert Modal */}
      <AlertModal
        show={alertShow}
        title="Hasil Tindakan"
        msg={alertMsg}
        onClose={() => setAlertShow(false)}
      />

      {/* User Add/Edit Modal */}
      <Modal
        show={userModalShow}
        onClose={() => setUserModalShow(false)}
        size="md"
        title={
          <span className="flex items-center gap-[7px] text-purple">
            <UserCog className="w-4 h-4 inline-block align-middle" />
            {userFormMode === 'edit' ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </span>
        }
        footer={
          <>
            <button className={BG2} onClick={() => setUserModalShow(false)}>
              Batal
            </button>
            <button className={BP} onClick={handleSaveUser}>
              <Save className="w-4 h-4 inline-block align-middle" /> Simpan
            </button>
          </>
        }
      >
        <div className={FGRP}>
          <label className={FLBL}>
            Username <span className={REQ}>*</span>
          </label>
          <input
            className={`${FCTL_BASE} rounded-[10px]`}
            placeholder="Masukkan username"
            value={userFormUsername}
            onChange={(e) => setUserFormUsername(e.target.value)}
            disabled={userFormMode === 'edit'}
            autoFocus
          />
        </div>
        <div className={FGRP}>
          <label className={FLBL}>
            Nama Lengkap <span className={REQ}>*</span>
          </label>
          <input
            className={`${FCTL_BASE} rounded-[10px]`}
            placeholder="Masukkan nama lengkap"
            value={userFormFullName}
            onChange={(e) => setUserFormFullName(e.target.value)}
          />
        </div>
        <div className={FGRP}>
          <label className={FLBL}>
            {userFormMode === 'edit' ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'} <span className={REQ}>*</span>
          </label>
          <div className={PW_WRAP}>
            <input
              type={showUserPassword ? 'text' : 'password'}
              className={`${FCTL_BASE} rounded-[10px] ${PW_FIELD}`}
              placeholder="Masukkan password"
              value={userFormPassword}
              onChange={(e) => setUserFormPassword(e.target.value)}
            />
            <button
              type="button"
              className={PW_EYE}
              onClick={() => setShowUserPassword(!showUserPassword)}
            >
              {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className={FGRP}>
          <label className={FLBL}>
            Role <span className={REQ}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-[10px] border-2 px-3 py-2.5 text-[.74rem] font-bold transition-all ${
                userFormRole === 'admin'
                  ? 'border-amber bg-amberl text-amber'
                  : 'border-border bg-card text-muted hover:border-amber/50'
              }`}
              onClick={() => setUserFormRole('admin')}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-[10px] border-2 px-3 py-2.5 text-[.74rem] font-bold transition-all ${
                userFormRole === 'user'
                  ? 'border-blue bg-bluelo text-blue'
                  : 'border-border bg-card text-muted hover:border-blue/50'
              }`}
              onClick={() => setUserFormRole('user')}
            >
              <Users className="w-4 h-4" /> User
            </button>
          </div>
        </div>

        {/* Permissions - only for user role */}
        {userFormRole === 'user' && (
          <div className={FGRP}>
            <label className={FLBL}>
              <Lock className="w-3.5 h-3.5 inline-block align-middle mr-1" /> Hak Akses Menu
            </label>
            <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto rounded-[10px] border border-border bg-card p-2">
              {PERMISSION_MODULES.map((mod) => (
                <label
                  key={mod.key}
                  className="flex cursor-pointer items-center justify-between rounded-[8px] px-2.5 py-2 transition-colors hover:bg-bg"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={userFormPermissions[mod.key] || false}
                      onChange={() => togglePermission(mod.key)}
                      className="h-4 w-4 rounded border-border text-blue focus:ring-blue"
                    />
                    <div>
                      <div className="text-[.74rem] font-semibold text-text">{mod.label}</div>
                      <div className="text-[.62rem] text-muted">{mod.desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {userFormRole === 'admin' && (
          <div className="rounded-[10px] border border-amber/30 bg-amberl/50 p-3 text-[.72rem] text-amber">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Admin</strong> memiliki akses penuh ke semua menu dan fitur sistem. Tidak perlu konfigurasi tambahan.
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* WA Piket Add/Edit Modal */}

  
    </div>
  );
};
export default Pengaturan;

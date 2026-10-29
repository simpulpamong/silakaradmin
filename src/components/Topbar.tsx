import { Menu, RefreshCw, Sun, Moon } from 'lucide-react';
import React, { useState } from 'react';
import { useApp, useAuth, useTheme } from '../App';
import { cn } from '../utils/helpers';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const { activeTab, triggerRefresh, triggerToast } = useApp();
  const { session } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    triggerToast('Memuat ulang data...', 'inf');
    triggerRefresh();
    setTimeout(() => {
      setIsSpinning(false);
    }, 600);
  };

  const getPageMeta = () => {
    switch (activeTab) {
      case 'db':
        return { title: 'Dashboard', subtitle: 'Statistik & grafik data patroli' };
      case 'rk':
      case 'damkar':
      case 'kebakaran':
        return { title: 'Rekap Kebakaran', subtitle: 'Laporan penanganan kejadian kebakaran' };
      case 'odnk':
        return { title: 'Rekap ODNK', subtitle: 'Laporan kejadian non-kebakaran' };
      case 'in':
        return { title: 'Input Laporan', subtitle: 'Form Input Laporan Admin' };
      case 'sl':
        return { title: 'Data PersonilDamkar', subtitle: 'Daftar anggota' };
      case 'pt':
        return { title: 'Peta Damkar', subtitle: 'Peta sebaran kegiatan Damkar Ponorogo' };
      case 'set':
        return { title: 'Pengaturan Sistem', subtitle: 'Kelola akun, template cetak & konfigurasi' };
      default:
        return { title: 'Dashboard', subtitle: 'Statistik & grafik data patroli' };
    }
  };

  const { title, subtitle } = getPageMeta();

  const initials = session
    ? (session.namaLengkap || session.username || '?').charAt(0).toUpperCase()
    : '?';

  return (
    <div className="topb sticky top-0 z-[100] flex min-h-16 items-center justify-between gap-3 overflow-hidden border-b border-[var(--border)] bg-[var(--glass-bg)] px-6 py-3 shadow-[0_1px_3px_rgba(15,23,42,.06)] max-md:min-h-14 max-md:gap-2 max-md:px-3 max-md:py-2 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <button
          className="hidden min-h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card p-2 text-mid shadow-[var(--sh0)] transition-all hover:border-blue hover:bg-bluelo hover:text-blue max-md:flex"
          onClick={onToggleMobileSidebar}
          aria-label="Buka menu navigasi"
          aria-controls="sidebar"
        >
          <Menu className="inline-block h-4 w-4 align-middle" />
        </button>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div id="pgtl" className="truncate text-[1rem] font-extrabold leading-tight text-text font-display portrait:max-md:text-[.9rem]">
            {title}
          </div>
          <div id="pgsb" className="mt-px truncate text-[.58rem] leading-[1.3] text-muted portrait:max-md:text-[.55rem]">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          id="refresh-btn"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-mid shadow-[var(--sh0)] transition-all duration-200 hover:-translate-y-px hover:border-blue hover:text-blue hover:shadow-[0_4px_12px_rgba(99,102,241,.15)] active:translate-y-0"
          onClick={handleRefresh}
          title="Refresh Data"
        >
          <RefreshCw className={cn('inline-block h-4 w-4 align-middle', isSpinning && 'animate-spin-custom')} />
        </button>
        <button
          id="dm-btn"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-mid shadow-[var(--sh0)] transition-all duration-200 hover:-translate-y-px hover:border-blue hover:text-blue hover:shadow-[0_4px_12px_rgba(99,102,241,.15)] active:translate-y-0"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDarkMode ? <Sun className="inline-block h-4 w-4 align-middle" /> : <Moon className="inline-block h-4 w-4 align-middle" />}
        </button>
        {session && (
          <div
            id="tb-acct"
            className="flex cursor-default items-center gap-[7px] rounded-[22px] border border-border bg-card px-2.5 py-[5px] shadow-[var(--sh0)] transition-all hover:border-bdark hover:shadow-[var(--sh)] portrait:max-md:hidden min-[769px]:max-[1024px]:gap-1 min-[769px]:max-[1024px]:px-1.5"
          >
            <div id="tb-av" className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue to-blue2 text-[.68rem] font-extrabold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <div id="tb-un" className="max-w-[100px] truncate text-[.7rem] font-bold text-text min-[769px]:max-[1024px]:max-w-[70px]">
                {session.namaLengkap || session.username}
              </div>
              <div id="tb-rl" className="text-[.54rem] text-muted min-[769px]:max-[1024px]:hidden">
                Administrator
              </div>
            </div>
            <span id="tb-bdg" className="rounded-[20px] bg-[rgba(201,149,15,.14)] px-[7px] py-0.5 text-[.5rem] font-extrabold uppercase tracking-[.05em] text-[#b8820c] min-[769px]:max-[1024px]:hidden">
              Admin
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Utility for persisting, exporting, importing, and resetting workspace data in localStorage
 */

export interface WorkspaceBackupData {
  version: number;
  exportedAt: string;
  activeBranch?: string;
  picChecklist?: Record<string, boolean>;
  kolCustomData?: any;
  venueCustomData?: any;
  sponsorLeadsStatus?: any;
  customNotes?: Record<string, string>;
}

const STORAGE_KEYS = {
  BRANCH: 'isy_active_branch',
  AUTH: 'isy_workspace_auth',
  PIC_CHECKLIST: 'isy_pic_checklist',
  KOL_DATA: 'isy_kol_custom_data',
  VENUE_DATA: 'isy_venue_custom_data',
  SPONSOR_DATA: 'isy_sponsor_leads_status',
  NOTES: 'isy_workspace_notes',
};

export function exportWorkspaceBackup(): void {
  try {
    const backup: WorkspaceBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      activeBranch: localStorage.getItem(STORAGE_KEYS.BRANCH) || 'all',
      picChecklist: JSON.parse(localStorage.getItem(STORAGE_KEYS.PIC_CHECKLIST) || '{}'),
      kolCustomData: JSON.parse(localStorage.getItem(STORAGE_KEYS.KOL_DATA) || '[]'),
      venueCustomData: JSON.parse(localStorage.getItem(STORAGE_KEYS.VENUE_DATA) || '[]'),
      sponsorLeadsStatus: JSON.parse(localStorage.getItem(STORAGE_KEYS.SPONSOR_DATA) || '{}'),
      customNotes: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}'),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `optik-iseeyou-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export workspace backup:', err);
    alert('Gagal mengekspor data cadangan.');
  }
}

export function importWorkspaceBackup(file: File, onSuccess: () => void, onError: (msg: string) => void): void {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const data = JSON.parse(content) as WorkspaceBackupData;
      if (!data || typeof data !== 'object') {
        throw new Error('Format file tidak valid.');
      }

      if (data.activeBranch) localStorage.setItem(STORAGE_KEYS.BRANCH, data.activeBranch);
      if (data.picChecklist) localStorage.setItem(STORAGE_KEYS.PIC_CHECKLIST, JSON.stringify(data.picChecklist));
      if (data.kolCustomData) localStorage.setItem(STORAGE_KEYS.KOL_DATA, JSON.stringify(data.kolCustomData));
      if (data.venueCustomData) localStorage.setItem(STORAGE_KEYS.VENUE_DATA, JSON.stringify(data.venueCustomData));
      if (data.sponsorLeadsStatus) localStorage.setItem(STORAGE_KEYS.SPONSOR_DATA, JSON.stringify(data.sponsorLeadsStatus));
      if (data.customNotes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.customNotes));

      onSuccess();
    } catch (err: any) {
      console.error('Error importing backup:', err);
      onError(err.message || 'File JSON rusak atau tidak sesuai.');
    }
  };
  reader.readAsText(file);
}

export function resetWorkspaceData(onComplete: () => void): void {
  if (confirm('Apakah Anda yakin ingin mengatur ulang data kustom ke setelan awal pabrik?')) {
    try {
      localStorage.removeItem(STORAGE_KEYS.PIC_CHECKLIST);
      localStorage.removeItem(STORAGE_KEYS.KOL_DATA);
      localStorage.removeItem(STORAGE_KEYS.VENUE_DATA);
      localStorage.removeItem(STORAGE_KEYS.SPONSOR_DATA);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      onComplete();
    } catch {
      // ignore
    }
  }
}

const STORAGE_SETTINGS_KEY = "hawkins-control:audio";

export type AudioSettings = {
  schemaVersion: 1;
  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number;
};

export function readAudioSettings(): AudioSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1) return null;
    return {
      schemaVersion: 1,
      musicOn: !!parsed.musicOn,
      sfxOn: !!parsed.sfxOn,
      musicVolume:
        typeof parsed.musicVolume === "number" ? parsed.musicVolume : 0.12,
    };
  } catch {
    return null;
  }
}

export function writeAudioSettings(settings: AudioSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

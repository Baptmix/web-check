import { sections, type Setting } from '@/data/settings';

type Value = Setting['default'];

// What each setting falls back to, with the OS having a say for some
export const defaults: Record<string, Value> = Object.fromEntries(
  sections
    .flatMap(({ settings }) => settings)
    .filter((setting) => 'default' in setting)
    .map(({ key, default: value, media }) => [key, media ? matchMedia(media).matches : value]),
);

export const isSetting = (key: string) => Object.hasOwn(defaults, key);

export const getSetting = (key: string): Value => {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? defaults[key] : JSON.parse(saved);
  } catch {
    return defaults[key];
  }
};

export const setSetting = (key: string, value: Value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const clearAllData = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
  location.reload();
};

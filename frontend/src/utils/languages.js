export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', claudeName: 'English' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪', claudeName: 'Georgian' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', claudeName: 'Italian' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', claudeName: 'Spanish' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', claudeName: 'French' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', claudeName: 'German' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', claudeName: 'Portuguese' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', claudeName: 'Russian' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', claudeName: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', claudeName: 'Japanese' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', claudeName: 'Korean' },
];

export function getLanguageName(code) {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? `${lang.flag} ${lang.native}` : '🇬🇧 English';
}

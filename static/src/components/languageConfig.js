const languageConfig = {
    en: {
      code: 'en',
      name: 'English',
      claudeCode: 'English',
      active: true
    },
    ka: {
      code: 'ka',
      name: 'ქართული',
      claudeCode: 'Georgian',
      active: true
    },
    es: {
      code: 'es',
      name: 'Español',
      claudeCode: 'Spanish',
      active: true
    },
    fr: {
      code: 'fr',
      name: 'Français',
      claudeCode: 'French',
      active: true
    },
    de: {
      code: 'de',
      name: 'Deutsch',
      claudeCode: 'German',
      active: true
    },
    ru: {
      code: 'ru',
      name: 'Русский',
      claudeCode: 'Russian',
      active: true
    },
    zh: {
      code: 'zh',
      name: '中文',
      claudeCode: 'Chinese (Simplified)',
      active: true
    },
    ja: {
      code: 'ja',
      name: '日本語',
      claudeCode: 'Japanese',
      active: true
    },
    ko: {
      code: 'ko',
      name: '한국어',
      claudeCode: 'Korean',
      active: true
    }
  };
  
  // Helper function to get full language name for Claude
  const getLanguageForClaude = (isoCode) => {
    const language = languageConfig[isoCode];
    return language ? language.claudeCode : 'English';
  };
  
  // Helper function to get available languages for dropdown
  const getAvailableLanguages = () => {
    return Object.entries(languageConfig)
      .filter(([_, lang]) => lang.active)
      .map(([code, lang]) => ({
        code,
        name: lang.name
      }));
  };
  
  // Helper to validate if a language code is supported
  const isSupportedLanguage = (code) => {
    return languageConfig.hasOwnProperty(code) && languageConfig[code].active;
  };
  
  // Export for global use
  window.languageConfig = languageConfig;
  window.getLanguageForClaude = getLanguageForClaude;
  window.getAvailableLanguages = getAvailableLanguages;
  window.isSupportedLanguage = isSupportedLanguage;
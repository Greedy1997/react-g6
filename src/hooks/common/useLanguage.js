import { useState } from 'react';
import { zh_CN, en_US } from '@/locales/index.js';

export function useLanguage(lang) {
    let [language] = useState(lang);
    let locale;
    let messages;

    if (language === 'zh') {
        locale = 'zh';
        messages = zh_CN;
    } else if (language === 'en') {
        locale = 'en';
        messages = en_US;
    }

    return [locale, messages];
}

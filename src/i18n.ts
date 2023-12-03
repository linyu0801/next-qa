// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

import { getRequestConfig } from "next-intl/server";

// import { getRequestConfig } from "next-intl/server";

// import translationEN from '../locales/en/translation.json';
// import translationZH from '../locales/zh/translation.json';

// const resources = {
//   en: {
//     translation: translationEN,
//   },
//   zh: {
//     translation: translationZH,
//   },
// };

// i18n.use(initReactI18next).init({
//   resources,
//   lng: 'zh',
//   fallbackLng: 'en',
// });

export default getRequestConfig(async ({ locale }) => ({

  messages: (await import(`../messages/${locale}.json`)).default,
}));

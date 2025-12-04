import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./ko";
import en from "./en";

i18n.use(initReactI18next).init({
  resources: {
    ko,
    en,
  },
  lng: "ko", // 기본 언어
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

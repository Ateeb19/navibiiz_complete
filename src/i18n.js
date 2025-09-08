import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector) // detects user language
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: {
                    welcome: "Welcome to my app",
                    home: "Home",
                    about_us: "About Us",
                },
            },
            fr: {
                translation: {
                    welcome: "Bienvenue sur mon application",
                    home: "Accueil",
                    about_us: "À propos de nous",
                },
            },
        },
        fallbackLng: "en", // default language
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

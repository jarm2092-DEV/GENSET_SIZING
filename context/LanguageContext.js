'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const translations = { en, es };

const LanguageContext = createContext();

/**
 * LanguageProvider: Provee el sistema de internacionalización (i18n) a toda la app.
 * Maneja el idioma activo (EN/ES), persiste la elección en localStorage
 * y expone un hook useLanguage() para acceder a las traducciones.
 */
export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en');

    // Recuperar idioma guardado en localStorage al montar el componente
    useEffect(() => {
        const saved = localStorage.getItem('mygens-lang');
        if (saved && translations[saved]) {
            setLang(saved);
        }
    }, []);

    // Alternar entre inglés y español, guardando en localStorage
    const toggleLanguage = useCallback(() => {
        setLang(prev => {
            const next = prev === 'en' ? 'es' : 'en';
            localStorage.setItem('mygens-lang', next);
            return next;
        });
    }, []);

    // Función para obtener una traducción por clave anidada (ej: "nav.brand")
    const t = useCallback((key) => {
        const keys = key.split('.');
        let result = translations[lang];
        for (const k of keys) {
            result = result?.[k];
        }
        return result || key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * useLanguage: Hook para acceder al idioma activo,
 * la función de cambio de idioma y las traducciones.
 */
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

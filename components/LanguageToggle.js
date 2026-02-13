'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './LanguageToggle.module.css';

/**
 * LanguageToggle: Botón para alternar entre inglés y español.
 * Muestra la bandera del idioma contrario al actual.
 */
export default function LanguageToggle() {
    const { lang, toggleLanguage } = useLanguage();

    return (
        <div className={styles.container}>
            <span className={`${styles.code} ${lang === 'en' ? styles.active : ''}`}>
                EN
            </span>

            <button
                className={styles.switch}
                onClick={toggleLanguage}
                aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
                <div className={`${styles.track} ${lang === 'en' ? styles.en : styles.es}`}>
                    <div className={styles.knob} />
                </div>
            </button>

            <span className={`${styles.code} ${lang === 'es' ? styles.active : ''}`}>
                ES
            </span>
        </div>
    );
}

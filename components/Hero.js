'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

/**
 * Hero: Sección principal de la homepage con pregunta central,
 * dos cards CTA (Start Sizing / Contact Support) y fondo con efecto glow.
 */
export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            {/* Fondo con efecto de brillo azul */}
            <div className={styles.bgGlow} aria-hidden="true" />
            <div className={styles.bgGrid} aria-hidden="true" />

            <div className={`container ${styles.content}`}>
                <h1 className={styles.title}>{t('hero.question')}</h1>
                <p className={styles.subtitle}>{t('hero.subtitle')}</p>

                <div className={styles.cards}>
                    {/* Card: No tengo generador → Sizing Tool */}
                    <Link href="/sizing-tool" className={`glow-card ${styles.card}`}>
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="14" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 14V10a4 4 0 014-4h8a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2" />
                                <path d="M24 22v8M20 26h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className={styles.cardTitle}>{t('hero.noGenerator')}</h2>
                        <p className={styles.cardDesc}>{t('hero.noGeneratorDesc')}</p>
                        <span className={`btn btn-primary ${styles.cardBtn}`}>
                            {t('hero.startSizing')}
                        </span>
                    </Link>

                    {/* Card: Ya tengo generador → Support */}
                    <Link href="/support" className={`glow-card ${styles.card}`}>
                        <div className={styles.cardIcon}>
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
                                <path d="M18 20a6 6 0 0110.58 3.85C28.58 26 26 27 26 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="26" cy="34" r="1.5" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className={styles.cardTitle}>{t('hero.hasGenerator')}</h2>
                        <p className={styles.cardDesc}>{t('hero.hasGeneratorDesc')}</p>
                        <span className={`btn btn-secondary ${styles.cardBtn}`}>
                            {t('hero.contactSupport')}
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

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
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="48" fill="var(--color-accent-blue)" />
                                <rect x="22" y="38" width="56" height="28" rx="2" fill="white" />
                                <rect x="32" y="34" width="36" height="4" rx="1" fill="white" />
                                <rect x="28" y="66" width="6" height="3" fill="white" />
                                <rect x="66" y="66" width="6" height="3" fill="white" />
                                <rect x="26" y="42" width="24" height="20" rx="1" fill="var(--color-accent-blue)" />
                                <path d="M41 45 L35 53 H39 L37 60 L43 52 H39 L41 45 Z" fill="white" />
                                <circle cx="56" cy="44.5" r="2.5" fill="var(--color-accent-blue)" />
                                <circle cx="63" cy="44.5" r="2.5" fill="var(--color-accent-blue)" />
                                <circle cx="70" cy="44.5" r="2.5" fill="var(--color-accent-blue)" />
                                <rect x="56" y="50" width="18" height="3.5" rx="1.75" fill="var(--color-accent-blue)" />
                                <rect x="56" y="57" width="18" height="3.5" rx="1.75" fill="var(--color-accent-blue)" />
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
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="48" fill="var(--color-accent-blue)" />
                                <path fill="white" d="M30.7,35.2c0-2.8,0.9-5.6,2.7-8.5c1.8-2.9,4.4-5.3,7.9-7.1 c3.5-1.9,7.5-2.8,12.1-2.8c4.3,0,8.1,0.8,11.3,2.4c3.3,1.6,5.8,3.7,7.6,6.4c1.8,2.7,2.7,5.7,2.7,8.8c0,2.5-0.5,4.7-1.5,6.6 c-1,1.9-2.2,3.5-3.6,4.9c-1.4,1.4-3.9,3.7-7.5,6.9c-1,0.9-1.8,1.7-2.4,2.4c-0.6,0.7-1.1,1.3-1.3,1.9c-0.3,0.6-0.5,1.1-0.7,1.7 c-0.2,0.6-0.4,1.6-0.7,3c-0.6,3.1-2.3,4.6-5.3,4.6c-1.5,0-2.8-0.5-3.9-1.5c-1-1-1.6-2.5-1.6-4.5c0-2.5,0.4-4.6,1.2-6.4 c0.8-1.8,1.8-3.4,3.1-4.8c1.3-1.4,3-3,5.1-4.9c1.9-1.7,3.3-2.9,4.1-3.7c0.8-0.8,1.5-1.8,2.1-2.8c0.6-1,0.9-2.2,0.9-3.4 c0-2.4-0.9-4.3-2.6-6c-1.8-1.6-4-2.4-6.8-2.4c-3.2,0-5.6,0.8-7.2,2.5c-1.5,1.6-2.8,4.1-3.9,7.2c-1,3.3-2.9,5-5.7,5 c-1.7,0-3.1-0.6-4.2-1.8C31.3,37.8,30.7,36.5,30.7,35.2z M52.3,83.8c-1.8,0-3.4-0.6-4.7-1.8c-1.3-1.2-2-2.8-2-4.9 c0-1.9,0.7-3.4,2-4.7c1.3-1.3,2.9-1.9,4.8-1.9c1.9,0,3.4,0.6,4.7,1.9c1.3,1.3,1.9,2.8,1.9,4.7c0,2.1-0.7,3.7-2,4.9 C55.6,83.2,54.1,83.8,52.3,83.8z" />
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

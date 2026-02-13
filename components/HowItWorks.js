'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './HowItWorks.module.css';

/**
 * HowItWorks: Sección explicativa de 4 pasos del flujo de MyGens.
 * Cada paso tiene un ícono numerado, título y descripción.
 */
export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            icon: (
                <svg viewBox="0 0 40 40" fill="none"><path d="M20 8v24M12 16l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="6" y="28" width="28" height="6" rx="2" stroke="currentColor" strokeWidth="2" /></svg>
            ),
            title: t('howItWorks.step1'),
            desc: t('howItWorks.step1Desc'),
        },
        {
            icon: (
                <svg viewBox="0 0 40 40" fill="none"><rect x="6" y="6" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M14 34h12M20 28v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="20" cy="17" r="5" stroke="currentColor" strokeWidth="2" /><path d="M17 20l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ),
            title: t('howItWorks.step2'),
            desc: t('howItWorks.step2Desc'),
        },
        {
            icon: (
                <svg viewBox="0 0 40 40" fill="none"><path d="M20 6l4 8h8l-6.5 5 2.5 9L20 23l-8 5 2.5-9L8 14h8l4-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            ),
            title: t('howItWorks.step3'),
            desc: t('howItWorks.step3Desc'),
        },
        {
            icon: (
                <svg viewBox="0 0 40 40" fill="none"><path d="M12 6h16a2 2 0 012 2v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" /><path d="M16 16h8M16 20h8M16 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            ),
            title: t('howItWorks.step4'),
            desc: t('howItWorks.step4Desc'),
        },
    ];

    return (
        <section className={`section ${styles.section}`} id="how-it-works">
            <div className="container">
                <h2 className="section-title">{t('howItWorks.title')}</h2>
                <p className="section-description">{t('howItWorks.description')}</p>

                <div className={styles.steps}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={styles.step}
                            style={{ animationDelay: `${i * 0.15}s` }}
                        >
                            <div className={styles.stepNumber}>{i + 1}</div>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.desc}</p>
                            {i < steps.length - 1 && (
                                <div className={styles.connector} aria-hidden="true" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

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
            title: t('howItWorks.step1'),
            desc: t('howItWorks.step1Desc'),
        },
        {
            title: t('howItWorks.step2'),
            desc: t('howItWorks.step2Desc'),
        },
        {
            title: t('howItWorks.step3'),
            desc: t('howItWorks.step3Desc'),
        },
        {
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

'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './SupportPreview.module.css';

/**
 * SupportPreview: Sección de soporte en la homepage con CTA.
 */
export default function SupportPreview() {
    const { t } = useLanguage();

    return (
        <section className={`section ${styles.section}`} id="support">
            <div className="container">
                <div className={styles.inner}>
                    <div className={styles.glow} aria-hidden="true" />
                    <h2 className={styles.title}>{t('supportSection.title')}</h2>
                    <p className={styles.description}>{t('supportSection.description')}</p>
                    <Link href="/support" className="btn btn-outline">
                        {t('supportSection.cta')}
                    </Link>
                </div>
            </div>
        </section>
    );
}

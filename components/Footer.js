'use client';

import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';
import styles from './Footer.module.css';

/**
 * Footer: Pie de página con branding y copyright.
 */
export default function Footer() {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <Logo className={styles.logo} />
                    <span>{t('nav.brand')}</span>
                </div>
                <p className={styles.tagline}>{t('footer.tagline')}</p>
                <p className={styles.copy}>© {year} MyGensSizing. {t('footer.rights')}</p>
            </div>
        </footer>
    );
}

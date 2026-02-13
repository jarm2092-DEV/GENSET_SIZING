'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import styles from './Navbar.module.css';

/**
 * Navbar: Barra de navegación principal con logo MyGens,
 * links de navegación, toggle de idioma y menú hamburguesa móvil.
 * Se oscurece al hacer scroll.
 */
export default function Navbar() {
    const { t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (sectionId) => {
        setMobileOpen(false);
        const isHomePage = window.location.pathname === '/';

        if (!isHomePage) {
            // Si no estamos en el home, vamos al home + el anclaje
            window.location.href = `/#${sectionId}`;
        } else {
            // Si estamos en el home, scroll suave
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
            <div className={`container ${styles.navInner}`}>
                {/* Logo / Brand */}
                <Link href="/" className={styles.brand}>
                    <Logo className={styles.logo} />
                    <span className={styles.brandText}>{t('nav.brand')}</span>
                </Link>

                {/* Links de navegación (desktop) */}
                <div className={`${styles.navLinks} ${mobileOpen ? styles.navLinksOpen : ''}`}>
                    <button
                        className={styles.navLink}
                        onClick={() => handleNavClick('how-it-works')}
                    >
                        {t('nav.howItWorks')}
                    </button>
                    <button
                        className={styles.navLink}
                        onClick={() => handleNavClick('support')}
                    >
                        {t('nav.support')}
                    </button>
                    <Link href="/sizing-tool" className={`btn btn-primary ${styles.navCta}`}>
                        {t('nav.startSizing')}
                    </Link>
                    <LanguageToggle />
                </div>

                {/* Hamburger (mobile) */}
                <button
                    className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './support.module.css';

/**
 * SupportPage: Formulario de contacto con validación básica.
 * Los datos se guardan en memoria por ahora (preparado para Supabase en el futuro).
 */
export default function SupportPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' | 'error'

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validación básica
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus('error');
            return;
        }

        // TODO: Conectar con Supabase cuando se escale el proyecto
        // await supabase.from('support_tickets').insert(formData);
        console.log('Support ticket:', formData);

        setStatus('success');
        setFormData({ name: '', email: '', message: '' });

        // Quitar mensaje de éxito después de 4 segundos
        setTimeout(() => setStatus(null), 4000);
    };

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={`container ${styles.container}`}>
                    <div className={styles.formWrapper}>
                        {/* Glow decorativo */}
                        <div className={styles.glow} aria-hidden="true" />

                        <h1 className={styles.title}>{t('supportPage.title')}</h1>
                        <p className={styles.subtitle}>{t('supportPage.subtitle')}</p>

                        {/* Mensajes de estado */}
                        {status === 'success' && (
                            <div className={styles.alertSuccess}>{t('supportPage.success')}</div>
                        )}
                        {status === 'error' && (
                            <div className={styles.alertError}>{t('supportPage.error')}</div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="name" className={styles.label}>
                                    {t('supportPage.name')}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t('supportPage.namePlaceholder')}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.label}>
                                    {t('supportPage.email')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('supportPage.emailPlaceholder')}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="message" className={styles.label}>
                                    {t('supportPage.message')}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('supportPage.messagePlaceholder')}
                                    className={styles.textarea}
                                    rows={5}
                                />
                            </div>

                            <div className={styles.actions}>
                                <Link href="/" className="btn btn-secondary">
                                    {t('supportPage.home')}
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    {t('supportPage.send')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

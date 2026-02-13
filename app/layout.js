import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
    title: 'MyGensSizing — Professional Generator Sizing',
    description: 'MyGensSizing helps you find the right generator for your home or business with our professional sizing tool.',
    keywords: 'generator, sizing, electrical, residential, commercial, standby generator',
};

/**
 * RootLayout: Layout principal de la aplicación.
 * Envuelve toda la app con el LanguageProvider para el sistema i18n.
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}

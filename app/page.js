import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import SupportPreview from '@/components/SupportPreview';
import Footer from '@/components/Footer';

/**
 * Homepage: Página principal del sitio MyGens.
 * Composición de secciones: Hero → HowItWorks → Support Preview → Footer
 */
export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <SupportPreview />
            </main>
            <Footer />
        </>
    );
}

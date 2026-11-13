import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Solutions from './components/sections/Solutions';
import Portfolio from './components/sections/Portfolio';
import QuoteForm from './components/ui/QuoteForm';
import { SecurityProvider } from './contexts/SecurityContext';
import GlobalSecurityLayer from './components/ui/GlobalSecurityLayer';

export default function App() {
  return (
    <SecurityProvider>
      <div className="min-h-screen bg-[#070707] text-gray-100 font-sans selection:bg-[#1fb5bc] selection:text-black">
        <Header />
        <main>
          <Hero />
          <Solutions />
          <Portfolio />
          <section id="contato" className="py-20 md:py-24 bg-gradient-to-br from-[#0e2a2b] to-[#113f42] border-y border-white/10">
            <div className="w-full max-w-[1152px] mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase mb-4">Vamos conversar sobre o <span className="bg-gradient-to-r from-[#1fb5bc] to-white bg-clip-text text-transparent">seu projeto</span></h2>
                <p className="text-gray-300 text-[17px] mb-6">Ambiente protegido. Seus dados estão seguros e não serão compartilhados.</p>
              </div>
              <QuoteForm />
            </div>
          </section>
        </main>
        <Footer />
        <GlobalSecurityLayer />
      </div>
    </SecurityProvider>
  );
}
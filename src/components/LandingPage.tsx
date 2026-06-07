import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, TrendingUp, Landmark, ArrowRight, Sparkles, Quote } from "lucide-react";
import { PAMECAS_ARTICLES, PAMECAS_TESTIMONIALS } from "../data";

interface LandingPageProps {
  currentTheme: "green" | "blue";
  onNavigate: (tab: string) => void;
}

export default function LandingPage({ currentTheme, onNavigate }: LandingPageProps) {
  const isGreen = currentTheme === "green";
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Ensemble pour un avenir meilleur.",
      subtitle: "PAMECAS, votre partenaire de confiance au Sénégal.",
      desc: "Depuis plus de 25 ans, nous finançons vos rêves de commerce, d'agriculture, d'habitat et d'études.",
      cta: "Découvrir nos offres",
      bgImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
    },
    {
      title: "Financez vos projets sans tracas.",
      subtitle: "Solutions de Crédit directes et transparentes.",
      desc: "Simulez vos mensualités en ligne à 9.5% d'intérêt brut et bénéficiez de décisions ultra-rapides.",
      cta: "Faire une simulation",
      bgImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-16"
    >
      {/* 1. Hero Slideshow Banner */}
      <div className="relative h-[480px] sm:h-[520px] rounded-2xl overflow-hidden shadow-lg group">
        <div className="absolute inset-0">
          <img 
            src={slides[activeSlide].bgImage} 
            alt="Hero PAMECAS Senegal" 
            className="w-full h-full object-cover transition-all duration-1000 transform scale-102 filter brightness-[0.35]"
          />
        </div>

        {/* Floating details */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-4xl text-white space-y-6">
          <motion.div
            key={activeSlide}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              Microfinance Solidaire
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold font-headline-lg tracking-tight leading-tight text-white">
              {slides[activeSlide].title}
              <br />
              <span className="text-amber-400">{slides[activeSlide].subtitle}</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-lg max-w-xl font-sans font-normal leading-relaxed">
              {slides[activeSlide].desc}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate(activeSlide === 0 ? "produits" : "credit")}
              className={`px-8 py-3.5 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95 duration-200 cursor-pointer ${
                isGreen 
                  ? "bg-amber-500 hover:bg-amber-600 text-emerald-950" 
                  : "bg-amber-500 hover:bg-amber-600 text-blue-950"
              }`}
            >
              {slides[activeSlide].cta}
            </button>
            <button
              onClick={() => onNavigate("compte")}
              className="px-6 py-3.5 rounded-lg text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
            >
              Mon Tableau de Bord
            </button>
          </div>
        </div>

        {/* Bullet navigators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "bg-amber-400 w-8" : "bg-white/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Key Microfinance Figures (Statisticts Banner) */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col items-center justify-center p-4">
            <div className={`p-3 rounded-full mb-3 ${isGreen ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              <Users className="w-8 h-8" />
            </div>
            <span className="text-4xl font-extrabold font-headline-lg tracking-tight text-slate-900">
              1.5M+
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">
              Membres Actifs
            </span>
            <p className="text-xs text-slate-400 mt-1.5 max-w-[200px] leading-relaxed">
              Répartis sur l'ensemble du territoire sénégalais.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className={`p-3 rounded-full mb-3 ${isGreen ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <span className="text-4xl font-extrabold font-headline-lg tracking-tight text-slate-900">
              250 Md
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">
              FCFA d'Épargne
            </span>
            <p className="text-xs text-slate-400 mt-1.5 max-w-[200px] leading-relaxed">
              Mobilisés pour sécuriser l'avenir des ménages.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className={`p-3 rounded-full mb-3 ${isGreen ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              <Landmark className="w-8 h-8" />
            </div>
            <span className="text-4xl font-extrabold font-headline-lg tracking-tight text-slate-900">
              180 Md
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">
              FCFA distribués
            </span>
            <p className="text-xs text-slate-400 mt-1.5 max-w-[200px] leading-relaxed">
              Pour propulser les PME et petits exploitants ruraux.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Flagship Products Action (Nos Produits Phares) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <h2 className="text-2xl font-bold font-headline-lg text-slate-950">
              Nos Services Phares
            </h2>
            <p className="text-sm text-slate-500">
              Des produits ciblés avec des conditions d'ouverture simplifiées pour tous.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("produits")}
            className={`font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer group ${
              isGreen ? "text-emerald-700" : "text-blue-700"
            }`}
          >
            Découvrir tous les produits 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => onNavigate("produits")}
            className="group cursor-pointer bg-amber-50 p-6 sm:p-8 rounded-2xl border-2 border-amber-200/60 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply opacity-50 transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider px-2 py-1 rounded bg-amber-200/50">
              CONSTITUER UN CAPITAL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 font-headline-md">
              Épargne Plus
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
              Maximisez la rentabilité de votre trésorerie avec nos solutions de placement rémunéré à terme.
            </p>
            <div className="flex items-center gap-2 mt-6 text-amber-800 font-bold text-xs">
              En savoir plus 
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate("credit")}
            className="group cursor-pointer bg-emerald-50/50 p-6 sm:p-8 rounded-2xl border-2 border-emerald-200/60 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply opacity-50 transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider px-2 py-1 rounded bg-emerald-200/60">
              BESOIN DE LIQUIDITÉS RAPIDES
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 font-headline-md">
              Crédit Express
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
              Débloquage accéléré sous 48h ouvrées pour faire face aux imprévus et saisir les opportunités.
            </p>
            <div className="flex items-center gap-2 mt-6 text-emerald-800 font-bold text-xs">
              Simuler son crédit 
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Senegal News Feed (Actualités Récentes) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-headline-lg text-slate-950">
            Actualités Récentes
          </h2>
          <p className="text-sm text-slate-500">
            Découvrez nos actions solidaires et notre impact auprès des communes sénégalaises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PAMECAS_ARTICLES.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs flex flex-col sm:flex-row hover:shadow-md transition-shadow group"
            >
              <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto sm:h-auto relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {article.date}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-snug hover:text-amber-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider mt-3">
                  Lire l'article
                  <ArrowRight className="w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Testimonial Slides (Témoignages) */}
      <section className="bg-emerald-50/80 text-slate-850 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xs border border-emerald-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full transform translate-x-20 -translate-y-20 filter blur-3xl pointers-none" />
        
        <div className="max-w-3xl mx-auto space-y-8 text-center relative z-10">
          <Quote className="w-12 h-12 text-emerald-600 mx-auto opacity-40" />
          <h2 className="text-xl sm:text-2xl font-bold font-headline-md tracking-tight leading-relaxed max-w-2xl mx-auto italic text-emerald-950">
            "Avec PAMECAS, j'ai trouvé un partenaire financier à l'écoute de mes réalités locales. C'est l'avenir du Sénégal solidaire qui s'écrit."
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-emerald-200/60">
            {PAMECAS_TESTIMONIALS.map((t) => (
              <div key={t.id} className="space-y-3 p-4 bg-white rounded-xl border border-emerald-100/80 shadow-[0px_4px_12px_rgba(16,185,129,0.03)]">
                <img 
                  src={t.image} 
                  alt={t.name}
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-emerald-500 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm text-emerald-850">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 font-sans">{t.role}</p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed px-1">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

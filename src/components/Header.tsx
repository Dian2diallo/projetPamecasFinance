import { useState } from "react";
import { Menu, X, User, LogOut, Phone, MessageCircle } from "lucide-react";
import { UserAccount } from "../types";

interface HeaderProps {
  currentTheme: "green" | "blue";
  setTheme: (theme: "green" | "blue") => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export default function Header({ 
  currentTheme, 
  setTheme, 
  onNavigate, 
  activeTab, 
  currentUser, 
  onLogout 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [appliedProgram, setAppliedProgram] = useState<string | null>(null);

  const opportunitiesList = [
    {
      id: "pme-start",
      title: "🚀 Programme Starter SÉNÉGAL PME",
      desc: "Prêt de démarrage à taux préférentiel de 1.8% mensuel pour les porteurs de projets et de jeunes PME sénégalaises.",
      grant: "Jusqu'à 5 000 000 FCFA",
      badge: "Priorité Jeunes"
    },
    {
      id: "agri-tech",
      title: "🌾 Subvention AgriTech Solidaire",
      desc: "Accompagnement financier et technologique des exploitations maraîchères et avicoles du bassin de Thiès et du Nord.",
      grant: "Jusqu'à 10 000 000 FCFA",
      badge: "Durable"
    },
    {
      id: "coaching-pme",
      title: "📚 Mentorat & Tenue de Caisse SÉNÉGAL PME",
      desc: "Coaching de caisse et mentorat gratuit par des experts-comptables agréés par la BCEAO pour obtenir le label PME Elite.",
      grant: "Prise en charge 100%",
      badge: "Formation"
    }
  ];

  const handleApplyOpportunity = (title: string) => {
    setAppliedProgram(title);
    setTimeout(() => {
      setAppliedProgram(null);
      setShowOpportunityModal(false);
      onNavigate("credit"); // Navigate directly to loan simulator
    }, 1800);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col font-sans select-none">
      
      {/* =========================================================================
          BARRE SUPÉRIEURE (topbar) — fond vert foncé (#1a5c2a), texte blanc, hauteur ~40px
          ========================================================================= */}
      <div className="bg-[#1a5c2a] text-white text-[11px] font-sans h-10 px-4 md:px-8 flex items-center justify-between shadow-sm border-b border-emerald-900/20">
        
        {/* À gauche : icône téléphone 📞 suivi de +221 77 692 76 51 | icône WhatsApp suivi de WhatsApp : +221 76 218 24 48 et +221 78 000 00 00 */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
          <a href="tel:+221776927651" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
            <span>📞</span>
            <span className="font-semibold">+221 77 692 76 51</span>
          </a>
          
          <span className="text-white/40 font-light">|</span>
          
          <div className="flex items-center gap-1">
            <span className="text-[12px]">💬</span>
            <span className="font-bold text-emerald-300">WhatsApp :</span>
            <a href="https://wa.me/221762182448" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition-colors font-semibold">
              +221 76 218 24 48
            </a>
            <span className="text-white/30">&amp;</span>
            <a href="tel:+221780000000" className="hover:text-amber-300 transition-colors font-semibold">
              +221 78 000 00 00
            </a>
          </div>
        </div>

        {/* À droite : logo carré "GUF-PME" (petit, fond blanc) + texte 🏢 Mon espace PME cliquable */}
        <div className="flex items-center gap-3">
          
          {/* Theme switcher integrated in a minimalist way in topbar */}
          <button 
            onClick={() => setTheme(currentTheme === "green" ? "blue" : "green")}
            style={{ contentVisibility: "auto" }}
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-white/10 hover:bg-white/20 transition-all font-semibold cursor-pointer text-amber-300"
            title="Changer de design"
          >
            🎨 Mode {currentTheme === "green" ? "Vert" : "Bleu"}
          </button>

          <div className="flex items-center gap-2">
            
            {/* Logo carré "GUF-PME" (petit, fond blanc) */}
            <div className="bg-white px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-1 h-6">
              {/* Graphic bars for GUF-PME */}
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-1.5 bg-[#006633] rounded-t-xs"></div>
                <div className="w-1 h-3 bg-amber-400 rounded-t-xs"></div>
                <div className="w-1 h-2 bg-red-650 bg-red-600 rounded-t-xs"></div>
              </div>
              <span className="text-[9.5px] font-black text-[#1a5c2a] tracking-tighter">GUF-PME</span>
            </div>

            {/* Texte 🏢 Mon espace PME cliquable */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate("compte")}
                  className="flex items-center gap-1 text-white hover:text-amber-300 transition-all text-[11px] font-bold cursor-pointer"
                >
                  <span>🏢</span>
                  <span>Espace ({currentUser.firstName})</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="px-1 py-0.5 bg-red-950/40 hover:bg-red-900/50 text-red-200 rounded transition-colors text-[9px] font-bold"
                  title="Déconnexion"
                >
                  Quitter
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate("compte")}
                className="flex items-center gap-1 text-white hover:text-amber-300 transition-all text-[11px] font-bold cursor-pointer"
              >
                <span>🏢</span>
                <span>Mon espace PME</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* =========================================================================
          BARRE PRINCIPALE (navbar) — fond blanc, ombre légère, hauteur ~70px
          ========================================================================= */}
      <div className="bg-white shadow-sm border-b border-slate-100 h-[70px] px-4 md:px-8 flex justify-between items-center">
        
        {/* À gauche : logo PAMECAS (image ou placeholder coloré avec initiales) */}
        <div 
          onClick={() => { onNavigate("accueil"); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
        >
          {/* Symbol of Senegal Flag linked to PAMECAS green structure */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006633] to-[#1a5c2a] flex items-center justify-center text-white relative shadow-sm border border-[#006633]/10">
            <span className="font-extrabold text-xs tracking-tighter leading-none text-center">PAM<br /><span className="text-[9px] text-amber-300">ECAS</span></span>
            {/* Subtle floating star */}
            <span className="absolute top-0.5 right-0.5 text-[7px] text-amber-300">★</span>
          </div>
          
          <div className="flex flex-col select-none justify-center">
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-[#006633] tracking-tighter leading-none">PAMECAS</span>
              <span className="text-[8px] px-1 bg-amber-400 text-slate-900 font-bold rounded-sm tracking-wider uppercase">SÉNÉGAL</span>
            </div>
            <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Union des Mutuelles</span>
          </div>
        </div>

        {/* Au centre : menu de navigation horizontal avec les entrées suivantes, séparées par des barres verticales | */}
        <nav className="hidden md:flex items-center flex-wrap">
          
          {/* Accueil */}
          <button 
            onClick={() => onNavigate("accueil")}
            className={`text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all cursor-pointer ${
              activeTab === "accueil" ? "opacity-100 scale-102 underline decoration-2 underline-offset-4" : "opacity-90"
            }`}
          >
            Accueil
          </button>
          
          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Financement ▾ (dropdown) */}
          <div className="relative group py-4">
            <button 
              onClick={() => onNavigate("produits")}
              className="text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <span>Financement</span>
              <span className="text-[10px] text-[#006633] font-bold">▾</span>
            </button>
            {/* Dropdown container */}
            <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-xl border border-slate-100 window shadow-2xl w-60 py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <button 
                onClick={() => onNavigate("produits")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                💼 Offres de Financement PME
              </button>
              <button 
                onClick={() => onNavigate("credit")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                🧮 Simulateur de Crédit Direct
              </button>
              <button 
                onClick={() => onNavigate("depot-pret")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                ✍️ Déposer un Dossier de Prêt
              </button>
            </div>
          </div>

          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Acteurs ▾ (dropdown) */}
          <div className="relative group py-4">
            <button 
              onClick={() => onNavigate("acteurs-mutuelles")}
              className="text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <span>Acteurs</span>
              <span className="text-[10px] text-[#006633] font-bold">▾</span>
            </button>
            {/* Dropdown container */}
            <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-xl border border-slate-100 w-60 py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="px-4 py-1.5 text-[9px] uppercase font-bold text-slate-400 tracking-wider">Écosystème Sénégal</div>
              <button 
                onClick={() => onNavigate("acteurs-mutuelles")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                🤝 Mutuelles de Crédit (PAMECAS)
              </button>
              <button 
                onClick={() => onNavigate("acteurs-tpe")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                🏬 Très Petites Entreprises (TPE)
              </button>
              <button 
                onClick={() => onNavigate("acteurs-elites")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                🚀 PME &amp; Startups Elites
              </button>
            </div>
          </div>

          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Formations */}
          <button 
            onClick={() => onNavigate("formations")}
            className={`text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all cursor-pointer ${
              activeTab === "formations" ? "underline decoration-2 underline-offset-4" : ""
            }`}
          >
            Formations
          </button>

          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Documentation ▾ (dropdown) */}
          <div className="relative group py-4">
            <button 
              onClick={() => onNavigate("documentation")}
              className="text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <span>Documentation</span>
              <span className="text-[10px] text-[#006633] font-bold">▾</span>
            </button>
            {/* Dropdown container */}
            <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-xl border border-slate-100 w-60 py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <button 
                onClick={() => onNavigate("documentation")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                📄 Guide d&apos;inscription (PDF)
              </button>
              <button 
                onClick={() => onNavigate("documentation")}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#006633] hover:bg-[#006633]/5 transition-colors"
              >
                📄 Conditions d&apos;Éligibilité BCEAO
              </button>
            </div>
          </div>

          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Actualités ▾ (dropdown) */}
          <div className="relative group py-4">
            <button 
              onClick={() => onNavigate("actualites")}
              className="text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <span>Actualités</span>
              <span className="text-[10px] text-[#006633] font-bold">▾</span>
            </button>
            {/* Dropdown container */}
            <div className="absolute top-full right-0 mt-0 bg-white rounded-xl shadow-xl border border-slate-100 w-64 py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <div 
                onClick={() => onNavigate("actualites")}
                className="px-4 py-2.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-[9px] text-amber-600 font-bold uppercase block">7 Juin 2026</span>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Suivi de votre dossier PAMECAS en temps réel.</p>
              </div>
              <div 
                onClick={() => onNavigate("actualites")}
                className="px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-[9px] text-emerald-600 font-bold uppercase block">4 Juin 2026</span>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Fonds de garantie étendu pour le maraîchage régional.</p>
              </div>
            </div>
          </div>

          <span className="text-slate-300 font-light text-xs mx-0.5 lg:mx-1.5">|</span>

          {/* Contact */}
          <button 
            onClick={() => onNavigate("agences")}
            className={`text-[11px] lg:text-[12.5px] font-extrabold px-1 lg:px-1.5 py-1 text-[#006633] hover:text-[#1a5c2a] transition-all cursor-pointer ${
              activeTab === "agences" ? "underline decoration-2 underline-offset-4" : ""
            }`}
          >
            Contact
          </button>

        </nav>

        {/* À droite : bouton CTA arrondi vert foncé avec icône ✦ et texte Explorer les opportunités */}
        <div className="flex items-center gap-2">
          
          <button 
            onClick={() => setShowOpportunityModal(true)}
            className="bg-[#006633] hover:bg-[#1a5c2a] text-white text-xs font-bold px-4 py-2.5 shadow-sm active:scale-95 transition-all text-center cursor-pointer rounded-full flex items-center gap-1.5"
          >
            <span className="text-amber-300 font-black text-sm select-none">✦</span>
            <span>Explorer les opportunités</span>
          </button>

          {/* Hamburger menu for small devices */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-55 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          3. RESPONSIVE MOBILE MENUDRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-6 space-y-3 font-sans shadow-lg animate-fade-in z-45">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { onNavigate("accueil"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Accueil
            </button>
            <button 
              onClick={() => { onNavigate("produits"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Financement (Offres)
            </button>
            <button 
              onClick={() => { onNavigate("depot-pret"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Déposer un Dossier de Prêt
            </button>
            <button 
              onClick={() => { onNavigate("acteurs-mutuelles"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Acteurs (Éco-système)
            </button>
            <button 
              onClick={() => { onNavigate("formations"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Formations
            </button>
            <button 
              onClick={() => { onNavigate("documentation"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Documentation
            </button>
            <button 
              onClick={() => { onNavigate("actualites"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Actualités
            </button>
            <button 
              onClick={() => { onNavigate("agences"); setMobileMenuOpen(false); }}
              className="text-left text-xs font-bold py-2 text-[#006633] border-b border-slate-50"
            >
               Contact
            </button>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => { setShowOpportunityModal(true); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-[#006633] hover:bg-[#1a5c2a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
            >
              <span className="text-amber-300">✦</span>
              <span>Explorer les opportunités (Pop)</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          OPPORTUNITIES DISCOVERY MODAL
          ========================================================================= */}
      {showOpportunityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-55 bg-emerald-50 rounded-xl text-[#006633]">
                  <span className="text-amber-500 font-extrabold text-lg">✦</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">Portail d&apos;Opportunités PME</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Guichet unique d&apos;accompagnement SÉNÉGAL PME &amp; PAMECAS</p>
                </div>
              </div>
              <button 
                onClick={() => setShowOpportunityModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-4 my-5 text-slate-600 text-xs">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Voici les dispositifs de relance, subventions de garantie et formations d&apos;élite disponibles aujourd&apos;hui pour votre projet de PME au Sénégal. Sélectionnez un programme pour enclencher l&apos;instruction :
              </p>

              <div className="space-y-3.5">
                {opportunitiesList.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/10 transition-all space-y-2 group">
                    <div className="flex justify-between items-start">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                        {opp.badge}
                      </span>
                      <span className="font-mono text-[10px] font-black text-amber-600">
                        {opp.grant}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-850 text-slate-800 text-xs sm:text-sm group-hover:text-[#006633] transition-colors">{opp.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opp.desc}</p>
                    
                    <button
                      onClick={() => handleApplyOpportunity(opp.title)}
                      disabled={appliedProgram !== null}
                      className="w-full mt-2 py-2 bg-slate-900 hover:bg-[#006633] text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-97"
                    >
                      {appliedProgram === opp.title ? (
                        <span>Redirection vers l&apos;instruction...</span>
                      ) : (
                        <span>Demander l&apos;évaluation gratuite</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Alert */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[10px] text-slate-500 flex gap-2 leading-relaxed">
              <span className="text-amber-500 font-bold font-mono">⚠️ Info :</span>
              <span>L&apos;évaluation de ces opportunités est coordonnée avec l&apos;Agence de Rattachement PAMECAS désignée lors de votre inscription.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

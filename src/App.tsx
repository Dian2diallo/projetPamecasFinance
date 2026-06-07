import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Home, Package, Calculator, Wallet, MapPin, Landmark, Phone, Mail, FileText } from "lucide-react";

// Components
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import ProductsList from "./components/ProductsList";
import CreditSimulator from "./components/CreditSimulator";
import Dashboard from "./components/Dashboard";
import ContactAgences from "./components/ContactAgences";
import AssistantAIChat from "./components/AssistantAIChat";
import AuthPortal from "./components/AuthPortal";
import DepotPret from "./components/DepotPret";
import AboutActeurs from "./components/AboutActeurs";
import FormationsList from "./components/FormationsList";
import DocumentationList from "./components/DocumentationList";
import ActualitesList from "./components/ActualitesList";

// Static Initial Ledger Data
import { INITIAL_TRANSACTIONS } from "./data";
import { Transaction, UserAccount } from "./types";

export default function App() {
  // Global View Navigation State
  const [activeTab, setActiveTab] = useState<string>("accueil");
  
  // Custom Color Theme: "green" (Forest Green & Gold) or "blue" (Prestige Blue & Gold)
  const [currentTheme, setTheme] = useState<"green" | "blue">("green");

  // Authenticated User Session State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Balance & Transaction Ledger State
  const [savingsBalance, setSavingsBalance] = useState<number>(0); 
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Core callback to dynamically adjust balances and insert transaction history
  const handleUpdateBalance = (
    amount: number, 
    type: "dépôt" | "retrait" | "virement" | "facture", 
    label: string
  ) => {
    // 1. Adjust Balance
    setSavingsBalance(prev => Math.max(0, prev + amount));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, balance: Math.max(0, prev.balance + amount) } : null);
    }

    // 2. Append new Ledger Item
    const newTx: Transaction = {
      id: `tx-user-${Math.floor(100000 + Math.random() * 900000)}`,
      type: type,
      label: label,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      amount: amount,
      status: "reçu"
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setSavingsBalance(user.balance);
    if (user.id === "PAM-2026-96961") {
      setTransactions(INITIAL_TRANSACTIONS);
    } else {
      setTransactions([
        {
          id: "tx-welcome",
          type: "dépôt",
          label: "Cadeau de Bienvenue PAMECAS",
          date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
          amount: user.balance,
          status: "reçu"
        }
      ]);
    }
    setActiveTab("compte"); // Route instantly to Dashboard
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSavingsBalance(0);
    setTransactions([]);
    setActiveTab("accueil");
  };

  // Determine active view panel
  const renderActiveView = () => {
    switch (activeTab) {
      case "accueil":
        return <LandingPage currentTheme={currentTheme} onNavigate={setActiveTab} />;
      case "produits":
        return (
          <ProductsList 
            currentTheme={currentTheme} 
            onNavigateToSimulator={() => setActiveTab("credit")} 
          />
        );
      case "credit":
        return (
          <CreditSimulator 
            currentTheme={currentTheme} 
            onAddTransactionToDashboard={handleUpdateBalance} 
            currentUser={currentUser}
            onNavigate={setActiveTab}
          />
        );
      case "depot-pret":
        return <DepotPret currentTheme={currentTheme} onNavigate={setActiveTab} />;
      case "acteurs-mutuelles":
        return <AboutActeurs currentTheme={currentTheme} initialSubTab="mutuelles" />;
      case "acteurs-tpe":
        return <AboutActeurs currentTheme={currentTheme} initialSubTab="tpe" />;
      case "acteurs-elites":
        return <AboutActeurs currentTheme={currentTheme} initialSubTab="elites" />;
      case "formations":
        return <FormationsList currentTheme={currentTheme} />;
      case "documentation":
        return <DocumentationList currentTheme={currentTheme} />;
      case "actualites":
        return <ActualitesList currentTheme={currentTheme} onNavigate={setActiveTab} />;
      case "compte":
        if (!currentUser) {
          return (
            <AuthPortal 
              currentTheme={currentTheme} 
              onLoginSuccess={handleLoginSuccess} 
            />
          );
        }
        return (
          <Dashboard 
            currentTheme={currentTheme} 
            transactions={transactions} 
            savingsBalance={savingsBalance} 
            onUpdateBalance={handleUpdateBalance} 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      case "agences":
        return <ContactAgences currentTheme={currentTheme} />;
      default:
        return <LandingPage currentTheme={currentTheme} onNavigate={setActiveTab} />;
    }
  };

  const isGreen = currentTheme === "green";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative antialiased transition-colors duration-300">
      
      {/* 1. Global Navigation TopAppBar Wrapper */}
      <Header 
        currentTheme={currentTheme} 
        setTheme={setTheme} 
        activeTab={activeTab} 
        onNavigate={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Space Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating AI Customer Desk Advisor */}
      <AssistantAIChat currentTheme={currentTheme} />

      {/* 4. Modular Multi-Region Senegal Footer */}
      <footer className="bg-[#006633] text-slate-200 border-t-4 border-amber-500 py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          {/* Logo & Contact details */}
          <div className="space-y-3">
            <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2.5 justify-center md:justify-start">
              {/* Flag of Senegal logo in footer */}
              <div className="w-9 h-6 rounded-sm overflow-hidden flex border border-white/20 relative" title="Drapeau du Sénégal">
                <div className="w-1/3 h-full bg-[#00853F]" />
                <div className="w-1/3 h-full bg-[#FDEF42] flex items-center justify-center relative">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#00853F] absolute">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                  </svg>
                </div>
                <div className="w-1/3 h-full bg-[#E31B23]" />
              </div>
              PAMECAS <span className="text-amber-400 text-xs font-mono font-bold">FINANCE SÉNÉGAL</span>
            </span>
            <p className="text-xs text-emerald-100/90 max-w-sm leading-relaxed">
              Institution coopérative de microfinance du Sénégal, agréée par le Ministère de l’Énergie et des Finances. Épargne sécurisée et crédit de proximité.
            </p>
          </div>

          {/* Links links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-sans text-emerald-50">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("accueil"); }} className="hover:text-amber-400 transition-colors font-medium">Accueil</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("produits"); }} className="hover:text-amber-400 transition-colors font-medium">Produits</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("credit"); }} className="hover:text-amber-400 transition-colors font-medium">Crédit</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("compte"); }} className="hover:text-amber-400 transition-colors font-medium">Compte</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("agences"); }} className="hover:text-amber-400 transition-colors font-medium">Agences</a>
          </div>

          {/* Legal declaration block */}
          <div className="space-y-1.5 text-xs">
            <p className="text-emerald-200/80 text-[11px] leading-relaxed">
              Mentions Légales • Politique de Sécurité • Agrément BCEAO N° 96961
            </p>
            <p className="text-emerald-100/90 text-[11px] leading-relaxed font-sans">
              © 2026 Institution de Microfinance du Sénégal. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* 5. Mobile-Only Responsive Sticky BottomAppBar */}
      <nav 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t shadow-[0px_-4px_20px_rgba(0,0,0,0.06)] rounded-t-2xl flex justify-around items-center h-16 pt-2 pb-1.5 px-2 transition-colors duration-300 ${
          isGreen ? "bg-emerald-950 border-emerald-900 text-slate-400" : "bg-blue-950 border-blue-900 text-slate-400"
        }`}
      >
        <button 
          onClick={() => setActiveTab("accueil")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer select-none transition-all duration-200 ${
            activeTab === "accueil" ? "text-amber-400 text-xs font-semibold scale-102" : "text-slate-300 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-sans">Accueil</span>
        </button>

        <button 
          onClick={() => setActiveTab("produits")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer select-none transition-all duration-200 ${
            activeTab === "produits" ? "text-amber-400 text-xs font-semibold scale-102" : "text-slate-300 hover:text-white"
          }`}
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-sans">Produits</span>
        </button>

        <button 
          onClick={() => setActiveTab("credit")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer select-none transition-all duration-200 ${
            activeTab === "credit" ? "text-amber-400 text-xs font-semibold scale-102" : "text-slate-300 hover:text-white"
          }`}
        >
          <Calculator className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-sans">Crédit</span>
        </button>

        <button 
          onClick={() => setActiveTab("compte")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer select-none transition-all duration-200 ${
            activeTab === "compte" ? "text-amber-400 text-xs font-semibold scale-102" : "text-slate-300 hover:text-white"
          }`}
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-sans font-sans">Compte</span>
        </button>

        <button 
          onClick={() => setActiveTab("agences")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer select-none transition-all duration-200 ${
            activeTab === "agences" ? "text-amber-400 text-xs font-semibold scale-102" : "text-slate-300 hover:text-white"
          }`}
        >
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <span className="text-[10px] font-sans">Agences</span>
        </button>
      </nav>

    </div>
  );
}

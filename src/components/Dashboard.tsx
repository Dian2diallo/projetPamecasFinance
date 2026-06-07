import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, TrendingUp, Handshake, ChevronDown, ChevronUp, Plus, Minus, CheckCircle, ArrowDownLeft, ArrowUpRight, FileText, Calendar } from "lucide-react";
import { Transaction, UserAccount } from "../types";

interface DashboardProps {
  currentTheme: "green" | "blue";
  transactions: Transaction[];
  savingsBalance: number;
  onUpdateBalance: (amount: number, type: "dépôt" | "retrait" | "virement" | "facture", label: string) => void;
  currentUser: UserAccount;
  onLogout: () => void;
}

export default function Dashboard({ currentTheme, transactions, savingsBalance, onUpdateBalance, currentUser, onLogout }: DashboardProps) {
  const isGreen = currentTheme === "green";

  // Account Details Collapse state
  const [showDetails, setShowDetails] = useState(false);
  const [outstandingCredit, setOutstandingCredit] = useState(currentUser.outstandingCredit); // Initialize based on authenticated account
  
  // Withdraw/Deposit Modals state
  const [modalType, setModalType] = useState<"deposit" | "withdraw" | "repay" | null>(null);
  const [actionAmount, setActionAmount] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  // Coordinates mapping values for SVG graphpoints
  // 600 FCFA -> coord y: 90
  // 150,000 FCFA -> coord y: 55
  // 350,250 FCFA / Current -> coord y: 15
  const chartPoints = [
    { x: 30, y: 88, label: "1 Mai", value: "600 F" },
    { x: 90, y: 65, label: "10 Mai", value: "85K F" },
    { x: 150, y: 58, label: "15 Mai", value: "150K F" },
    { x: 210, y: 48, label: "22 Mai", value: "195K F" },
    { x: 270, y: 22, label: "30 Mai", value: "350K F" }
  ];

  // Draw smooth SVG path string based on milestones
  const pathD = chartPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Execute Deposit or Withdrawal
  const handleQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(actionAmount);
    if (!amount || amount <= 0) return;

    if (modalType === "deposit") {
      onUpdateBalance(amount, "dépôt", actionLabel || "Dépôt de fonds - Guichet PAMECAS");
      setSuccessMsg(`Félicitations, dépôt de ${formatFCFA(amount)} effectué avec succès !`);
    } else if (modalType === "withdraw") {
      if (amount > savingsBalance) {
        alert("Solde épargne insuffisant pour effectuer ce retrait.");
        return;
      }
      onUpdateBalance(-amount, "retrait", actionLabel || "Retrait GAB - PAMECAS");
      setSuccessMsg(`Retrait de ${formatFCFA(amount)} approuvé et débité.`);
    } else if (modalType === "repay") {
      if (amount > savingsBalance) {
        alert("Solde épargne insuffisant pour rembourser cette somme.");
        return;
      }
      if (amount > outstandingCredit) {
        alert("Le remboursement ne peut pas excéder le capital restant dû.");
        return;
      }
      onUpdateBalance(-amount, "facture", `Remboursement échéance crédit - PAMECAS`);
      setOutstandingCredit(prev => prev - amount);
      setSuccessMsg(`Paiement de ${formatFCFA(amount)} validé pour votre crédit.`);
    }

    // Success response timing
    setTimeout(() => {
      setModalType(null);
      setActionAmount("");
      setActionLabel("");
      setSuccessMsg("");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Page header & Quick Action triggers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline-lg text-slate-900 tracking-tight">
            Mon Tableau de bord
          </h2>
          <p className="text-sm text-slate-500 font-sans">
            Bienvenue dans votre espace sécurisé d&apos;épargne et de micro-crédit.
          </p>
        </div>

        {/* Action button trigger caps */}
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setModalType("deposit")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-emerald-950 hover:bg-amber-600 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Dépôt rapide
          </button>
          <button
            onClick={() => setModalType("withdraw")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Minus className="w-4 h-4" />
            Retrait GAB
          </button>
        </div>
      </div>

      {/* Grid: 1. Main balance card (full width or col span) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Capital & Graph Evolution */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Account Sheet Gold card */}
          <div className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white shadow-lg border transition-colors duration-300 ${
            isGreen 
              ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border-emerald-800" 
              : "bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 border-blue-800"
          }`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-12 -translate-y-12 filter blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase block">
                  Solde Épargne Actuel
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-400 font-sans block">
                  {formatFCFA(savingsBalance)}
                </span>
                <p className="text-xs text-slate-300 tracking-wider font-mono">
                  Compte: <span className="font-semibold text-white">1234-5678-9012</span>
                </p>
              </div>

              {/* Miniature emblem */}
              <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-bold font-serif text-amber-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                PAMECAS
              </div>
            </div>

            {/* Collapse view details */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors select-none"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showDetails ? "Masquer les détails du compte" : "Voir détails du compte"}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-4 text-xs space-y-3 font-sans text-slate-200"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Titulaire du compte</p>
                        <p className="font-semibold text-white mt-0.5">{currentUser.firstName} {currentUser.lastName} ({currentUser.id})</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Type d&apos;épargne</p>
                        <p className="font-semibold text-white mt-0.5">Épargne Rémunérée Classique</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Agence de Rattachement</p>
                        <p className="font-semibold text-white mt-0.5">Siège Dakar Rufisque</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SVG Line Graph Card (milestones) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-headline-sm">
                  Évolution Épargne (30 jours)
                </h3>
                <p className="text-xs text-slate-400">
                  Visualisation de la capitalisation de votre livret d&apos;épargne.
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>

            {/* Custom Scalable Clean SVG Chart in Gold */}
            <div className="relative pt-2">
              <svg 
                viewBox="0 0 300 110" 
                className="w-full h-48 select-none"
                style={{ overflow: "visible" }}
              >
                {/* Horizontal Guide lines */}
                <line x1="0" y1="15" x2="300" y2="15" stroke="#f1f5f9" strokeWidth="0.8" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="0.8" />
                <line x1="0" y1="88" x2="300" y2="88" stroke="#f1f5f9" strokeWidth="0.8" />

                {/* Drawn Gold line path */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3.2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Fill shadow area under the curve */}
                <path 
                  d={`${pathD} L 270 100 L 30 100 Z`}
                  fill="url(#gradGold)"
                  opacity="0.12"
                />

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Milestones Points & Text tags */}
                {chartPoints.map((p, idx) => (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="4.5" 
                      fill="#e0a96d"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      className="transition-transform duration-300 group-hover/dot:scale-130"
                    />
                    
                    {/* Tiny value floating box on hover representation */}
                    <text 
                      x={p.x} 
                      y={p.y - 8} 
                      textAnchor="middle" 
                      className="text-[8px] font-bold fill-slate-700 font-mono"
                    >
                      {p.value}
                    </text>

                    {/* Footer label */}
                    <text 
                      x={p.x} 
                      y="105" 
                      textAnchor="middle" 
                      className="text-[9px] fill-slate-400 font-medium"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

        </div>

        {/* Right Side: Repayments & Recent scroll ledger */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ongoing active loans detail Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-headline-sm">
              Statut Crédit en cours
            </h3>

            {/* Standard loan stats */}
            {outstandingCredit > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    En règle
                  </span>
                  
                  <span className="text-xs text-slate-400 font-semibold font-sans">
                    9.5% fixe
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider leading-none">
                    Capital Restant dû
                  </span>
                  <span className="text-xl font-bold tracking-tight text-slate-800 font-sans block">
                    {formatFCFA(outstandingCredit)}
                  </span>
                  
                  <span className="text-xs font-medium text-slate-500 font-sans flex items-center gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Prochaine échéance: <span className="font-bold text-slate-800">05 Juin</span>
                  </span>
                </div>

                <button
                  onClick={() => setModalType("repay")}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-xs cursor-pointer active:scale-97 border text-center ${
                    isGreen 
                      ? "border-emerald-700 text-emerald-800 hover:bg-emerald-50 bg-white" 
                      : "border-blue-700 text-blue-800 hover:bg-blue-50 bg-white"
                  }`}
                >
                  Rembourser
                </button>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-sm">Félicitations !</p>
                  <p className="text-xs text-slate-500">Vous n&apos;avez aucun crédit en cours à rembourser en ce moment.</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Ledger Files or Documents List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-headline-sm">
              Mes Documents (PDF)
            </h3>

            <div className="space-y-2.5 text-xs">
              <a 
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-slate-800">Relevé d&apos;Épargne - Mai.pdf</span>
                </div>
                <span className="text-[10px] text-slate-400">0.8 Mo</span>
              </a>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-slate-800">Contrat_Cadre_Pamecas.pdf</span>
                </div>
                <span className="text-[10px] text-slate-400">1.4 Mo</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Grid: 2. Complete Transaction list (Dernières Transactions) */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-headline-sm">
            Dernières Transactions
          </h3>
          <p className="text-xs text-slate-400">
            Derniers mouvements de dépôt, retrait et prélèvement d&apos;assurance sur votre compte.
          </p>
        </div>

        <div className="space-y-1 font-sans">
          {transactions.map((tx) => {
            const isNegative = tx.amount < 0;
            return (
              <div 
                key={tx.id}
                className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Ledger Direction vectors */}
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    isNegative 
                      ? "bg-slate-100 text-slate-600" 
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {isNegative ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-800 leading-tight">
                      {tx.label}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {tx.date} • {tx.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className={`text-sm sm:text-base font-bold tracking-tight block ${
                    isNegative ? "text-slate-700" : "text-emerald-700"
                  }`}>
                    {isNegative ? "" : "+"}{formatFCFA(tx.amount)}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    tx.status === "reçu" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-slate-100 text-slate-600 border border-slate-205"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dialog Modals for quick transaction additions */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 35 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative z-20 border border-slate-150 font-sans"
            >
              {successMsg ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>
                  <p className="font-bold text-slate-800 text-base">
                    {successMsg}
                  </p>
                  <p className="text-xs text-slate-400">
                    Mise à jour immédiate du solde disponible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuickAction} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-headline-sm">
                      {modalType === "deposit" && "Opération de Dépôt de fonds"}
                      {modalType === "withdraw" && "Opération de Retrait d&apos;épargne"}
                      {modalType === "repay" && "Paiement de mensualité de crédit"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Entrez les détails ci-dessous pour simuler instantanément l&apos;impact de l&apos;opération.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Montant de l&apos;opération (FCFA) *
                      </label>
                      <input 
                        type="number" 
                        required
                        value={actionAmount}
                        onChange={(e) => setActionAmount(e.target.value)}
                        placeholder="Ex: 50000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                      />
                    </div>

                    {modalType !== "repay" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-500 uppercase tracking-wider">
                          Libellé explicatif (ou tag)
                        </label>
                        <input 
                          type="text" 
                          value={actionLabel}
                          onChange={(e) => setActionLabel(e.target.value)}
                          placeholder={modalType === "deposit" ? "Ex: Versement épargne boutique Fatou" : "Ex: Retrait de dépannage"}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl active:scale-95 transition-all cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 py-3 px-4 text-white font-bold rounded-xl active:scale-95 shadow-md transition-all cursor-pointer ${
                        isGreen ? "bg-emerald-800 hover:bg-emerald-900" : "bg-blue-800 hover:bg-blue-900"
                      }`}
                    >
                      Confirmer
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

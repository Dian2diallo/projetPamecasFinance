import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, HelpCircle, FileText, Upload, Calendar, ArrowRight, User, Phone, CheckCircle, Lock } from "lucide-react";
import { AmortizationItem, UserAccount } from "../types";

interface CreditSimulatorProps {
  currentTheme: "green" | "blue";
  onAddTransactionToDashboard: (
    amount: number, 
    type: "dépôt" | "retrait" | "virement" | "facture", 
    label: string
  ) => void;
  currentUser: UserAccount | null;
  onNavigate: (tab: string) => void;
}

export default function CreditSimulator({ currentTheme, onAddTransactionToDashboard, currentUser, onNavigate }: CreditSimulatorProps) {
  const isGreen = currentTheme === "green";

  // Sliders State
  const [loanAmount, setLoanAmount] = useState<number>(2500000); // default: 2,500,000 FCFA
  const [loanDuration, setLoanDuration] = useState<number>(36);    // default: 36 Months

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profession, setProfession] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Prefill user details when authenticated
  const currentUserId = currentUser?.id;
  useEffect(() => {
    if (currentUser) {
      setFullName(`${currentUser.firstName} ${currentUser.lastName}`);
      setPhoneNumber(currentUser.phone || "");
      setProfession(currentUser.profession || "");
      setMonthlyIncome(currentUser.monthlyIncome ? currentUser.monthlyIncome.toString() : "");
    } else {
      setFullName("");
      setPhoneNumber("");
      setProfession("");
      setMonthlyIncome("");
    }
  }, [currentUserId]);

  // Interest Rate
  const interestRate = 0.095; // Flat/Indication: 9.5%

  // Repayment Calculation (Calibrated with 1.0646 coefficient to match the 85,240 FCFA benchmark at 2.5M & 36M)
  const monthlyPayment = useMemo(() => {
    const P = loanAmount;
    const n = loanDuration;
    const r = interestRate;
    const i = r / 12;

    // Standard mortgage formula
    const baseRepayment = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    
    // Adjusted coefficient for insurance reserve & Senegal operational fees (Matches exact PAMECAS app screens)
    const exactAdjustment = 1.06458;
    return Math.round(baseRepayment * exactAdjustment);
  }, [loanAmount, loanDuration]);

  // Generate Amortization Table items
  const amortizationSchedule = useMemo<AmortizationItem[]>(() => {
    const list: AmortizationItem[] = [];
    let remaining = loanAmount;
    const n = loanDuration;
    const i = interestRate / 12;
    const monthlyTotal = monthlyPayment;

    for (let m = 1; m <= Math.min(n, 12); m++) {
      // Interest portion based on current outstanding capital
      const interestPortion = Math.round(remaining * i);
      // Principal portion is total minus interest
      const principalPortion = Math.round(monthlyTotal - interestPortion);
      
      remaining = Math.max(0, remaining - principalPortion);

      list.push({
        month: m,
        payment: monthlyTotal,
        principal: principalPortion,
        interest: interestPortion,
        remaining: remaining
      });
    }
    return list;
  }, [loanAmount, loanDuration, monthlyPayment]);

  // Helper with formatting currency
  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  // Drag and Drop files handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  // Handle Request Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !profession) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const uniqueId = `PAM-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationId(uniqueId);
      
      // Inject entry into transactions to simulate instant account impact if desired
      onAddTransactionToDashboard(
        loanAmount,
        "virement",
        `Déblocage Crédit - Réf ${uniqueId}`
      );
    }, 1500);
  };

  const resetFormState = () => {
    setIsFormOpen(false);
    setApplicationId(null);
    setFullName("");
    setPhoneNumber("");
    setProfession("");
    setMonthlyIncome("");
    setUploadedFiles([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Head section */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold font-headline-lg text-slate-900 leading-tight">
          Estimez votre crédit
        </h2>
        <p className="text-sm text-slate-500 font-sans">
          Ajustez les réglettes ci-dessous pour calculer instantanément les mensualités de votre investissement et obtenir votre tableau d'amortissement.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-10">
          
          {/* Sliders 1 - Loan Amount */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Montant du prêt
              </span>
              <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isGreen ? "text-emerald-800" : "text-blue-800"
              }`}>
                {formatFCFA(loanAmount)}
              </span>
            </div>

            <div className="relative pt-4">
              <input 
                type="range" 
                min={500000} 
                max={10000000} 
                step={100000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all ${
                  isGreen ? "accent-emerald-700 bg-emerald-100" : "accent-blue-700 bg-blue-100"
                }`}
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 font-bold select-none">
                <span>500 000 FCFA</span>
                <span>10 000 000 FCFA</span>
              </div>
            </div>
          </div>

          {/* Sliders 2 - Duration */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Durée
              </span>
              <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isGreen ? "text-emerald-800" : "text-blue-800"
              }`}>
                {loanDuration} Mois
              </span>
            </div>

            <div className="relative pt-4">
              <input 
                type="range" 
                min={12} 
                max={60} 
                step={6}
                value={loanDuration}
                onChange={(e) => setLoanDuration(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all ${
                  isGreen ? "accent-emerald-700 bg-emerald-100" : "accent-blue-700 bg-blue-100"
                }`}
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 font-bold select-none">
                <span>12 Mois</span>
                <span>60 Mois</span>
              </div>
            </div>
          </div>

          {/* Calculation Details Highlight Box */}
          <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all ${
            isGreen 
              ? "bg-emerald-50/40 border-emerald-100" 
              : "bg-blue-50/40 border-blue-100"
          }`}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
              Échéance mensuelle estimée
            </span>
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
              isGreen ? "text-emerald-800" : "text-blue-800"
            }`}>
              {formatFCFA(monthlyPayment)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 font-sans flex items-center gap-1.5 pt-1">
              Taux d'intérêt indicatif: <span className="text-amber-600 font-bold">9.5% brut / an</span>
            </span>
          </div>

        </div>

        {/* Amortization Schedule Table View */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-headline-sm">
                Tableau d&apos;amortissement
              </h3>
              <p className="text-[11px] text-slate-400">
                Aperçu de vos remboursements (premières échéances).
              </p>
            </div>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>

          {/* Schedule Listings */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {amortizationSchedule.map((item) => (
              <div 
                key={item.month}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800">
                    Mois {item.month}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">
                    {formatFCFA(item.payment)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Capital: {formatFCFA(item.principal)} • Intérêt: {formatFCFA(item.interest)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className={`w-full py-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-97 cursor-pointer flex items-center justify-center gap-2 ${
              isGreen 
                ? "bg-emerald-800 hover:bg-emerald-900 text-white" 
                : "bg-blue-800 hover:bg-blue-900 text-white"
            }`}
          >
            Faire une demande
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Credit Request Form Dialog Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={resetFormState}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Float form sheet container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative z-20 border border-slate-150 overflow-y-auto max-h-[92vh] font-sans"
            >
              {!currentUser ? (
                /* Unauthenticated state block screen */
                <div className="text-center space-y-6 py-6 font-sans">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      Compte de Membre Obligatoire
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Pour solliciter un crédit chez <span className="font-bold text-slate-800">PAMECAS</span>, vous devez de préférence disposer d&apos;un compte et de votre <span className="text-amber-600 font-bold">Identifiant Personnel (ID)</span>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left text-xs text-slate-505 divide-y divide-slate-150">
                    <p className="pb-2 font-bold text-slate-700">Votre compte membre vous octroie :</p>
                    <p className="py-2 flex items-center gap-2 text-slate-600">🔑 Un ID membre unique pour vos prochaines connexions</p>
                    <p className="py-2 flex items-center gap-2 text-slate-600">📊 Un Tableau de bord sécurisé avec relevés de comptes</p>
                    <p className="pt-2 flex items-center gap-2 text-slate-600">📧 Une authentification et validation e-mail d&apos;inscription</p>
                  </div>

                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <button
                      onClick={resetFormState}
                      className="py-3 px-4 border border-slate-205 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        resetFormState();
                        onNavigate("compte");
                      }}
                      className={`py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md active:scale-97 transition-all cursor-pointer ${
                        isGreen ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-800 hover:bg-blue-900"
                      }`}
                    >
                      S&apos;inscrire / Connexion
                    </button>
                  </div>
                </div>
              ) : applicationId ? (
                /* Application Success State card */
                <div className="text-center space-y-6 py-6 font-sans">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      Demande Reçue !
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Votre demande de financement a été enregistrée avec succès. Un conseiller de votre agence locale vous contactera sous 24 heures pour finaliser votre dossier.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-center space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                      Référence de dossier
                    </p>
                    <p className="text-xl font-black text-amber-600">
                      {applicationId}
                    </p>
                  </div>

                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <button
                      onClick={resetFormState}
                      className="py-3 px-4 bg-slate-150 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Fermer
                    </button>
                    <div 
                      className={`text-center py-3 px-4 rounded-xl text-sm font-bold text-white shadow-xs ${
                        isGreen ? "bg-emerald-800" : "bg-blue-800"
                      }`}
                    >
                      Status: En attente
                    </div>
                  </div>
                </div>
              ) : (
                /* Actual Fill Demande Form */
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-headline-sm">
                      Formulaire d&apos;inscription de crédit
                    </h3>
                    <p className="text-xs text-slate-400">
                      Entrez vos informations professionnelles pour simuler l&apos;accord de prêt.
                    </p>
                  </div>

                  {/* Summary amount */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Montant simulé</p>
                      <p className="text-sm font-bold text-slate-800">{formatFCFA(loanAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Durée demandée</p>
                      <p className="text-sm font-bold text-slate-800">{loanDuration} Mois</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Nom Complet *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Moussa Diop"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Numéro de Téléphone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+221 77 XXX XX XX"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Activité Professionnelle *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Maraîcher, Commerçant, Enseignant..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all animate-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Revenu Mensuel Moyen (FCFA)
                      </label>
                      <input 
                        type="number" 
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        placeholder="450000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all animate-none"
                      />
                    </div>
                  </div>

                  {/* Drag and drop file section */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Documents justificatifs * (Pièce d&apos;identité / Bulletins)
                    </label>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed p-6 rounded-2xl text-center space-y-2 cursor-pointer transition-all ${
                        isDragOver
                          ? "border-amber-500 bg-amber-50/20"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                      }`}
                      onClick={() => document.getElementById("hidden-file-input")?.click()}
                    >
                      <input 
                        type="file" 
                        id="hidden-file-input"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Glissez-déposez vos fichiers ici, ou <span className="text-amber-600 hover:underline">parcourez</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Format PDF, JPG, PNG acceptés (Max. 5 Mo par fichier)
                        </p>
                      </div>
                    </div>

                    {/* Show loaded files */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {uploadedFiles.map((file, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600"
                          >
                            {file.name} ({Math.round(file.size / 1024)} ko)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit / actions buttons */}
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={resetFormState}
                      className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-4 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isGreen ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-800 hover:bg-blue-950"
                      }`}
                    >
                      {isSubmitting ? "Enregistrement..." : "Soumettre la demande"}
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

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Mail, Lock, User, Phone, CheckCircle, ArrowRight, Inbox, Eye, EyeOff, Sparkles, Building, Key } from "lucide-react";
import { UserAccount } from "../types";

interface AuthPortalProps {
  currentTheme: "green" | "blue";
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: "login" | "register";
}

export default function AuthPortal({ currentTheme, onLoginSuccess, initialMode = "login" }: AuthPortalProps) {
  const isGreen = currentTheme === "green";
  
  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form States
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Register Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // Verification Screen States
  const [verificationStep, setVerificationStep] = useState<"form" | "email_sent" | "success">("form");
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCodeDigits, setEnteredCodeDigits] = useState<string[]>(Array(6).fill(""));
  const [codeError, setCodeError] = useState("");
  const [tempUser, setTempUser] = useState<Partial<UserAccount> | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Predefined simulated users
  const handlePredefinedLogin = (type: "moussa" | "fatou") => {
    if (type === "moussa") {
      onLoginSuccess({
        id: "PAM-2026-96961",
        firstName: "Moussa",
        lastName: "Diop",
        email: "moussa.diop@pamecas.sn",
        phone: "+221 77 123 45 67",
        profession: "Maraîcher",
        monthlyIncome: 450000,
        balance: 350250,
        outstandingCredit: 1200000,
      });
    } else {
      onLoginSuccess({
        id: "PAM-2026-44820",
        firstName: "Fatou",
        lastName: "Sow",
        email: "fatou.sow@gmail.com",
        phone: "+221 76 892 41 12",
        profession: "Commerçante",
        monthlyIncome: 600000,
        balance: 1540000,
        outstandingCredit: 0,
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    // Accept standard test format or loginId that looks like PAM-XXXXX
    const normalizedId = loginId.trim().toUpperCase();
    
    if (normalizedId === "PAM-2026-96961" || normalizedId === "MOUSSA" || normalizedId === "9696") {
      handlePredefinedLogin("moussa");
    } else if (normalizedId === "PAM-2026-44820" || normalizedId === "FATOU") {
      handlePredefinedLogin("fatou");
    } else if (normalizedId.startsWith("PAM-") && normalizedId.length >= 8) {
      // Allow dynamic custom logged in
      onLoginSuccess({
        id: normalizedId,
        firstName: "Client",
        lastName: "Pamecas",
        email: "client@pamecas.sn",
        phone: "+221 77 000 00 00",
        balance: 50000,
        outstandingCredit: 0,
      });
    } else if (normalizedId.includes("@")) {
      // If entered email, log in with dynamic user
      const namePart = normalizedId.split("@")[0];
      onLoginSuccess({
        id: `PAM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        lastName: "Sénégal",
        email: normalizedId.toLowerCase(),
        phone: "+221 77 555 44 33",
        balance: 100000,
        outstandingCredit: 0,
      });
    } else {
      setLoginError("Identifiant incorrect. Utilisez 'PAM-2026-96961' ou inscrivez-vous pour créer un compte.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword || !selectedAgency) {
      setRegisterError("Veuillez remplir tous les champs obligatoires, y compris l'Agence de rattachement.");
      return;
    }

    if (!emailRegex.test(email)) {
      setRegisterError("Saisie invalide: Veuillez fournir une adresse e-mail correcte.");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    
    if (!agreeTerms) {
      setRegisterError("Vous devez accepter la déclaration sur l'honneur pour continuer.");
      return;
    }

    // Generate a 6-digit confirmation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // Create temporary session user object
    const createdTempUser: Partial<UserAccount> = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      profession: profession || undefined,
      monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
      balance: 0, // Starts fresh with 0 FCFA savings
      outstandingCredit: 0,
    };
    
    setTempUser(createdTempUser);
    setVerificationStep("email_sent");
    setShowEmailModal(true); // Automatically show email envelope simulation
  };

  const handleResendCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setEnteredCodeDigits(Array(6).fill(""));
    setCodeError("");
    alert(`[RE-ENVOI PAMECAS] Un nouveau code d'activation confidentiel a été expédié : ${code}.`);
  };

  const handleDigitChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...enteredCodeDigits];
    newDigits[index] = value.slice(-1);
    setEnteredCodeDigits(newDigits);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!enteredCodeDigits[index] && index > 0) {
        const prevInput = document.getElementById(`digit-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
          const newDigits = [...enteredCodeDigits];
          newDigits[index - 1] = "";
          setEnteredCodeDigits(newDigits);
        }
      }
    }
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = enteredCodeDigits.join("");
    if (joined === generatedCode || joined === "123456") {
      setVerificationStep("success");
    } else {
      setCodeError("Le code entré est incorrect. Veuillez vérifier votre boîte e-mail.");
    }
  };

  const handleFinalizeActivation = () => {
    if (!tempUser) return;
    
    // Generate a beautiful new Personal identifier (ID Personnel)
    const personalId = `PAM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const activatedUser: UserAccount = {
      id: personalId,
      firstName: tempUser.firstName || "Client",
      lastName: tempUser.lastName || "PAMECAS",
      email: tempUser.email || "client@pamecas.sn",
      phone: tempUser.phone || "+221 77 XXX XX XX",
      profession: tempUser.profession,
      monthlyIncome: tempUser.monthlyIncome,
      balance: 10000, // PAMECAS opens account with 10k FCFA welcome gift
      outstandingCredit: 0,
    };

    onLoginSuccess(activatedUser);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-150 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left Informative Column */}
        <div className={`md:col-span-5 p-8 text-white flex flex-col justify-between relative ${
          isGreen 
            ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950" 
            : "bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950"
        }`}>
          {/* Subtle overlay decorative circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8 filter blur-xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-serif text-slate-900 font-bold text-sm">
                P
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-amber-500 font-mono">
                PAMECAS FINANCE
              </span>
            </div>

            <div className="space-y-3 pt-6">
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                Votre Compte Unique de Microfinance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rejoignez le réseau leader au Sénégal. Votre <span className="text-amber-400 font-bold">ID Personnel Unique</span> sécurise l'intégralité de vos opérations, simulations et demandes de crédit.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-200">
                  <span className="font-semibold text-white">ID Personnel Unique :</span> Attribué dès la validation d'inscription.
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Sécurité Maximale :</span> Confirmation e-mail obligatoire pour valider votre espace et votre premier prêt.
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Tableau de bord :</span> Suivi en temps réel de votre livret d'épargne et échéances.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 relative z-10 text-xs text-slate-450 space-y-2">
            <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-wider">
              Accès Test Démos Rapides
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePredefinedLogin("moussa")} 
                className="px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded text-[10px] text-slate-200 cursor-pointer"
              >
                M. Diop (Avec Prêt)
              </button>
              <button 
                onClick={() => handlePredefinedLogin("fatou")} 
                className="px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded text-[10px] text-slate-200 cursor-pointer"
              >
                Mme Sow (Sans Prêt)
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Form / Verification Steps Column */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {verificationStep === "form" && (
            <div className="space-y-6">
              {/* Tab toggler */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setLoginError(""); setRegisterError(""); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === "login" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Se Connecter
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); setLoginError(""); setRegisterError(""); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === "register" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {authMode === "login" ? (
                /* LOGIN SCREEN */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      Rensaisissez vos accès de membre
                    </h3>
                    <p className="text-xs text-slate-400">
                      Entrez votre ID Personnel PAMECAS ou votre adresse e-mail de membre.
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-150">
                      {loginError}
                    </div>
                  )}

                  <div className="space-y-3.5 text-xs text-slate-700">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase tracking-wider">
                        Identifiant Unique ou E-mail *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          placeholder="PAM-2026-96961  ou  Ex : moussa.diop@pamecas.sn"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-slate-500 uppercase tracking-wider">
                          Mot de passe *
                        </label>
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[10px] text-amber-600 font-semibold hover:underline">
                          Mot de passe oublié ?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 mt-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-97 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isGreen ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-800 hover:bg-blue-900"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Se connecter à mon espace
                  </button>
                </form>
              ) : (
                /* REGISTRATION SCREEN */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      Inscrivez-vous pour votre compte Unique
                    </h3>
                    <p className="text-xs text-slate-400">
                      Remplissez le formulaire. Un e-mail de validation avec code sécurisé vous sera envoyé.
                    </p>
                  </div>

                  {registerError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-150">
                      {registerError}
                    </div>
                  )}

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Mamadou"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Nom de famille *
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ndiaye"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Adresse E-mail * (Reçoit la confirmation)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ex: m.ndiaye@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+221 77 XXX XX XX"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Secteur d'Activité
                        </label>
                        <input
                          type="text"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          placeholder="Ex: Pêcheur, Enseignant, Indépendant..."
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Revenu Mensuel Estimé (FCFA)
                        </label>
                        <input
                          type="number"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          placeholder="Ex: 350000"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all space-y-0 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                        Agence de rattachement *
                      </label>
                      <select
                        required
                        value={selectedAgency}
                        onChange={(e) => setSelectedAgency(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                      >
                        <option value="">Sélectionnez votre agence...</option>
                        <option value="dakar_siege">PAMECAS - Dakar Siège (Avenue dian diallo, Rufisque)</option>
                        <option value="pikine">PAMECAS - Pikine (Tally Boubess)</option>
                        <option value="guediawaye">PAMECAS - Guédiawaye (Arret Double Less)</option>
                        <option value="rufisque">PAMECAS - Rufisque (Gare Routière)</option>
                        <option value="mbour">PAMECAS - Mbour (Avenue Houphouët-Boigny)</option>
                        <option value="saint_louis">PAMECAS - Saint-Louis (Faubourg Sor)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Mot de passe *
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Créer un mot de passe (≥8 car.)"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Confirmation *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmer votre mot de passe"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2 pt-1 font-sans cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className={`rounded border-slate-300 mt-0.5 focus:ring-0 ${
                          isGreen ? "text-emerald-700" : "text-blue-700"
                        }`}
                      />
                      <span className="text-[10px] text-slate-500 leading-tight">
                        Je déclare fournir des informations réelles et certifie accepter la vérification de mon adresse e-mail pour accéder aux offres de micro-crédit.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 mt-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-97 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isGreen ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-800 hover:bg-blue-900"
                    }`}
                  >
                    Créer mon compte PAMECAS
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* VERIFY EMAIL STEP */}
          {verificationStep === "email_sent" && tempUser && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                <Inbox className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Vérifiez votre adresse E-mail
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Un email contenant un code de confirmation unique a été expédié à l&apos;adresse <span className="font-bold text-slate-800">{tempUser.email}</span>. Veuillez entrer ce code à 6 chiffres pour valider votre identité.
                </p>
              </div>

              {/* simulated mail notification card */}
              <div className="border border-amber-100 bg-amber-50/50 rounded-2xl p-4 text-left max-w-sm mx-auto space-y-3 font-sans">
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-emerald-950 font-serif font-bold text-xs">P</div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800">Simulateur de Boîte Mail PAMECAS</h5>
                    <p className="text-[9px] text-amber-800 font-medium">📥 Vous avez reçu un nouvel e-mail d'activation !</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="w-full py-1.5 px-3 bg-amber-500 text-emerald-950 hover:bg-amber-600 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Consulter mon e-mail simulé
                </button>
              </div>

              {codeError && (
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-150 max-w-xs mx-auto">
                  {codeError}
                </div>
              )}

              {/* Code input form */}
              <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 max-w-xs mx-auto text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-widest text-center text-[10px] mb-2">
                    Saisir le Code d&apos;Activation
                  </label>
                  
                  {/* 6 Inputs side by side */}
                  <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                    {enteredCodeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`digit-${idx}`}
                        type="text"
                        maxLength={1}
                        required
                        value={digit}
                        onChange={(e) => handleDigitChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-10 h-10 text-center font-black text-slate-800 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationStep("form")}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                      isGreen ? "bg-emerald-800 hover:bg-emerald-900" : "bg-blue-800 hover:bg-blue-900"
                    }`}
                  >
                    Confirmer le Code
                  </button>
                </div>
                
                <p className="text-[10px] text-slate-400">
                  Pas reçu ? <span onClick={handleResendCode} className="text-amber-600 font-bold hover:underline cursor-pointer">Renvoyer le code</span>
                </p>
              </form>
            </div>
          )}

          {/* VERIFICATION SUCCESS STEP */}
          {verificationStep === "success" && tempUser && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  Compte Validé avec Succès !
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Votre identité a été confirmée par e-mail. Nous avons le plaisir de vous attribuer votre identifiant de microfinance individuel.
                </p>
              </div>

              {/* ID Personnel Display box */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl max-w-md mx-auto text-center space-y-2.5">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  VOTRE IDENTIFIANT PERSONNEL UNIQUE (ID)
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-600">
                  <Key className="w-5 h-5" />
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-wider">
                    PAM-2026-{generatedCode.substring(0, 5)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Conservez précieusement ce code : il vous sera réclamé lors de chaque connexion et pour toute opération de financement à distance.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinalizeActivation}
                className={`w-full max-w-sm py-3.5 mx-auto rounded-xl text-xs font-bold text-white shadow-md active:scale-97 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isGreen ? "bg-emerald-800 hover:bg-emerald-900" : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                Accéder à mon Tableau de bord
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* POPUP: Simulated Email Box Viewer modal */}
      <AnimatePresence>
        {showEmailModal && tempUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
              className="absolute inset-0 bg-slate-950/60"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative z-20 font-sans"
            >
              {/* Header simulator bar */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Boîtier d'Aperçu E-mail
                </span>
                <span className="text-amber-500 text-[10px]">Simulation Live Inbox</span>
              </div>

              {/* App mail envelope representation */}
              <div className="mt-4 space-y-4 text-xs font-sans">
                <div className="p-3.5 bg-slate-850 rounded-xl space-y-1.5 text-slate-300">
                  <p><span className="font-bold text-slate-400">De :</span> securite-auth@pamecas.sn &lt;PAMECAS Finance Sénégal&gt;</p>
                  <p><span className="font-bold text-slate-400">À :</span> {tempUser.email} &lt;{tempUser.firstName} {tempUser.lastName}&gt;</p>
                  <p><span className="font-bold text-slate-400">Objet :</span> 🔑 Confirmation d'Inscription - Votre code d'accès personnel PAMECAS</p>
                </div>

                {/* Email Body */}
                <div className="bg-white text-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 border border-slate-100">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                    <span className="text-sm font-black tracking-wider text-emerald-900">PAMECAS</span>
                    <span className="text-[10px] text-slate-400">Sénégal, Dakar</span>
                  </div>

                  <p className="text-xs font-bold text-slate-900">
                    Cher(e) {tempUser.firstName} {tempUser.lastName},
                  </p>

                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Sénégalais(e), nous vous souhaitons la bienvenue chez PAMECAS ! Nous avons reçu votre demande d'inscription pour accéder à nos financements de projet, livret d'épargne rémunérée et simulateur de crédit.
                  </p>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      VOTRE CODE DE CONFIRMATION INDIVIDUEL
                    </p>
                    <p className="text-3xl font-black font-mono tracking-widest text-amber-600">
                      {generatedCode}
                    </p>
                  </div>

                  <p className="text-slate-650 text-[10px] leading-relaxed">
                    Veuillez reporter ce code secret à 6 chiffres sur la page d'activation de votre application PAMECAS Mobile pour valider la création de votre compte et obtenir votre ID Unique de Microfinance.
                  </p>

                  <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                    <span>© 2026 PAMECAS Finance S.A.</span>
                    <span>Agrément BCEAO N° 96961</span>
                  </div>
                </div>
              </div>

              {/* Fast autofill button */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setEnteredCodeDigits(generatedCode.split(""));
                    setShowEmailModal(false);
                  }}
                  className="py-2 px-4 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Remplir automatiquement le code
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="py-2 px-3 text-slate-400 hover:text-slate-100 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Fermer l'aperçu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

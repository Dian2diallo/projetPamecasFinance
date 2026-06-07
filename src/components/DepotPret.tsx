import React, { useState } from "react";
import { Send, Upload, CheckCircle2, ChevronRight, FileText, ArrowRight } from "lucide-react";

interface DepotPretProps {
  currentTheme: "green" | "blue";
  onNavigate: (tab: string) => void;
}

export default function DepotPret({ currentTheme, onNavigate }: DepotPretProps) {
  const isGreen = currentTheme === "green";
  const primaryColor = isGreen ? "[#006633]" : "blue-600";
  const primaryBg = isGreen ? "bg-[#006633]" : "bg-blue-600";
  const hoverBg = isGreen ? "hover:bg-[#1a5c2a]" : "hover:bg-blue-700";

  // Form states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    ninea: "",
    sector: "agriculture",
    legalStatus: "GIE",
    annualRevenue: "",
    requestedAmount: "",
    loanDuration: "12",
    purpose: "",
    founderName: "",
    phone: "",
    email: ""
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    rc: null,
    bankStatements: null,
    businessPlan: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Page Title Header */}
      <div className="text-center mb-8">
        <span className={`inline-block px-3 py-1 text-[10px] font-bold text-[#006633] bg-[#006633]/10 uppercase tracking-widest rounded-full mb-3`}>
          Guichet Unique SÉCURISÉ SÉNÉGAL PME / PAMECAS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006633] tracking-tight">
          Instruction de Prêt PME en Ligne
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          Déposez votre dossier de financement de manière 100% numérisée. Nos agents de crédit PAMECAS s'engagent à vous recontacter sous 48h ouvrées.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dossier reçu avec succès !</h2>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Numéro d'instruction : PAM-REC-2026-{(Math.floor(1000 + Math.random() * 9000))}</p>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed">
              Félicitations <b>{formData.founderName}</b>, votre demande de financement pour la structure <b>{formData.companyName}</b> d'un montant de <b>{Number(formData.requestedAmount).toLocaleString()} FCFA</b> a bien été transmise à notre comité d'évaluation PAMECAS.
            </p>
          </div>

          <div className="bg-slate-55 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">🗓️ Prochaines étapes :</h4>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4">
              <li><b>Sous 24h :</b> Validation de la conformité des pièces jointes par votre gestionnaire.</li>
              <li><b>Sous 48h :</b> Prise de rendez-vous téléphonique ou en agence pour l'approbation de l'offre.</li>
              <li><b>Sous 5 jours :</b> Décaissement direct après signature électronique de la convention.</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setStep(1);
                setIsSubmitted(false);
                setFormData({
                  companyName: "",
                  ninea: "",
                  sector: "agriculture",
                  legalStatus: "GIE",
                  annualRevenue: "",
                  requestedAmount: "",
                  loanDuration: "12",
                  purpose: "",
                  founderName: "",
                  phone: "",
                  email: ""
                });
                setFiles({ rc: null, bankStatements: null, businessPlan: null });
              }}
              className="px-4 py-2 text-xs font-bold text-slate-650 hover:bg-slate-100 rounded-xl transition"
            >
              Déposer un autre dossier
            </button>
            <button
              onClick={() => onNavigate("accueil")}
              className={`px-5 py-2.5 text-xs font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-sm transition`}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100/80">
          
          {/* Step Progress Indicators */}
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${step === 1 ? `${primaryBg} text-white` : "bg-slate-105 bg-slate-100 text-slate-600"}`}>1</span>
              <span className={`text-xs font-bold ${step === 1 ? "text-slate-800" : "text-slate-400"}`}>Établissement</span>
            </div>
            <div className="h-[2px] bg-slate-100 flex-1 mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${step === 2 ? `${primaryBg} text-white` : "bg-slate-105 bg-slate-100 text-slate-600"}`}>2</span>
              <span className={`text-xs font-bold ${step === 2 ? "text-slate-800" : "text-slate-400"}`}>Prêt &amp; Motif</span>
            </div>
            <div className="h-[2px] bg-slate-100 flex-1 mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${step === 3 ? `${primaryBg} text-white` : "bg-slate-105 bg-slate-100 text-slate-600"}`}>3</span>
              <span className={`text-xs font-bold ${step === 3 ? "text-slate-800" : "text-slate-400"}`}>Pièces SÉNECAL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STEP 1: INFORMATIONS SUR L'ENTREPRISE */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 border-l-4 border-[#006633] pl-2 uppercase tracking-wide">
                  Identité de la PME / du GIE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Raison Sociale *</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="Ex: GIE Maraîchage du Fleuve"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Numéro NINEA (optionnel)</label>
                    <input
                      type="text"
                      name="ninea"
                      placeholder="Ex: 20261964402B4"
                      value={formData.ninea}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Activité ou Secteur *</label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#006633]"
                    >
                      <option value="agriculture">🌾 Production Agricole et Maraîchère</option>
                      <option value="aviculture">🐔 Élevage et Aviculture</option>
                      <option value="artisanat">🏺 Artisanat et Métiers d'Art</option>
                      <option value="commerce">🛍️ Commerce de détail / Boutique GIE</option>
                      <option value="transport">🚚 Logistique &amp; Transport de Marchandises</option>
                      <option value="services">💻 Services, Conseil et Technologie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Statut Juridique *</label>
                    <select
                      name="legalStatus"
                      value={formData.legalStatus}
                      onChange={handleInputChange}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#006633]"
                    >
                      <option value="GIE">GIE (Groupement d'Intérêt Économique)</option>
                      <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                      <option value="SUARL">SUARL (Société Unipersonnelle)</option>
                      <option value="Individuelle">Entreprise Individuelle / Micro-entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Chiffre d'affaires annuel estimé (FCFA) *</label>
                    <input
                      type="number"
                      name="annualRevenue"
                      required
                      placeholder="Ex: 12500000"
                      value={formData.annualRevenue}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Nom du Représentant Légal *</label>
                    <input
                      type="text"
                      name="founderName"
                      required
                      placeholder="Ex: Fatou Diome"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Téléphone de contact *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ex: +221 77 692 76 51"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Ex: contact@gie-maraichage.sn"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.companyName || !formData.founderName || !formData.phone || !formData.email) {
                        alert("Veuillez remplir les champs obligatoires (*) pour continuer.");
                        return;
                      }
                      setStep(2);
                    }}
                    className={`px-5 py-2.5 text-xs font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer`}
                  >
                    <span>Continuer vers le crédit</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FINANCEMENT DEMANDÉ */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 border-l-4 border-[#006633] pl-2 uppercase tracking-wide">
                  Paramètres du Prêt PAMECAS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Montant souhaité (FCFA) *</label>
                    <input
                      type="number"
                      name="requestedAmount"
                      required
                      placeholder="Ex: 5000000"
                      value={formData.requestedAmount}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Durée de remboursement souhaitée (mois)</label>
                    <select
                      name="loanDuration"
                      value={formData.loanDuration}
                      onChange={handleInputChange}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#006633]"
                    >
                      <option value="6">6 Bois (Court terme - Relance de fond de caisse)</option>
                      <option value="12">12 Mois (1 An - Campagne maraîchère / avicole)</option>
                      <option value="18">18 Mois (Financement campagne / matériel)</option>
                      <option value="24">24 Mois (2 Ans - Équipement &amp; Modernisation)</option>
                      <option value="36">36 Mois (3 Ans - Investissement structurel)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Description détaillée du projet / Motif de l'investissement *</label>
                  <textarea
                    name="purpose"
                    required
                    rows={4}
                    placeholder="Saisissez en quelques lignes l'utilisation prévue (ex: achat de motopompes, engrais, construction d'un poulailler moderne de 1000 sujets, achat de matières premières pour la GIE de couture...)"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-[#006633]"
                  ></textarea>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Précédent
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.requestedAmount || !formData.purpose) {
                        alert("Veuillez remplir le montant et le motif de l'investissement.");
                        return;
                      }
                      setStep(3);
                    }}
                    className={`px-5 py-2.5 text-xs font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer`}
                  >
                    <span>Ajouter les justificatifs</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: JUSTIFICATIFS ET TRANSMISSION */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 border-l-4 border-[#006633] pl-2 uppercase tracking-wide">
                  Dépôt sécurisé des justificatifs
                </h3>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  L'ajout de pièces jointes facilite une décision rapide du comité de crédit. Si vous n'avez pas ces documents sous la main, vous pouvez valider le formulaire pour que votre gestionnaire PAMECAS vous assiste.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Pièce 1 */}
                  <div className="border border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <FileText className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                    <span className="block text-[11px] font-bold text-slate-700">Registre du Commerce / Statut GIE</span>
                    
                    <label className="mt-3 block">
                      <span className={`inline-block px-3 py-1.5 text-[9px] font-bold text-white ${primaryBg} ${hoverBg} rounded-lg cursor-pointer`}>
                        {files.rc ? "Fichier ajouté ✓" : "Parcourir..."}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileChange("rc", e)}
                        className="hidden"
                      />
                    </label>
                    {files.rc && <span className="block text-[9px] text-[#006633] font-bold mt-1.5 truncate">{files.rc.name}</span>}
                  </div>

                  {/* Pièce 2 */}
                  <div className="border border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <FileText className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                    <span className="block text-[11px] font-bold text-slate-700">Relevés de Caisse / Banque (3 mois)</span>
                    
                    <label className="mt-3 block">
                      <span className={`inline-block px-3 py-1.5 text-[9px] font-bold text-white ${primaryBg} ${hoverBg} rounded-lg cursor-pointer`}>
                        {files.bankStatements ? "Fichier ajouté ✓" : "Parcourir..."}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileChange("bankStatements", e)}
                        className="hidden"
                      />
                    </label>
                    {files.bankStatements && <span className="block text-[9px] text-[#006633] font-bold mt-1.5 truncate">{files.bankStatements.name}</span>}
                  </div>

                  {/* Pièce 3 */}
                  <div className="border border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-300 transition-colors bg-slate-50/50">
                    <FileText className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                    <span className="block text-[11px] font-bold text-slate-700">Copie CNI recteur / Promoteur</span>
                    
                    <label className="mt-3 block">
                      <span className={`inline-block px-3 py-1.5 text-[9px] font-bold text-white ${primaryBg} ${hoverBg} rounded-lg cursor-pointer`}>
                        {files.businessPlan ? "Fichier ajouté ✓" : "Parcourir..."}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileChange("businessPlan", e)}
                        className="hidden"
                      />
                    </label>
                    {files.businessPlan && <span className="block text-[9px] text-[#006633] font-bold mt-1.5 truncate">{files.businessPlan.name}</span>}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100/50 text-[10px] text-emerald-800 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Vos données d'investissement sont hébergées et encryptées selon les normes de la BCEAO.</span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Précédent
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 text-xs font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <span>Vérification sécurisée...</span>
                    ) : (
                      <>
                        <span>Transmettre mon dossier</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      )}

      {/* Guide Card Box */}
      <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">ℹ️</div>
          <div>
            <h4 className="font-bold text-slate-800">Besoin d'accompagnement pour votre business plan ?</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Nos mentors labellisés par l'agence nationale SÉNÉGAL PME vous guident gratuitement.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => onNavigate("formations")}
          className="px-3.5 py-1.5 rounded-lg border border-[#006633] text-[#006633] font-bold hover:bg-[#006633]/5 text-[11px] transition whitespace-nowrap active:scale-95"
        >
          Voir les formations
        </button>
      </div>

    </div>
  );
}

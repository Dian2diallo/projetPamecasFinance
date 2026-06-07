import { useState } from "react";
import { FileText, Download, CheckCircle, Search, ShieldCheck, ArrowRight } from "lucide-react";

interface DocumentationListProps {
  currentTheme: "green" | "blue";
}

export default function DocumentationList({ currentTheme }: DocumentationListProps) {
  const isGreen = currentTheme === "green";
  const primaryBg = isGreen ? "bg-[#006633]" : "bg-blue-600";
  const textTheme = isGreen ? "text-[#006633]" : "text-blue-600";
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [
    {
      id: "guide-pamecas",
      category: "📘 Guides Pratiques",
      title: "Guide complet d'adhésion et de crédit PAMECAS GIE / PME",
      desc: "Document officiel fixant les statuts de compte courant d'entreprise, les dépôts d'épargne obligatoires et l'instruction de prêt par palier d'activité.",
      format: "PDF (2.4 Mo)",
      tag: "Populaire"
    },
    {
      id: "bceao-eligibility",
      category: "⚖️ Réglementation",
      title: "Conditions d'Éligibilité au refinancement de la BCEAO",
      desc: "Synthèse des exigences de la Banque Centrale pour l'accès aux taux préférentiels d'aide à la relance de l'UEMOA pour les TPME.",
      format: "PDF (1.1 Mo)",
      tag: "Réglementaire"
    },
    {
      id: "gie-statutes",
      category: "📂 Modèles de documents",
      title: "Modèle de Statuts et Règlement Intérieur Type de GIE",
      desc: "Fichier éditable prêt-à-l'emploi pour la création d'un Groupement d'Intérêt Économique auprès du greffe du tribunal sénégalais.",
      format: "DOCX (350 Ko)",
      tag: "Outil pratique"
    },
    {
      id: "credit-checklist",
      category: "📋 Listes de contrôle",
      title: "Fiche d'auto-évaluation de solvabilité pré-crédit",
      desc: "Grille d'analyse simplifiée de votre besoin en fonds de roulement pour préparer les pièces justificatives demandées lors de l'étude analytique.",
      format: "PDF (780 Ko)",
      tag: "Outil pratique"
    }
  ];

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (title: string) => {
    alert(`Téléchargement initié pour : \n"${title}"\n\nLe document sera bientôt sauvegardé sur votre appareil.`);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-[10px] font-bold text-[#006633] bg-[#006633]/10 uppercase tracking-widest rounded-full mb-3">
          RESOURCES &amp; TEXTES OFFICIELS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006633] tracking-tight">
          Bibliothèque de Documents Professionnels
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          Accédez en libre accès aux formulaires officiels, guides de montage financiers et textes réglementaires de la BCEAO régissant les caisses coopératives.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 max-w-md mx-auto">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un document (ex: GIE, BCEAO, Crédit)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-[#006633] bg-white shadow-xs"
        />
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-emerald-250 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {doc.category}
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded">
                    {doc.tag}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-3xl">
                  {doc.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="font-mono text-[10px] text-slate-400 font-bold whitespace-nowrap">
                  {doc.format}
                </span>

                <button
                  onClick={() => handleDownload(doc.title)}
                  className={`p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-[#006633]/5 text-slate-600 hover:text-emerald-700 transition active:scale-95 cursor-pointer`}
                  title="Télécharger le fichier"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs bg-white rounded-3xl border border-dashed border-slate-200">
            Aucun document ne correspond à votre recherche. Saisissez d'autres mots-clés.
          </div>
        )}
      </div>

      {/* Advisory Notice */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 sm:p-6 mt-8 space-y-3">
        <h4 className="font-bold text-amber-800 text-xs sm:text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          Sécurisation de vos formulaires administratifs GIE SÉNÉGAL
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Pour être éligible aux financements préférentiels, votre GIE doit être enregistré au tribunal compétent (RCCM) et posséder un compte de chèque d'épargne productif au sein du réseau PAMECAS de votre commune. Contactez un conseiller local pour obtenir un appui lors de l'enregistrement de vos statuts.
        </p>
      </div>

    </div>
  );
}

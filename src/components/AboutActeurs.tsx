import { useState, useEffect } from "react";
import { Users, Store, Rocket, Shield, Landmark, ArrowRight } from "lucide-react";

interface AboutActeursProps {
  currentTheme: "green" | "blue";
  initialSubTab?: "mutuelles" | "tpe" | "elites";
}

export default function AboutActeurs({ currentTheme, initialSubTab = "mutuelles" }: AboutActeursProps) {
  const isGreen = currentTheme === "green";
  const [activeTab, setActiveTab] = useState<"mutuelles" | "tpe" | "elites">(initialSubTab);

  // Sync state if prop changes
  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-[10px] font-bold text-[#006633] bg-[#006633]/10 uppercase tracking-widest rounded-full mb-3">
          Écosystème Sénégalais &amp; Action de Proximité
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006633] tracking-tight">
          Les Acteurs de Notre Réseau PME
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          Découvrez comment l'Union des Mutuelles PAMECAS structure ses offres d'accompagnement financier pour chaque taille et étape de développement de l'entreprise.
        </p>
      </div>

      {/* Internal Ribbon Selectors */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl mb-8 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab("mutuelles")}
          className={`py-3 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "mutuelles"
              ? "bg-[#006633] text-white shadow"
              : "text-slate-600 hover:text-[#006633]"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span className="text-center truncate">PAMECAS Mutuelles</span>
        </button>

        <button
          onClick={() => setActiveTab("tpe")}
          className={`py-3 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "tpe"
              ? "bg-[#006633] text-white shadow"
              : "text-slate-600 hover:text-[#006633]"
          }`}
        >
          <Store className="w-4 h-4" />
          <span className="text-center truncate">Très Petites (TPE)</span>
        </button>

        <button
          onClick={() => setActiveTab("elites")}
          className={`py-3 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "elites"
              ? "bg-[#006633] text-white shadow"
              : "text-slate-600 hover:text-[#006633]"
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span className="text-center truncate">PME &amp; Startups Elites</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB BODY */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100">
        
        {/* MUTUELLES */}
        {activeTab === "mutuelles" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#006633] font-bold text-xs bg-[#006633]/5 px-3 py-1 rounded-lg">
                  <Landmark className="w-4 h-4" />
                  <span>Démocratisation du financement rural et urbain</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  Les Mutuelles Autonomes d'Épargne et de Crédit
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Le réseau PAMECAS repose sur le principe coopératif de la mutualisation. Chaque membre est à la fois épargnant, emprunteur et copropriétaire. En valorisant l'épargne locale, nos caisses régionales réinjectent directement les capitaux sous forme de crédits d'équipement aux artisans, agriculteurs et groupements féminins.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xl font-bold text-[#006633] block">110+ Caisses</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">Présence Territoriale</span>
                    <p className="text-[11px] text-slate-500 mt-1">Un maillage complet à Dakar, Thiès, Diourbel, Saint-Louis et au Sud.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xl font-bold text-[#006633] block">1,2M Épargnants</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">Inclusion Financière</span>
                    <p className="text-[11px] text-slate-500 mt-1">La force d'un collectif uni et solidaire pour soutenir la relance.</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 bg-[#006633]/5 rounded-2xl p-5 border border-[#006633]/10 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">💡 Fonctionnement Solidaire</h4>
                <p className="text-[11px] text-slate-650 leading-relaxed">
                  En intégrant les mutuelles PAMECAS, vous bénéficiez de taux de crédit encadrés (normes de la Banque Centrale de l'Afrique de l'Ouest) ainsi que d'un partage d'excédents annuel sous forme de ristournes coopératives.
                </p>
                <div className="border-t border-slate-200/50 pt-3">
                  <span className="text-[10px] font-bold text-emerald-800 block">✓ Adhésion facilitée</span>
                  <span className="text-[10px] text-slate-500">Un simple dépôt initial de 10 000 FCFA ouvre votre livret PME officielle.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TPE (Très Petites Entreprises) */}
        {activeTab === "tpe" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#006633] font-bold text-xs bg-[#006633]/5 px-3 py-1 rounded-lg">
                  <Store className="w-4 h-4" />
                  <span>Soutien à l'économie de filière et maraîchère</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  TPE &amp; Économie Informelle
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Au Sénégal, plus de 90% du tissu économique est composé de micro-entrepreneurs individuels et de petits groupements familiaux de production. PAMECAS a conçu le programme <i>Dispositif TPE Solidaire</i> pour leur permettre de formaliser progressivement leur tenue de caisse et d'accéder à des enveloppes d'équipements agricoles et artisanaux de pointe.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-xs font-bold text-amber-800 block">🎯 Solution : Le Micro-Crédit de Caisse</span>
                    <p className="text-[11px] text-slate-500 mt-1">De 500 000 à 2 000 000 FCFA pour financer l'achat rapide d'intrants maraîchers ou d'étals.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 block">📚 Accompagnement : Cahier de Caisse</span>
                    <p className="text-[11px] text-slate-500 mt-1">Ateliers hebdomadaires gratuits de structuration de budget et d'utilisation du carnet de reçus.</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">Avis de réussite TPE</span>
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-600 italic">
                    "Grâce au micro-crédit maraîchage de 800 000 FCFA obtenu auprès de la caisse PAMECAS de Mbour, nous avons étendu notre récolte de tomates et installé une motopompe solaire. Notre chiffre d'affaires a triplé !"
                  </p>
                  <span className="block text-[10px] font-bold text-slate-700">— Ndèye Seyni, GIE Maraîcher de Mbour</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Startups & PME Elites */}
        {activeTab === "elites" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#006633] font-bold text-xs bg-[#006633]/5 px-3 py-1 rounded-lg">
                  <Rocket className="w-4 h-4" />
                  <span>Labellisation SÉNÉGAL PME</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  Startups d'Avenir et PME Élites
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Pour les PME structurées, la recherche de capitaux d'expansion nécessite une ingénierie financière avancée. En synergie avec SÉNÉGAL PME, PAMECAS propose un guichet d'instruction pour la labellisation <b>PME Elite</b>. Ce certificat d'éligibilité simplifie l'obtention de garanties nationales et de taux d'emprunt à remboursement différé.
                </p>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black tracking-wide uppercase">Le Label PME Elite PAMECAS</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    Comprend une ligne de garantie de prêt d'investissement jusqu'à 25 000 000 FCFA, une assistance par des experts-comptables agréés par l'État pour auditer votre comptabilité, et une exposition privilégiée lors de nos forums économiques d'affaires internationaux.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-80 bg-amber-50/30 rounded-2xl p-5 border border-amber-100 space-y-3">
                <h4 className="text-xs font-bold text-amber-800 uppercase">🔥 Critères d'éligibilité</h4>
                <ul className="text-[10px] text-slate-650 space-y-2">
                  <li><b>• CA annuel :</b> Supérieur à 10 000 000 FCFA</li>
                  <li><b>• Statut juridique :</b> SARL, SUARL ou SA</li>
                  <li><b>• Personnel :</b> Minimum de 3 employés déclarés</li>
                  <li><b>• Documents :</b> Registre du commerce (RCCM) à jour</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

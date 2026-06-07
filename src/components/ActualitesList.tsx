import { useState } from "react";
import { Newspaper, Calendar, ArrowRight, Star, Heart, TrendingUp } from "lucide-react";

interface ActualitesListProps {
  currentTheme: "green" | "blue";
  onNavigate: (tab: string) => void;
}

export default function ActualitesList({ currentTheme, onNavigate }: ActualitesListProps) {
  const isGreen = currentTheme === "green";
  const primaryBg = isGreen ? "bg-[#006633]" : "bg-blue-600";
  const textTheme = isGreen ? "text-[#006633]" : "text-blue-600";
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    art1: 42,
    art2: 29,
    art3: 88,
    art4: 15
  });

  const newsArticles = [
    {
      id: "art1",
      date: "07 Juin 2026",
      badge: "⭐ Innovation",
      title: "Lancement du Guichet Digital de Suivi de Crédit PAMECAS",
      desc: "L'Union des mutuelles déploie une application d'instruction centralisée en temps réel pour accélérer de 70% les décisions d'approbation de prêt pour les GIE agricoles.",
      readTime: "3 min de lecture",
      impact: "Inclusion technologique nationale"
    },
    {
      id: "art2",
      date: "04 Juin 2026",
      badge: "🌾 Financement Rural",
      title: "Fonds de Garantie Élargi de 500 Millions FCFA pour le Maraîchage",
      desc: "Une nouvelle convention entre PAMECAS et les filières avicoles du bassin de Thiès et du Fleuve Sénégal ouvre droit à un fonds de cautionnement mutuel pour les coopératives maraîchères.",
      readTime: "4 min de lecture",
      impact: "+1500 exploitants accompagnés"
    },
    {
      id: "art3",
      date: "28 Mai 2026",
      badge: "🤝 Écosystème",
      title: "Forum SÉNÉGAL PME : Les PME Émergentes reçoivent le Label Élite",
      desc: "Retour sur la cérémonie de remise des accréditations BCEAO à Dakar. Treize nouvelles Très Petites Entreprises (TPE) de Thiès ont reçu l'appui comptable à 100%.",
      readTime: "5 min de lecture",
      impact: "Formalisation de l'économie locale"
    },
    {
      id: "art4",
      date: "15 Mai 2026",
      badge: "📚 Éducation",
      title: "Démarrage des Ateliers de Tenue de Caisse SÉNÉGAL PME",
      desc: "Découvrez le calendrier des formations gratuites dans les agences de Pikine, Rufisque, Mbour et Ziguinchor pour apprendre à éditer un carnet de reçus professionnel.",
      readTime: "2 min de lecture",
      impact: "Éducation financière inclusive"
    }
  ];

  const handleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-[10px] font-bold text-[#006633] bg-[#006633]/10 uppercase tracking-widest rounded-full mb-3">
          INSTITUTIONNEL &amp; PRESSE SÉNÉGALAISE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006633] tracking-tight">
          Actualités &amp; Rapports d&apos;Impacts
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          Suivez les dernières actions de l&apos;Union des Mutuelles de Crédit PAMECAS, l&apos;avancée des réformes BCEAO, et les histoires de réussite de nos GIE partenaires.
        </p>
      </div>

      {/* Featured News Hero Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#006633]/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="space-y-4 max-w-2xl select-none">
          <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-sm tracking-wider">
            🚨 BULLETIN OFFICIEL SÉNÉGAL PME
          </span>
          <h2 className="text-lg sm:text-2xl font-black leading-tight tracking-tight">
            Nouveau partenariat stratégique 2026 pour le co-financement des jeunes entrepreneurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Grâce à l'accord renouvelé entre les caisses de l'Union PAMECAS et l'État du Sénégal, le montant maximal des micro-crédits directifs passe de 3 millions à 5 millions de FCFA pour les jeunes créateurs sous réserve d'élection au coaching.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2 items-center text-[11px] text-slate-400">
            <span className="flex items-center gap-1">🗓️ Publié le 07 Juin 2026</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-amber-400 font-bold">Instruction prioritaire active ✓</span>
          </div>

          <button
            onClick={() => onNavigate("credit")}
            className="mt-4 px-5 py-2.5 bg-[#006633] hover:bg-[#1a5c2a] text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <span>Simuler mon prêt maintenant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsArticles.map((art) => (
          <div key={art.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 hover:border-emerald-250 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span className="text-amber-600 block bg-amber-50 px-2 py-0.5 rounded-full">
                  {art.badge}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {art.date}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug hover:text-[#006633] transition-colors">
                {art.title}
              </h3>

              <p className="text-slate-500 text-xs leading-relaxed">
                {art.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ⭐ {art.impact}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(art.id)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-lg text-xs transition cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="font-mono">{likes[art.id]}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

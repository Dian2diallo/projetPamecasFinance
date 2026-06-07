import React, { useState } from "react";
import { GraduationCap, Calendar, Clock, BookOpen, Check, Award, AlertCircle } from "lucide-react";

interface FormationsListProps {
  currentTheme: "green" | "blue";
}

export default function FormationsList({ currentTheme }: FormationsListProps) {
  const isGreen = currentTheme === "green";
  const primaryBg = isGreen ? "bg-[#006633]" : "bg-blue-600";
  const hoverBg = isGreen ? "hover:bg-[#1a5c2a]" : "hover:bg-blue-700";

  const [registeredCourse, setRegisteredCourse] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState<string | null>(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");

  const courses = [
    {
      id: "comptabilite",
      category: "📂 Gestion & Finance",
      title: "Comptabilité de Caisse & Fiscalité Simplifiée",
      desc: "Apprenez à structurer votre cahier de caisse, éditer des reçus conformes à la législation fiscale sénégalaise et séparer votre budget personnel de l'entreprise.",
      duration: "4 Sessions (12 heures)",
      date: "Prochaine session : 15 Juin 2026",
      hours: "14h00 - 17h00",
      badge: "Indispensable TPE"
    },
    {
      id: "maraichage",
      category: "🌾 Modernisation Agricole",
      title: "Gestion d'Exploitations Agricoles & AgriTech",
      desc: "Optimisez vos cycles de récolte maraîchère, gérez vos stocks d'intrants et calculez le retour sur investissement d'une motopompe solaire ou électrique.",
      duration: "3 Jours intensifs",
      date: "Prochaine session : 22 Juin 2026",
      hours: "09h00 - 16h00",
      badge: "Secteur Clé"
    },
    {
      id: "business-plan",
      category: "🚀 Stratégie",
      title: "Rédaction de Business Plan & Modèle GIE",
      desc: "Maîtrisez les clés pour convaincre le comité de crédit PAMECAS. Rédigez le plan de trésorerie prévisionnel et structurez efficacement votre GIE.",
      duration: "5 Sessions en ligne",
      date: "Prochaine session : 29 Juin 2026",
      hours: "18h00 - 20h00",
      badge: "Accès Financement"
    },
    {
      id: "marketing-digital",
      category: "📣 Vente",
      title: "Marketing Digital pour micro-commerces locaux",
      desc: "Utilisez WhatsApp Business et Facebook pour augmenter la visibilité de votre commerce local et fidéliser vos clients à Dakar et régions.",
      duration: "2 Sessions (6 heures)",
      date: "Prochaine session : 02 Juillet 2026",
      hours: "14h00 - 17h00",
      badge: "Nouveauté"
    }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName || !attendeePhone) {
      alert("Veuillez remplir vos coordonnées pour vous inscrire.");
      return;
    }
    setRegisteredCourse(showFormModal);
    setShowFormModal(null);
    setAttendeeName("");
    setAttendeePhone("");

    setTimeout(() => {
      setRegisteredCourse(null);
    }, 4500);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-[10px] font-bold text-[#006633] bg-[#006633]/10 uppercase tracking-widest rounded-full mb-3">
          Alliance PAMECAS &amp; SÉNÉGAL PME
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006633] tracking-tight">
          Pôle National de Formation Artisanale &amp; PME
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          Renforcez vos compétences en gouvernance d'entreprise et gestion comptable. Toutes nos formations sont certifiées par l'État et gratuites pour les membres du réseau PAMECAS.
        </p>
      </div>

      {/* Dynamic Toast feedback */}
      {registeredCourse && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 text-xs flex items-start gap-3 animate-bounce">
          <div className="p-1 bg-emerald-100 rounded-lg text-emerald-600">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold">Demande d'inscription enregistrée !</h4>
            <p className="text-[11px] text-emerald-700/90 mt-0.5">
              Un SMS de confirmation contenant vos codes d'accès et votre convocation a été envoyé sur votre numéro de téléphone. Bienvenue dans la promotion !
            </p>
          </div>
        </div>
      )}

      {/* Grid of Trainings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 hover:border-emerald-250 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {course.category}
                </span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                  {course.badge}
                </span>
              </div>

              <h3 className="font-extrabold text-[#006633] text-sm sm:text-base leading-tight">
                {course.title}
              </h3>

              <p className="text-slate-500 text-xs leading-relaxed">
                {course.desc}
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-600 grid grid-cols-2 gap-2 border border-slate-100/55">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                  <span className="truncate">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                  <span className="truncate">{course.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-500">Certificat SÉNÉGAL PME</span>
              </div>

              <button
                onClick={() => setShowFormModal(course.title)}
                className={`px-4 py-2 text-[11px] font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-xs transition active:scale-97 cursor-pointer`}
              >
                S'inscrire gratuitement
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Program Partner Ribbon */}
      <div className="bg-emerald-85 bg-[#006633]/5 rounded-3xl p-5 sm:p-6 mt-8 border border-[#006633]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">👨‍🏫 Vous êtes formateur ou expert agréé ?</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Rejoignez notre pool d'intervenants labellisés et transmettez votre savoir-faire aux jeunes GIE et PME locales.
          </p>
        </div>
        <button
          onClick={() => alert("Formulaire d'accréditation consultant-formateur en cours de chargement...")}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 whitespace-nowrap"
        >
          Proposer un atelier
        </button>
      </div>

      {/* REGISTRATION MODAL FORM */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight mb-1">
              Fiche d'Inscription Gratuite
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-tight">
              Pour le séminaire certifié : <b className="text-[#006633] font-bold">{showFormModal}</b>
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nom complet du Participant *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Babacar Ndiaye"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#006633]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Numéro de téléphone (Pour convocation par SMS) *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +221 77 692 76 51"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#006633]"
                />
              </div>

              <div className="p-3 bg-slate-55 bg-slate-50 rounded-xl text-[10px] text-slate-500 flex gap-1.5 leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span>La présence physique (ou connexion pour les sessions en visioconférence) aux sessions programmées est obligatoire pour obtenir le certificat d'évaluation BCEAO SÉNÉGAL PME.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(null)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white ${primaryBg} ${hoverBg} rounded-xl shadow-sm transition`}
                >
                  Confirmer l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

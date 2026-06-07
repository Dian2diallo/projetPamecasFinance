import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, HelpCircle, CheckCircle, Search, ZoomIn, ZoomOut } from "lucide-react";
import { PAMECAS_AGENCIES } from "../data";
import { Agency } from "../types";

interface ContactAgencesProps {
  currentTheme: "green" | "blue";
}

export default function ContactAgences({ currentTheme }: ContactAgencesProps) {
  const isGreen = currentTheme === "green";

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Agency Search & Map State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(PAMECAS_AGENCIES[0]); // default Dakar
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeMapTab, setActiveMapTab] = useState<"interactive" | "vector">("interactive");

  // Filter branches based on query
  const filteredAgencies = useMemo(() => {
    return PAMECAS_AGENCIES.filter(
      (agency) =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Compute map OSM embed URL based on active coordinates
  const mapUrl = useMemo(() => {
    if (!selectedAgency || !selectedAgency.gps.lat || !selectedAgency.gps.lng) {
      return "https://www.openstreetmap.org/export/embed.html?bbox=-17.6%2C12.3%2C-12.0%2C16.8&layer=mapnik";
    }
    const lat = selectedAgency.gps.lat;
    const lng = selectedAgency.gps.lng;
    const delta = 0.012; // zoom tightness
    const minLng = lng - delta;
    const minLat = lat - delta;
    const maxLng = lng + delta;
    const maxLat = lat + delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [selectedAgency]);

  // Handle message sending simulation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 3500);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-12"
    >
      {/* 1. Page hero block */}
      <section className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold font-headline-lg text-slate-900 tracking-tight">
          Contactez-nous
        </h2>
        <p className="text-sm text-slate-500 font-sans max-w-2xl mx-auto leading-relaxed">
          Institution de Microfinance du Sénégal : Votre partenaire de confiance pour une prospérité durable et inclusive. Découvrez nos agences et soumettez vos requêtes.
        </p>
      </section>

      {/* 2. Bento Grid Cards on Contacts information and Message form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Detail Cards (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Phone block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex gap-4 hover:-translate-y-1 transition-transform relative group">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl ${
              isGreen ? "bg-emerald-600" : "bg-blue-600"
            }`} />
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 flex-shrink-0 h-12 w-12 flex items-center justify-center relative">
              <span className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse"></span>
              <Phone className="w-5 h-5 text-emerald-650" />
            </div>
            <div className="space-y-1 font-sans">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Téléphone Direct
              </p>
              <a href="tel:+221776927651" className="font-extrabold text-sm sm:text-base text-slate-850 hover:text-emerald-700 transition-colors block">
                +221 77 692 76 51
              </a>
              <p className="text-[11px] text-slate-450">
                Disponible de 8h à 18h (Lundi - Samedi)
              </p>
            </div>
          </div>

          {/* Email block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex gap-4 hover:-translate-y-1 transition-transform relative group">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl ${
              isGreen ? "bg-emerald-600" : "bg-blue-600"
            }`} />
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 flex-shrink-0 h-12 w-12 flex items-center justify-center relative">
              <span className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse"></span>
              <Mail className="w-5 h-5 text-emerald-650" />
            </div>
            <div className="space-y-1 font-sans">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Adresse Électronique
              </p>
              <a href="mailto:diallodian2448@gmail.com" className="font-extrabold text-xs sm:text-sm text-slate-850 hover:text-emerald-700 transition-colors block truncate max-w-[210px] sm:max-w-none">
                diallodian2448@gmail.com
              </a>
              <p className="text-[11px] text-slate-455">
                Réponses sous 24h ouvrées
              </p>
            </div>
          </div>

          {/* Address block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex gap-4 hover:-translate-y-1 transition-transform relative group">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl ${
              isGreen ? "bg-emerald-600" : "bg-blue-600"
            }`} />
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 flex-shrink-0 h-12 w-12 flex items-center justify-center relative">
              <span className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse"></span>
              <MapPin className="w-5 h-5 text-emerald-650" />
            </div>
            <div className="space-y-1 font-sans">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Siège Principal - Dakar
              </p>
              <p className="font-extrabold text-sm text-slate-850">
                Dakar rufisque
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                Avenue, dian diallo BP 8546, Dakar rufisque
              </p>
            </div>
          </div>
        </div>

        {/* Message submitting form (Col Span 8) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <AnimatePresence>
            {sentSuccess ? (
              /* Success delivery confirmation screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-4 max-w-sm mx-auto"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message envoyé !</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nous vous remercions de votre intérêt. Nos équipes analyseront votre requête et reviendront vers vous par mail très rapidement.
                </p>
              </motion.div>
            ) : (
              /* Actual submitting email sheet form */
              <form onSubmit={handleContactSubmit} className="space-y-5 text-xs font-sans">
                <h3 className="text-lg font-bold text-slate-900 font-headline-sm">
                  Envoyez-nous un message
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wider">
                      Nom Complet *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Moussa Diop"
                      disabled={isSending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all animate-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wider">
                      Adresse Email *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="moussa.diop@example.com"
                      disabled={isSending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    Sujet
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="De quel objet s&apos;agit-il ?"
                    disabled={isSending}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    Message *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Comment pouvons-nous vous accompagner ?"
                    disabled={isSending}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none focus:bg-white text-slate-800 text-xs font-sans transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`px-8 py-3.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer ${
                      isGreen ? "bg-amber-500 hover:bg-amber-600 text-emerald-950" : "bg-amber-500 hover:bg-amber-600 text-blue-950"
                    }`}
                  >
                    {isSending ? "Envoi en cours..." : "Envoyer le message"}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Senegal Interactive branches map search */}
      <section className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-headline-md tracking-tight flex items-center gap-2">
              <span className="p-1 px-2.5 bg-emerald-100 text-emerald-850 rounded-lg text-sm">📍</span>
              Nos Agences & Canaux
            </h2>
            <p className="text-xs text-slate-500 max-w-lg">
              Repérez nos agences sur notre carte interactive en direct ou consultez la carte globale de répartition de notre réseau à l&apos;échelle nationale.
            </p>

            {/* Quick Map Tab Toggle */}
            <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-xl max-w-fit border border-slate-200 mt-2">
              <button
                type="button"
                onClick={() => setActiveMapTab("interactive")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMapTab === "interactive"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-300/40"
                }`}
              >
                🗺️ Carte Interactive (Temps Réel)
              </button>
              <button
                type="button"
                onClick={() => setActiveMapTab("vector")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMapTab === "vector"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-300/40"
                }`}
              >
                🇸🇳 Carte Réseau Vectorielle
              </button>
            </div>
          </div>

          {/* Search box branch input */}
          <div className="relative w-full md:w-72 text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher par agence, ville..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800 text-xs transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Dynamic map & branch descriptive brochure layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Map Representation Frame (SPAN 8) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[380px] flex flex-col justify-between">
            
            {activeMapTab === "interactive" ? (
              /* REAL-WORLD DETAILED INTERACTIVE OPENSTREETMAP EMBED */
              <div className="w-full h-full min-h-[380px] relative">
                {/* Embedded Map Frame */}
                <iframe
                  title="Localisation d'agence PAMECAS"
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[380px] border-0"
                  src={mapUrl}
                  loading="lazy"
                  allowFullScreen
                />
                
                {/* Floating GPS coordinates indicator for extreme precision */}
                {selectedAgency && selectedAgency.gps.lat && (
                  <div className="absolute top-3 right-3 bg-slate-900/95 text-white/90 text-[10px] font-mono px-2.5 py-1.5 rounded-lg border border-slate-700/60 shadow-lg pointer-events-none flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    GPS: {selectedAgency.gps.lat.toFixed(4)}°, {selectedAgency.gps.lng ? selectedAgency.gps.lng.toFixed(4) : 0}°
                  </div>
                )}
                
                {/* Mini instructions block */}
                <div className="absolute bottom-3 right-3 bg-white/95 text-slate-700 text-[10.5px] font-bold px-2 py-1 rounded shadow-md pointer-events-none border border-slate-100 backdrop-blur-xs">
                  Pro-Tip: Utilisez la molette pour zoomer / déplacer
                </div>
              </div>
            ) : (
              /* CLEAN, MODERN HIGH-DESIGN VECTOR SENEGAL REGIONS MAP */
              <div className="w-full h-full min-h-[380px] relative flex items-center justify-center p-6 bg-slate-950/95 overflow-hidden">
                {/* Techy background grids and coordinate metrics */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[9px] text-white p-3 select-none flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span>16°00&apos;N / 16°30&apos;W</span>
                    <span>16°00&apos;N / 12°00&apos;W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>12°30&apos;N / 16°30&apos;W</span>
                    <span>12°30&apos;N / 12°00&apos;W</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Senegal decorative boundaries SVG path background representation */}
                <svg 
                  viewBox="0 0 400 300"
                  className="w-full h-full max-h-[330px] transition-transform duration-500 relative z-10"
                  style={{ transform: `scale(${zoomLevel})`, overflow: "visible" }}
                >
                  {/* Surrounding Oceans Indicators with realistic ocean styling and custom wave grid */}
                  <path 
                    d="M 5 50 Q 20 120 10 220" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />
                  <text x="12" y="100" className="text-[7px] fill-slate-650 font-mono italic tracking-widest uppercase">Océan Atlantique</text>
                  
                  {/* Main Senegal high-fidelity shape path */}
                  <polygon 
                    points="10,130 50,110 90,80 130,80 200,80 220,100 240,110 260,110 320,130 380,150 395,190 350,210 290,210 250,220 220,240 210,250 180,260 140,250 120,220 80,200 45,200 30,170 30,150 10,140"
                    fill="#0f172a" 
                    stroke="#10b981" 
                    strokeWidth="2.5"
                    className="transition-colors duration-500"
                    opacity="0.95"
                  />
                  
                  {/* Subtle inner fill for luxurious neon effect */}
                  <polygon 
                    points="10,130 50,110 90,80 130,80 200,80 220,100 240,110 260,110 320,130 380,150 395,190 350,210 290,210 250,220 220,240 210,250 180,260 140,250 120,220 80,200 45,200 30,170 30,150 10,140"
                    fill={isGreen ? "url(#greenGrad)" : "url(#blueGrad)"} 
                    opacity="0.25"
                  />

                  {/* Gradient paths definition to make map gradients look premium */}
                  <defs>
                    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#022c22" />
                    </linearGradient>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>

                  {/* Gambia Cutout representation - labeled properly */}
                  <g opacity="0.85">
                    <rect x="30" y="172" width="110" height="11" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="85" y="180" className="text-[6.5px] fill-amber-400 font-bold font-mono tracking-widest text-center" textAnchor="middle">THE GAMBIA</text>
                  </g>

                  {/* Neighboring Country labels to look authentic */}
                  <text x="180" y="55" className="text-[7.5px] fill-slate-500 font-bold tracking-widest uppercase">Mauritanie</text>
                  <text x="360" y="125" className="text-[7.5px] fill-slate-500 font-bold tracking-widest uppercase" textAnchor="end">Mali</text>
                  <text x="280" y="275" className="text-[7.5px] fill-slate-500 font-bold tracking-widest uppercase">Guinée</text>

                  {/* Glowing Branch gold markers */}
                  {filteredAgencies.map((agency) => {
                    const isSelected = selectedAgency?.id === agency.id;
                    const cx = (agency.gps.lngPercent * 3.4) + 15;
                    const cy = (agency.gps.latPercent * 2.5) + 30;

                    return (
                      <g 
                        key={agency.id}
                        onClick={() => setSelectedAgency(agency)}
                        className="cursor-pointer group/pin"
                      >
                        {/* Ring highlight halo on selection */}
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={isSelected ? "14" : "6"} 
                          fill="none"
                          stroke={isSelected ? "#f59e0b" : "#10b981"}
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: isSelected ? "1.2s" : "4s" }}
                          opacity={isSelected ? "0.9" : "0.3"}
                        />
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={isSelected ? "7" : "4"} 
                          fill={isSelected ? "#f59e0b" : "#10b981"}
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          className="shadow-sm transition-all duration-305 group-hover/pin:scale-135 group-hover/pin:fill-amber-500"
                        />
                        
                        {/* Floating city indicators in maps */}
                        <text
                          x={cx}
                          y={cy - 11}
                          textAnchor="middle"
                          className={`text-[8.5px] font-sans font-extrabold ${isSelected ? "fill-amber-400" : "fill-slate-300"} tracking-tight drop-shadow-md`}
                        >
                          {agency.city}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Custom Vector map controllers (Zoom + / -) */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-20">
                  <button 
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(2.2, prev + 0.2))}
                    className="bg-white/95 p-2 rounded-lg shadow-md hover:bg-slate-50 transition-colors cursor-pointer text-slate-805"
                    title="Zoomer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                    className="bg-white/95 p-2 rounded-lg shadow-md hover:bg-slate-50 transition-colors cursor-pointer text-slate-805"
                    title="Dézoomer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-4 right-4 text-[9.5px] text-slate-400 font-mono bg-slate-900/90 py-1.5 px-3 rounded-lg border border-slate-800 backdrop-blur-xs">
                  {filteredAgencies.length} agences trouvées
                </div>
              </div>
            )}
          </div>

          {/* Branch Brochure detail brochure Panel (SPAN 4) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between">
            {selectedAgency ? (
              <div className="space-y-4 font-sans text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600">Point de Service Sélectionné</span>
                    <span className="font-extrabold text-sm text-slate-900">{selectedAgency.name}</span>
                  </div>

                  <div className="space-y-3.5 pt-1 text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Adresse Physique</p>
                        <p className="mt-0.5 leading-relaxed text-slate-500">{selectedAgency.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Téléphone Direct</p>
                        <a href={`tel:${selectedAgency.phone}`} className="mt-0.5 font-extrabold text-emerald-700 hover:underline block text-sm">{selectedAgency.phone}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Email Officiel</p>
                        <a href={`mailto:agence.${selectedAgency.id}@pamecas.sn`} className="mt-0.5 font-mono text-[10px] text-slate-500 hover:text-slate-800 block">agence.{selectedAgency.id}@pamecas.sn</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Heures d&apos;ouverture</p>
                        <p className="mt-0.5 leading-relaxed text-slate-500">{selectedAgency.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <a 
                    href={`tel:${selectedAgency.phone}`}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:scale-95 text-black font-extrabold rounded-2xl text-xs transition-all text-center block shadow-md hover:shadow-lg border border-amber-300"
                    id="btn-joindre-direct"
                  >
                    📞 Joindre l&apos;agence en direct
                  </a>
                  {activeMapTab === "vector" && (
                    <button
                      type="button"
                      onClick={() => setActiveMapTab("interactive")}
                      className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-650 border border-slate-200 hover:bg-slate-50 transition-all text-center block cursor-pointer"
                    >
                      🗺️ Localiser en temps réel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-2 h-full">
                <HelpCircle className="w-8 h-8 text-slate-300 animate-pulse" />
                <p className="text-xs text-slate-400">
                  Sélectionnez un point d&apos;activité pour afficher les coordonnées de l&apos;agence.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>
    </motion.div>
  );
}

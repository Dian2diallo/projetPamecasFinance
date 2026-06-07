import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PiggyBank, Handshake, Smartphone, TrendingUp, Wallet, ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { PAMECAS_PRODUCTS } from "../data";
import { Product } from "../types";

interface ProductsListProps {
  currentTheme: "green" | "blue";
  onNavigateToSimulator: () => void;
}

const PRODUCT_IMAGES: Record<string, string> = {
  "compte-epargne": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80",
  "solutions-credit": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
  "services-financiers": "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600&auto=format&fit=crop&q=80",
  "epargne-plus": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80",
  "credit-express": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80"
};

export default function ProductsList({ currentTheme, onNavigateToSimulator }: ProductsListProps) {
  const isGreen = currentTheme === "green";
  const [selectedCategory, setSelectedCategory] = useState<"épargne" | "crédit" | "services" | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { label: "Tout", id: "all" },
    { label: "Épargne", id: "épargne" },
    { label: "Crédit", id: "crédit" },
    { label: "Services", id: "services" }
  ];

  const filteredProducts = PAMECAS_PRODUCTS.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory
  );

  const renderProductIcon = (iconName: string) => {
    const iconClass = "w-10 h-10 text-amber-600";
    switch (iconName) {
      case "pig":
        return <PiggyBank className={iconClass} />;
      case "handshake":
        return <Handshake className={iconClass} />;
      case "smartphone":
        return <Smartphone className={iconClass} />;
      case "trending-up":
        return <TrendingUp className={iconClass} />;
      case "wallet":
        return <Wallet className={iconClass} />;
      default:
        return <PiggyBank className={iconClass} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-headline-lg text-slate-900 tracking-tight">
          Produits et Services PAMECAS
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl">
          Sélectionnez un de nos produits de microfinance pour sécuriser vos économies ou financer vos projets de vie au Sénégal.
        </p>
      </div>

      {/* Slide-to-Filter Categories */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap cursor-pointer shadow-xs border ${
                isSelected
                  ? isGreen
                    ? "bg-emerald-800 border-emerald-800 text-white font-bold"
                    : "bg-blue-800 border-blue-800 text-white font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top Prestige Border on hover */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 opacity-60 ${
              isGreen ? "bg-amber-500" : "bg-amber-500"
            }`} />

            <div className="space-y-4">
              {/* Product realistic cover image banner */}
              <div className="h-44 w-full rounded-xl overflow-hidden relative border border-slate-100">
                <img 
                  src={PRODUCT_IMAGES[p.id] || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=80"} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white ${
                  isGreen ? "bg-emerald-850/95" : "bg-blue-850/95"
                }`}>
                  {p.category}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[52px]">
                  {p.shortDescription}
                </p>
              </div>
            </div>

            {/* Direct Learn More Action Button */}
            <div className="pt-4 border-t border-slate-100/80 mt-4 mt-auto">
              <button
                onClick={() => setSelectedProduct(p)}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-97 cursor-pointer flex items-center justify-center gap-2 ${
                  isGreen
                    ? "bg-emerald-800 hover:bg-emerald-900 text-white"
                    : "bg-blue-800 hover:bg-blue-900 text-white"
                }`}
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Slide Module Drawer/Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop filter overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Floating dialog content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative z-20 border border-slate-150 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 bg-slate-100/80 backdrop-blur hover:bg-slate-200 transition-colors z-30 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                {/* Modal Cover Image Representation */}
                <div className="h-48 sm:h-56 w-full rounded-2xl overflow-hidden relative border border-slate-100">
                  <img 
                    src={PRODUCT_IMAGES[selectedProduct.id] || ""} 
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white ${
                    isGreen ? "bg-emerald-850/95" : "bg-blue-850/95"
                  }`}>
                    {selectedProduct.category}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedProduct.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  {selectedProduct.fullDescription}
                </p>

                {/* Rates Info if applicable */}
                {selectedProduct.rates && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                        Rendement &amp; Tarifs
                      </p>
                      <p className="text-sm font-semibold text-amber-950 mt-0.5">
                        {selectedProduct.rates}
                      </p>
                    </div>
                  </div>
                )}

                {/* Key Advantages List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Avantages Privilégiés
                  </h4>
                  <ul className="space-y-2">
                    {selectedProduct.advantages.map((adv, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isGreen ? "text-emerald-600" : "text-blue-600"
                        }`} />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opening requirements */}
                {selectedProduct.conditions && (
                  <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Conditions de souscription
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedProduct.conditions}
                    </p>
                  </div>
                )}

                {/* Simulator redirection option */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  >
                    Fermer
                  </button>

                  {selectedProduct.category === "crédit" && (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        onNavigateToSimulator();
                      }}
                      className={`flex-1 py-3 px-4 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                        isGreen ? "bg-amber-500 hover:bg-amber-600 text-emerald-950" : "bg-amber-500 hover:bg-amber-600 text-blue-950"
                      }`}
                    >
                      Simuler maintenant
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

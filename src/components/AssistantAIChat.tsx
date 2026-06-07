import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, Landmark, HelpCircle, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { Message } from "../types";

interface AssistantAIChatProps {
  currentTheme: "green" | "blue";
}

export default function AssistantAIChat({ currentTheme }: AssistantAIChatProps) {
  const isGreen = currentTheme === "green";
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Salam! Je suis votre Conseiller Intelligent PAMECAS. Je peux vous renseigner sur nos produits d'épargne, nos taux de crédit (9.5%), nos agences de Dakar ou Saint-Louis et simuler vos options. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggestions chips
  const promptSuggestions = [
    "Quels sont vos taux de crédit ?",
    "Comment ouvrir un compte d'épargne ?",
    "Où se trouve l'agence de Dakar ?",
    "Qu'est-ce que le Crédit Express ?"
  ];

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Execute message submit
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Execute call to our secure full-stack backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (!response.ok) {
        throw new Error("Erreur de communication serveur");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Graceful offline fallback if server is unreachable or API key is not configured
      setTimeout(() => {
        let reply = "Je rencontre une indisponibilité réseau temporaire. Pour rappel, nos agences sont ouvertes du lundi au vendredi de 8h à 17h, et notre taux de crédit standard brut est fixé à 9.5% l'an.";
        
        const lowered = textToSend.toLowerCase();
        if (lowered.includes("taux") || lowered.includes("credit") || lowered.includes("crédit")) {
          reply = "Chez PAMECAS, nos crédits standards (Solutions de Crédit, Crédit Express, etc.) sont calculés sur un taux d'intérêt indicatif annuel brut de 9.5%. La durée d'amortissement varie de 12 à 60 mois.";
        } else if (lowered.includes("épargne") || lowered.includes("epargne") || lowered.includes("ouvrir")) {
          reply = "L'ouverture d'un Compte d'Épargne Standard nécessite un droit d'adhésion de 5 000 FCFA avec une pièce d'identité en cours de validité. Le livret classique propose un taux de rémunération d'épargne annuel attractif.";
        } else if (lowered.includes("dakar") || lowered.includes("siège") || lowered.includes("siege") || lowered.includes("agence")) {
          reply = "Notre Siège Social PAMECAS se situe à l'Avenue, dian diallo BP 8546, Dakar rufisque. Nous disposons aussi de succursales à Saint-Louis (Quartier Sor), Kaolack (Boulevard de la République), Thiès et Ziguinchor.";
        }

        const botMsg: Message = {
          role: "model",
          text: reply,
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50">
      
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{ contentVisibility: "auto" }}
        className={`w-14 h-14 rounded-full shadow-xl text-white flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
          isOpen 
            ? "bg-slate-800 hover:bg-slate-900" 
            : isGreen 
              ? "bg-amber-500 hover:bg-amber-600 text-emerald-950" 
              : "bg-amber-500 hover:bg-amber-600 text-blue-950"
        }`}
        title="Conseiller Financier Intelligent"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Sheet Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, x: 10 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl border border-slate-150 shadow-2xl flex flex-col justify-between overflow-hidden font-sans"
          >
            {/* Header branding */}
            <div className={`p-4 text-white flex items-center justify-between shadow-xs transition-colors ${
              isGreen ? "bg-emerald-950" : "bg-blue-950"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Bot className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm tracking-tight flex items-center gap-1">
                    Assistant PAMECAS IA 
                    <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold uppercase leading-none">
                      Active
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-300 font-sans block -mt-0.5">
                    Conseils épargne &amp; crédit solidaire
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div 
                  onClick={() => {
                    setMessages([messages[0]]);
                  }}
                  className="p-1 px-2 text-[9px] hover:bg-white/10 rounded uppercase tracking-wider font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
                >
                  Reset
                </div>
              </div>
            </div>

            {/* Bubble ledger Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 scrollbar-thin text-xs"
            >
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-2 max-w-[85%] ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Circle avatar */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-amber-600">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className={`p-3 rounded-2xl relative font-sans leading-relaxed ${
                        isUser 
                          ? isGreen 
                            ? "bg-emerald-800 text-white rounded-tr-none" 
                            : "bg-blue-800 text-white rounded-tr-none"
                          : "bg-white text-slate-700 border border-slate-150 rounded-tl-none shadow-xs"
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <span className={`text-[9px] text-slate-400 block tracking-wider ${
                        isUser ? "text-right" : "text-left pl-1"
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot loading loop */}
              {isLoading && (
                <div className="flex gap-2 mr-auto max-w-[80%] items-center text-slate-400">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  </div>
                  <span className="font-sans text-[11px] italic animate-pulse">
                    Pamecas IA réfléchit...
                  </span>
                </div>
              )}
            </div>

            {/* Suggestions panel */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100/50 flex gap-1.5 overflow-x-auto scrollbar-none">
              {promptSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-[10px] text-slate-600 font-semibold rounded-full whitespace-nowrap active:scale-95 transition-all text-xs cursor-pointer block"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Typing input sector */}
            <div className="p-3 bg-white border-t border-slate-150 flex items-center gap-2">
              <input 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSendMessage(inputVal);
                }}
                disabled={isLoading}
                placeholder="Discutez taux de crédit, épargne, agences..."
                className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-400 focus:bg-white text-xs font-sans text-slate-800 transition-colors"
                aria-label="Message à l'assistant"
              />
              <button
                onClick={() => handleSendMessage(inputVal)}
                disabled={isLoading || !inputVal.trim()}
                className={`p-2.5 rounded-xl text-white shadow active:scale-90 transition-all cursor-pointer ${
                  isGreen ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-800 hover:bg-blue-950"
                } disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

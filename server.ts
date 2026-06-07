import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load local environment secrets
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware parser
  app.use(express.json());

  // Instantiate Gemini client if key is configured
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini Client successfully initialized server-side.");
    } catch (e) {
      console.error("Failed to initialize Gemini Client:", e);
    }
  } else {
    console.warn("GEMINI_API_KEY not found or holds placeholder value. Falling back to rule-based assistance.");
  }

  // 1. Dynamic Chat Counseling Route
  app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Le paramètre 'prompt' est requis." });
    }

    // A. Use Live Gemini LLM if client exists
    if (ai) {
      try {
        const systemInstruction = `You are "Pamecas Assistant IA" (Conseiller Financier Intelligent), a helpful customer support chatbot for PAMECAS, Senegal's cooperative credit and savings microfinance network.
Your tone should be welcoming, professional, solid, and helpful. You speak French and sometimes include standard Senegalese greetings (like "Salam!") or brief supportive Wolof phrases ("Nanga def", "Jërëjëf") where appropriate.
Support the user with their questions on:
1. Savings accounts (Comptes d'Épargne, Épargne Plus): Open starting from 5,000 FCFA. High-yield and terms accessible.
2. Credits (Solutions de Crédit, Crédit Express): standard interest rate is 9.5% per annum, amortization terms between 12 and 60 months.
3. Network Locations: Siège in Dakar (Avenue, dian diallo BP 8546, Dakar rufisque), Saint-Louis (Sor), Kaolack, Thiès, Ziguinchor, Tambacounda.
Keep answers clear, concise, and formatted nicely in short bulleted points. Speak about microfinance options, simulator help, or branch details. Do not output raw markdown blocks of code. Limit replies to a maximum of 3 sentences or 120 words unless they ask for a detailed amortization overview.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const reply = response.text || "Pardon, je n'ai pas pu générer une réponse claire.";
        return res.json({ reply });
      } catch (gemError) {
        console.error("Gemini API Error, executing fallback protocol:", gemError);
      }
    }

    // B. Smart Keyword Fallbacks (Pre-emptive Senegal compliance)
    const promptLower = prompt.toLowerCase();
    let reply = "Salam! Vos questions sur PAMECAS m'intéressent. Pouvez-vous préciser votre demande sur l'épargne ou nos simulateurs de crédit à 9.5% brute ?";

    if (promptLower.includes("taux") || promptLower.includes("credit") || promptLower.includes("crédit") || promptLower.includes("prêt") || promptLower.includes("pret")) {
      reply = "Chez PAMECAS, nos crédits standards (Solutions de Crédit, Crédit Express) vous proposent un taux d'intérêt annuel effectif de 9.5% sur une durée modulable de 12 à 60 mois. Vous pouvez simuler vos mensualités précises sur notre onglet 'Crédit' !";
    } else if (promptLower.includes("épargne") || promptLower.includes("epargne") || promptLower.includes("livret") || promptLower.includes("ouvrir")) {
      reply = "Pour ouvrir un Compte d'Épargne standard chez PAMECAS, il vous suffit de vous munir d'une pièce d'identité en cours de validité et d'effectuer un dépôt d'ouverture minimal de 5 000 FCFA. Le livret est rémunéré pour faire fructifier votre pécule.";
    } else if (promptLower.includes("agence") || promptLower.includes("dakar") || promptLower.includes("saint-louis") || promptLower.includes("kaolack") || promptLower.includes("ziguinchor") || promptLower.includes("tambacounda")) {
      reply = "PAMECAS dispose de plus de 50 agences au Sénégal. Nos principaux bureaux se trouvent à Dakar Rufisque (Avenue, dian diallo BP 8546, Dakar rufisque, Siège social), Saint-Louis (Quartier Sor), Kaolack, Thiès et Ziguinchor. Repérez-les sur notre plan interactif 'Agences' !";
    } else if (promptLower.includes("salam") || promptLower.includes("bonjour") || promptLower.includes("salut")) {
      reply = "Salam! Nanga Def? Bienvenue chez PAMECAS Mobile. Je suis là pour guider votre épargne ou simuler votre demande de crédit (taux standard: 9.5%). Que puis-je faire pour vous ?";
    }

    return res.json({ reply });
  });

  // 2. Vite Middleware Setup
  if (process.env.NODE_ENV !== "production") {
    // Development routing using live asset builder
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Server is active on port 3000.");
  } else {
    // Production routing utilizing pre-compiled assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production assets mounted.");
  }

  // Bind to host 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PAMECAS Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { Product, Agency, Testimonial, Article, Transaction } from "./types";

export const PAMECAS_PRODUCTS: Product[] = [
  {
    id: "compte-epargne",
    title: "Comptes d'Épargne",
    shortDescription: "Solutions flexibles pour sécuriser votre avenir financier et faire fructifier votre argent.",
    fullDescription: "Ouvrez un compte d'Épargne PAMECAS et bénéficiez d'une solution de placement sécurisée et rémunérée. Que ce soit pour financer des études, préparer les imprévus ou constituer un capital de départ pour vos projets, nous vous accompagnons pas à pas.",
    category: "épargne",
    iconName: "pig",
    advantages: [
      "Taux de rémunération attractif annuel",
      "Retraits libres et dépôt minimal faible (à partir de 5 000 FCFA)",
      "Accès aux relevés de compte en temps réel",
      "Frais de gestion réduits au minimum"
    ],
    rates: "De 3.5% à 6% d'intérêt annuel",
    conditions: "Dépôt initial de 5 000 FCFA, pièce d'identité en cours de validité"
  },
  {
    id: "solutions-credit",
    title: "Solutions de Crédit",
    shortDescription: "Financements adaptés à vos projets personnels et professionnels, avec des taux compétitifs.",
    fullDescription: "PAMECAS propose une gamme complète de crédits individuels ou collectifs pour soutenir la consommation, l'habitat, ainsi que la croissance des petites et moyennes entreprises au Sénégal.",
    category: "crédit",
    iconName: "handshake",
    advantages: [
      "Processus d'octroi simplifié et rapide",
      "Échéances de remboursement flexibles de 12 à 60 mois",
      "Accompagnement de conseillers financiers locaux",
      "Taux brut d'intérêt attractif récurrent"
    ],
    rates: "Taux annuel effectif global indicatif à partir de 9.5%",
    conditions: "Garantie solidaire ou caution physique, domiciliation de revenus d'activité"
  },
  {
    id: "services-financiers",
    title: "Services Financiers",
    shortDescription: "Transferts d'argent, paiements de factures et gestion de compte en ligne.",
    fullDescription: "Simplifiez vos transactions quotidiennes. Grâce à nos partenariats étendus, bénéficiez de services de transfert nationaux et internationaux, réglez vos factures courantes (Senelec, Sen'Eau) et rechargez votre portefeuille électronique.",
    category: "services",
    iconName: "smartphone",
    advantages: [
      "Réseau national de plus de 50 points de vente",
      "Partenaire officiel des plus grands réseaux de transfert (Orange Money, Wave, Western Union)",
      "Paiements de factures instantanés et sécurisés",
      "Application mobile de suivi de solde"
    ],
    rates: "Frais de transaction ultra-compétitifs",
    conditions: "Accessible à tous les porteurs de compte PAMECAS sans surcoût"
  },
  {
    id: "epargne-plus",
    title: "Épargne Plus",
    shortDescription: "Taux attractif, flexibilité maximale pour rentabiliser vos excédents de trésorerie.",
    fullDescription: "Destiné aux particuliers et professionnels qui souhaitent maximiser leurs bénéfices sur le moyen terme. Bloquez vos fonds sur un compte de dépôt à terme (DAT) et profitez d'intérêts majorés cumulés.",
    category: "épargne",
    iconName: "trending-up",
    advantages: [
      "Idéal pour rentabiliser vos bénéfices ou réserve de sécurité",
      "Taux négocié selon la teneur et la durée du placement",
      "Options de réinvestissement automatique des intérêts",
      "Disponibilité d'avances sur DAT en cas de besoin pressant"
    ],
    rates: "Jusqu'à 6.5% d'intérêt brut annuel garanti",
    conditions: "Montant minimum de souscription : 500 000 FCFA"
  },
  {
    id: "credit-express",
    title: "Crédit Express",
    shortDescription: "Financement rapide, projets urgents débloqués en moins de 48 heures ouvrées.",
    fullDescription: "Une réponse instantanée à vos urgences médicales, de scolarité ou opportunités d'affaires. Ce crédit court terme vous évite les tracas administratifs pour parer aux imprévus.",
    category: "crédit",
    iconName: "wallet",
    advantages: [
      "Décision et décaissement en 48 heures maximum",
      "Formulaire de demande 100% digitalisé",
      "Justificatifs de dépenses allégés",
      "Remboursements ajustables mensuellement"
    ],
    rates: "Taux fixe de 9.5% sur la période",
    conditions: "Avoir un compte mouvementé depuis au moins 3 mois chez PAMECAS"
  }
];

export const PAMECAS_AGENCIES: Agency[] = [
  {
    id: "dakar-siege",
    name: "Siège Principal Dakar Rufisque",
    city: "Dakar Rufisque",
    address: "Avenue, dian diallo BP 8546, Dakar rufisque",
    phone: "+221 77 692 76 51",
    hours: "Lundi - Vendredi: 8h00 - 18h00 | Samedi: 9h00 - 13h00",
    gps: {
      latPercent: 48,
      lngPercent: 6,
      lat: 14.7167,
      lng: -17.2667
    }
  },
  {
    id: "dakar-aminata",
    name: "Agence Dakar - Aminata Diallo",
    city: "Dakar",
    address: "Avenue, dian diallo BP 8546, Dakar",
    phone: "+221 77 241 62 91",
    hours: "Lundi - Vendredi: 8h00 - 18h00 | Samedi: 9h00 - 13h00",
    gps: {
      latPercent: 47,
      lngPercent: 5.5,
      lat: 14.6937,
      lng: -17.4441
    }
  },
  {
    id: "thies-amadou",
    name: "Agence Thiès - Amadou Ba",
    city: "Thiès",
    address: "Avenue Léopold Sédar Senghor, Thiès",
    phone: "+221 78 284 85 46",
    hours: "Lundi - Vendredi: 8h00 - 17h30 | Samedi: 9h00 - 13h00",
    gps: {
      latPercent: 44,
      lngPercent: 11,
      lat: 14.7833,
      lng: -16.9167
    }
  },
  {
    id: "saint-louis-ismaila",
    name: "Agence Saint-Louis - Ismaïla",
    city: "Saint-Louis",
    address: "Quartier Sor, Rue de France, Saint-Louis",
    phone: "+221 77 049 56 18",
    hours: "Lundi - Vendredi: 8h00 - 17h00 | Samedi: 9h00 - 12h00",
    gps: {
      latPercent: 18,
      lngPercent: 12,
      lat: 16.0179,
      lng: -16.4896
    }
  },
  {
    id: "mbour-bella",
    name: "Agence Mbour - Bella",
    city: "Mbour",
    address: "Quartier Escale, Avenue de la République, Mbour",
    phone: "+221 77 686 62 81",
    hours: "Lundi - Vendredi: 8h00 - 17h00 | Samedi: 9h00 - 13h00",
    gps: {
      latPercent: 52,
      lngPercent: 9,
      lat: 14.4220,
      lng: -16.9639
    }
  }
];

export const PAMECAS_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Fatoumata Diop",
    role: "Commerçante de textiles au Marché Sandaga",
    quote: "Grâce au prêt Solutions de Crédit de PAMECAS, j'ai pu tripler mon stock de tissus avant la Tabaski. C'est l'avenir du commerce sénégalais qui est soutenu.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "t2",
    name: "Mamadou Syll",
    role: "Maraîcher et Coopérateur à Thiès",
    quote: "La formule d'épargne me rassure. Je place mes bénéfices après chaque récolte et je sais que mon argent travaille pour le développement local.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "t3",
    name: "Awa Ndiaye",
    role: "Entrepreneure en Technologies",
    quote: "Le service client PAMECAS Mobile est rapide, et le simulateur de crédit est d'une grande aide pour anticiper nos levées de fonds courantes.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  }
];

export const PAMECAS_ARTICLES: Article[] = [
  {
    id: "a1",
    title: "PAMECAS appuie le développement local de la jeunesse de Saint-Louis",
    date: "23 Mai 2026",
    summary: "Notre institution de microfinance a débloqué une enveloppe spéciale de 500 Millions de FCFA pour subventionner les micro-crédits pour les jeunes pêcheurs.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "a2",
    title: "Financement rapide : zoom sur le microcrédit agricole au Sénégal",
    date: "14 Avril 2026",
    summary: "Découvrez comment nos conseillers se déplacent à travers le pays pour valider et débloquer les crédits de semences en moins de 48 heures ouvrées.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "dépôt",
    label: "Dépôt Espèces - Agence Kaolack",
    date: "30 Mai 2026",
    amount: 50000,
    status: "reçu"
  },
  {
    id: "tx-2",
    type: "retrait",
    label: "Retrait GAB - Malick Sy",
    date: "28 Mai 2026",
    amount: -20000,
    status: "effectué"
  },
  {
    id: "tx-3",
    type: "virement",
    label: "Virement reçu - Solde Salaire",
    date: "25 Mai 2026",
    amount: 180000,
    status: "reçu"
  },
  {
    id: "tx-4",
    type: "facture",
    label: "Paiement Facture Senelec",
    date: "22 Mai 2026",
    amount: -35000,
    status: "effectué"
  }
];

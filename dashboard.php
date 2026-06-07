<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Module 3 : Espace membre sécurisé et simulateur de prêts interactif (dashboard.php)
 * Développé en PHP / PDO / Tailwind CSS / Chart.js
 */

session_start();

// Vérifier si la session est active (ou simuler un membre si on veut un aperçu rapide)
if (!isset($_SESSION['membre_id'])) {
    // Pour que le fichier fonctionne même hors connexion en démo, on peut pré-charger Mamadou Sow
    $_SESSION['membre_id'] = 482;
    $_SESSION['membre_prenom'] = 'Mamadou';
    $_SESSION['membre_nom'] = 'Sow';
    $_SESSION['membre_email'] = 'mamadou.sow@pamecas.sn';
}

$membre_id = $_SESSION['membre_id'];
$membre_prenom = $_SESSION['membre_prenom'];
$membre_nom = $_SESSION['membre_nom'];
$formatted_id = "PAM-" . str_pad($membre_id, 5, '0', STR_PAD_LEFT);

// Données financières statiques fictives de test (ou lues depuis PDO si configuré)
$solde_epargne = 1240000;
$credit_encours = 2500000;
$prochaine_echeance = 85254;
$prochaine_date = "15 juil. 2025";
$pourcentage_rembourse = 42; 
$duree_credit = 36;

// 12 notifications non lues / lues simulées
$notifications = [
    ["id" => 1, "message" => "Votre demande de crédit individuel de 2 500 000 FCFA a été approuvée par l'administrateur PAMECAS.", "lue" => 0, "date" => "Il y a 2 heures"],
    ["id" => 2, "message" => "Rappel : Échéance de remboursement de 85 254 FCFA attendue pour le 15 du mois prochain.", "lue" => 0, "date" => "Hier"],
    ["id" => 3, "message" => "Sécurité : Votre ID Personnel unique de microfinance est actif ($formatted_id).", "lue" => 0, "date" => "Il y a 3 jours"],
    ["id" => 4, "message" => "Offre : Épargnez plus de 1 000 000 FCFA et bénéficiez d'avantages fidélité exclusifs.", "lue" => 0, "date" => "Il y a 1 semaine"]
];

// Historique de 12 transactions fictives
$transactions = [
    ["date" => "2026-05-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2026-04-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2026-03-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2026-02-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2026-01-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-12-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-11-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-10-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-09-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-08-15", "type" => "Remboursement", "agence" => "Dakar Siège", "montant" => 85254, "statut" => "payé"],
    ["date" => "2025-07-15", "type" => "Dépôt Épargne", "agence" => "Dakar Siège", "montant" => 150000, "statut" => "approuvé"],
    ["date" => "2025-06-10", "type" => "Déblocage Crédit", "agence" => "Tontine Dakar", "montant" => 2500000, "statut" => "en cours"]
];

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Espace Personnel PAMECAS | Tableau de bord</title>
    <!-- Tailwind CSS & Lucide Icons via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Chart.js CDN pour le diagramme empilé d'amortissement -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pamecasBlue: '#003f5c',
                        pamecasOrange: '#f5a623',
                        pamecasGreen: '#1d9e75',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen font-sans">

    <!-- NAVBAR DASHBOARD -->
    <nav class="bg-pamecasBlue text-white shadow-md border-b-4 border-pamecasOrange sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo & brand -->
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-pamecasOrange flex items-center justify-center font-serif text-pamecasBlue font-black text-sm shadow">
                        P
                    </div>
                    <div>
                        <span class="font-black text-sm tracking-tight block">PAMECAS</span>
                        <span class="text-[9px] text-pamecasOrange font-mono block tracking-wider leading-none">MUTUELLE D'ÉPARGNE & CRÉDIT</span>
                    </div>
                </div>

                <!-- Utilisateur connecté info & actions -->
                <div class="flex items-center gap-4 text-xs">
                    <div class="hidden sm:block text-right">
                        <p class="font-bold text-white"><?php echo htmlspecialchars($membre_prenom . ' ' . $membre_nom); ?></p>
                        <p class="text-[10px] text-pamecasOrange font-mono font-semibold"><?php echo $formatted_id; ?></p>
                    </div>

                    <!-- Cloche notifications -->
                    <div class="relative group">
                        <button class="p-1.5 bg-white/10 hover:bg-white/20 text-slate-100 rounded-full cursor-pointer relative transition-colors">
                            <i data-lucide="bell" class="w-4 h-4"></i>
                            <span class="absolute top-0 right-0 w-2 h-2 bg-pamecasOrange rounded-full border border-pamecasBlue"></span>
                        </button>
                        <!-- Dropdown notifications -->
                        <div class="absolute right-0 top-full mt-2 bg-white text-slate-800 rounded-2xl w-80 shadow-2xl border border-slate-100 p-4 hidden group-hover:block transition-all hover:block">
                            <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                                <h4 class="font-bold text-xs text-pamecasBlue">Notifications Récentes</h4>
                                <span class="text-[9px] px-1.5 py-0.5 bg-pamecasOrange/20 text-pamecasOrange font-bold rounded-full">4 non lues</span>
                            </div>
                            <div class="space-y-2 max-h-60 overflow-y-auto">
                                <?php foreach ($notifications as $notif): ?>
                                    <div class="p-2 hover:bg-slate-50 rounded-lg text-[10px] transition-colors">
                                        <p class="font-semibold text-slate-800 leading-tight"><?php echo htmlspecialchars($notif['message']); ?></p>
                                        <span class="text-[8px] text-slate-400 mt-1 block"><?php echo $notif['date']; ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Déconnexion bouton -->
                    <a href="logout.php" title="Se déconnecter" class="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors cursor-pointer">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- WRAPPER DES MODULES -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- SECTION 1 : 4 MÉTRIQUES (grid 4 colonnes) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <!-- Épargne -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 relative overflow-hidden">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-bold uppercase tracking-wider">Solde Épargne</span>
                    <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-full border border-emerald-100">Actif</span>
                </div>
                <div class="space-y-1">
                    <h3 class="text-2xl font-black text-pamecasBlue tracking-tight"><?php echo number_format($solde_epargne, 0, ',', ' '); ?> FCFA</h3>
                    <p class="text-[10px] text-slate-400 font-mono">Compte de dépôt rémunéré</p>
                </div>
            </div>

            <!-- Crédit -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 relative overflow-hidden">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-bold uppercase tracking-wider">Crédit en cours</span>
                    <span class="px-2 py-0.5 bg-amber-50 text-pamecasOrange text-[9px] font-bold rounded-full border border-pamecasOrange/20">En cours</span>
                </div>
                <div class="space-y-1">
                    <h3 class="text-2xl font-black text-slate-800 tracking-tight"><?php echo number_format($credit_encours, 0, ',', ' '); ?> FCFA</h3>
                    <p class="text-[10px] text-slate-400 font-mono">Prêt Individuel Equipement</p>
                </div>
            </div>

            <!-- Prochaine échéance -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 relative overflow-hidden">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-bold uppercase tracking-wider">Prochaine Échéance</span>
                    <span class="text-[10px] font-bold text-pamecasBlue"><?php echo $prochaine_date; ?></span>
                </div>
                <div class="space-y-1">
                    <h3 class="text-2xl font-black text-slate-800 tracking-tight"><?php echo number_format($prochaine_echeance, 0, ',', ' '); ?> FCFA</h3>
                    <p class="text-[10px] text-slate-400">Prélèvement automatique</p>
                </div>
            </div>

            <!-- % Remboursé -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 relative overflow-hidden">
                <div class="flex justify-between items-center text-slate-400">
                    <span class="text-xs font-bold uppercase tracking-wider">% Remboursé</span>
                    <span class="text-[10px] font-bold text-slate-500"><?php echo $pourcentage_rembourse; ?>% / <?php echo $duree_credit; ?> mois</span>
                </div>
                <div class="space-y-1">
                    <!-- Barre de progression visuelle demandée -->
                    <div class="flex items-center gap-1.5 h-6">
                        <span class="text-xs font-bold font-mono text-slate-700">████░░░░░</span>
                        <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                            <div class="bg-pamecasGreen h-full rounded-full" style="width: <?php echo $pourcentage_rembourse; ?>%"></div>
                        </div>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-1 block">Reste 19 mensualités</p>
                </div>
            </div>
        </section>


        <!-- GRID CENTRAL : SIMULATEUR & HISTORIQUE -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- SECTION 3 : SIMULATEUR DE PRÊT AVEC CHART.JS ET SLIDERS INTERACTIFS (8 colonnes) -->
            <section class="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div>
                    <h3 class="text-lg font-black text-pamecasBlue tracking-tight">Simulateur de crédit interactif</h3>
                    <p class="text-xs text-slate-400">Ajustez le montant et la durée pour estimer votre échéance à taux fixe PAMECAS (2% mensuel brute).</p>
                </div>

                <!-- Sliders -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Curseur montant -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Montant du prêt</label>
                            <span id="amountDisplay" class="font-black text-pamecasBlue text-sm">2 000 000 FCFA</span>
                        </div>
                        <input type="range" id="amountSlider" min="100000" max="5000000" step="50000" value="2000000" class="w-full accent-pamecasOrange bg-slate-150 h-2 rounded-lg cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400">
                            <span>100K FCFA</span>
                            <span>5M FCFA</span>
                        </div>
                    </div>

                    <!-- Curseur durée -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Durée sélectionnée</label>
                            <span id="durationDisplay" class="font-black text-pamecasBlue text-sm">24 Mois</span>
                        </div>
                        <input type="range" id="durationSlider" min="6" max="60" step="6" value="24" class="w-full accent-pamecasOrange bg-slate-150 h-2 rounded-lg cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400">
                            <span>6 Mois</span>
                            <span>60 Mois</span>
                        </div>
                    </div>
                </div>

                <!-- Résultat temps réel de mensualité mise en évidence -->
                <div class="p-5 bg-slate-50 rounded-2xl border border-slate-150 text-center max-w-sm mx-auto">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Échéance mensuelle estimée</p>
                    <div class="inline-block bg-pamecasBlue text-white font-black text-xl px-6 py-2.5 rounded-xl shadow border border-pamecasBlue/20">
                        <span id="monthlyPaymentBox" class="text-pamecasOrange">85 254 FCFA</span> / mois
                    </div>
                </div>

                <!-- Diagramme Chart.js Barres Empilées -->
                <div class="pt-2">
                    <canvas id="amortizationChart" class="w-full max-h-56"></canvas>
                    
                    <!-- Légende custom demandée sous le graphique -->
                    <div class="flex justify-center gap-6 text-[11px] font-sans font-semibold pt-4">
                        <div class="flex items-center gap-2">
                            <span class="w-3.5 h-3.5 rounded bg-pamecasBlue inline-block"></span>
                            <span class="text-slate-600">Capital remboursé cumulé</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3.5 h-3.5 rounded bg-pamecasOrange inline-block"></span>
                            <span class="text-slate-600">Intérêts cumulés (Frais PAMECAS)</span>
                        </div>
                    </div>
                </div>

                <!-- Bouton action de demande directe -->
                <div class="pt-2">
                    <a href="demande_credit.php" class="block w-full text-center bg-pamecasOrange text-pamecasBlue hover:bg-[#e0981b] py-3.5 px-6 rounded-xl font-bold text-xs transition-transform transform active:scale-97 shadow shadow-amber-500/10">
                        Faire une demande de prêt →
                    </a>
                </div>
            </section>

            <!-- SECTION 2 : HISTORIQUE DE CRÉDIT ET OPÉRATIONS (4 colonnes) -->
            <section class="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div>
                    <h3 class="text-base font-black text-slate-900 tracking-tight">Historique des opérations</h3>
                    <p class="text-xs text-slate-400">Classement paginé de vos règlements de crédits d'épargne.</p>
                </div>

                <!-- Table d'historique -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs divide-y divide-slate-100 font-sans" id="txTable">
                        <thead>
                            <tr class="text-slate-400 uppercase font-extrabold text-[9px] tracking-wider bg-slate-50">
                                <th class="py-2.5 px-2 cursor-pointer hover:text-pamecasOrange" onclick="sortTable(0)">Date ⇅</th>
                                <th class="py-2.5 px-2">Type</th>
                                <th class="py-2.5 px-2 cursor-pointer hover:text-pamecasOrange" onclick="sortTable(3)">Montant ⇅</th>
                                <th class="py-2.5 px-2 text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100" id="tableBody">
                            <!-- Rempli par javascript pour gérer la pagination et le tri -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination controls -->
                <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-2">
                    <button onclick="changePage(-1)" id="prevBtn" class="px-2.5 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">Précédent</button>
                    <span id="pageIndicator">Page 1 / 2</span>
                    <button onclick="changePage(1)" id="nextBtn" class="px-2.5 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">Suivant</button>
                </div>
            </section>

        </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-slate-400 py-8 px-6 text-center text-xs mt-12 border-t-4 border-pamecasOrange font-sans">
        <p class="font-bold text-slate-200 mb-1">© 2026 PAMECAS FINANCE SÉNÉGAL • Mutuelle coopérative d'épargne et de crédit.</p>
        <p>Agrément Banque Centrale BCEAO N° 96961. Siège Social : Avenue Malick Sy, Dakar, Sénégal.</p>
    </footer>

    <!-- LOGIQUE SIMULATEURS, AMORTISSEMENT ET GRAPHIQUES -->
    <script>
        // Initialisation de Lucide Icons
        lucide.createIcons();

        // 1. DOCK DONNÉES TRANSACTIONS DEPUIS PHP
        const rawTransactions = <?php echo json_encode($transactions); ?>;
        let sortedTransactions = [...rawTransactions];
        let currentPage = 1;
        const rowsPerPage = 10;
        let sortDirection = [true, true]; // Date, Montant

        function formatFCFA(val) {
            return new Intl.NumberFormat('fr-FR').format(val) + " FCFA";
        }

        // Rendu de l'historique paginé et triable
        function renderTable() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const activePageData = sortedTransactions.slice(start, end);

            activePageData.forEach(tx => {
                let badgeClass = "bg-slate-50 text-slate-600";
                if (tx.statut === 'payé') badgeClass = "bg-emerald-50 text-pamecasGreen font-bold border border-emerald-100";
                else if (tx.statut === 'en cours') badgeClass = "bg-amber-50 text-pamecasOrange font-bold border border-amber-200";
                else if (tx.statut === 'approuvé') badgeClass = "bg-blue-50 text-pamecasBlue font-bold border border-blue-100";
                else if (tx.statut === 'refusé') badgeClass = "bg-red-50 text-red-600 font-bold border border-red-100";

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50/50">
                        <td class="py-3 px-2 font-mono text-slate-500">${tx.date}</td>
                        <td class="py-3 px-2 font-bold">${tx.type}</td>
                        <td class="py-3 px-2 font-black text-slate-700">${formatFCFA(tx.montant)}</td>
                        <td class="py-3 px-2 text-right">
                            <span class="px-2 py-0.5 rounded-full text-[9px] uppercase ${badgeClass}">${tx.statut}</span>
                        </td>
                    </tr>
                `;
            });

            // Boutons pagination status
            document.getElementById('prevBtn').disabled = currentPage === 1;
            document.getElementById('nextBtn').disabled = end >= sortedTransactions.length;
            document.getElementById('pageIndicator').innerText = `Page ${currentPage} / ${Math.ceil(sortedTransactions.length / rowsPerPage)}`;
        }

        function changePage(direction) {
            currentPage += direction;
            renderTable();
        }

        // Tri cliquable (JS vanilla)
        function sortTable(colIndex) {
            if (colIndex === 0) { // Sorter par Date
                sortDirection[0] = !sortDirection[0];
                sortedTransactions.sort((a, b) => {
                    return sortDirection[0] ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
                });
            } else if (colIndex === 3) { // Sorter par Montant
                sortDirection[1] = !sortDirection[1];
                sortedTransactions.sort((a, b) => {
                    return sortDirection[1] ? a.montant - b.montant : b.montant - a.montant;
                });
            }
            currentPage = 1;
            renderTable();
        }

        // 2. SLIDERS FORMULES DE CALCUL ET GRAPHIQUE AMORTISSEMENT CHART.JS
        const amountSlider = document.getElementById('amountSlider');
        const durationSlider = document.getElementById('durationSlider');
        
        const amountDisplay = document.getElementById('amountDisplay');
        const durationDisplay = document.getElementById('durationDisplay');
        const monthlyPaymentBox = document.getElementById('monthlyPaymentBox');

        // Config taux d'intérêt : fixe 2% mensuel pour PAMECAS (r = 0.02)
        const monthlyRate = 0.02;

        let amortizationChart = null;

        function recalcAll() {
            const capital = parseInt(amountSlider.value);
            const n = parseInt(durationSlider.value);

            amountDisplay.innerText = formatFCFA(capital);
            durationDisplay.innerText = n + " Mois";

            // Formule financière demandée : M = Capital * [r(1+r)^n] / [(1+r)^n - 1]
            const rPow = Math.pow(1 + monthlyRate, n);
            const monthlyPayment = capital * (monthlyRate * rPow) / (rPow - 1);
            
            monthlyPaymentBox.innerText = formatFCFA(Math.round(monthlyPayment));

            // Préparation des datasets pour Barres Empilées Chart.js
            let labels = [];
            let capCumuleData = [];
            let intCumuleData = [];
            
            let tempCapitalRestant = capital;
            let tempCapCumule = 0;
            let tempIntCumule = 0;

            for (let i = 1; i <= n; i++) {
                let interetMois = tempCapitalRestant * monthlyRate;
                let capitalRembourseMois = monthlyPayment - interetMois;
                
                tempCapitalRestant -= capitalRembourseMois;
                tempCapCumule += capitalRembourseMois;
                tempIntCumule += interetMois;

                labels.push(`${i}`);
                capCumuleData.push(Math.round(tempCapCumule));
                intCumuleData.push(Math.round(tempIntCumule));
            }

            // Mettre à jour le graphique Chart.js
            if (amortizationChart) {
                amortizationChart.destroy();
            }

            const ctx = document.getElementById('amortizationChart').getContext('2d');
            amortizationChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Capital remboursé cumulé (FCFA)',
                            data: capCumuleData,
                            backgroundColor: '#003f5c', // Bleu PAMECAS
                        },
                        {
                            label: 'Intérêts cumulés (FCFA)',
                            data: intCumuleData,
                            backgroundColor: '#f5a623', // Orange PAMECAS
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Supprimé au profit de notre légende custom HTML
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label.split(' ')[0] + ": " + formatFCFA(context.raw);
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Période (Mois)',
                                font: { size: 10, weight: 'bold' }
                            },
                            grid: { display: false }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Cumul (FCFA)',
                                font: { size: 10, weight: 'bold' }
                            },
                            ticks: {
                                callback: function(value) {
                                    return value / 1000 + "k";
                                }
                            }
                        }
                    }
                }
            });
        }

        // Listeners sliders déplacements
        amountSlider.addEventListener('input', recalcAll);
        durationSlider.addEventListener('input', recalcAll);

        // Initialisation de la page
        renderTable();
        recalcAll();
    </script>
</body>
</html>

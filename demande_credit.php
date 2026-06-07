<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Module 3 - Section 4 : Formulaire de demande de crédit (demande_credit.php)
 * Développé en PHP / PDO / Tailwind CSS
 */

session_start();
require_once 'includes/db.php'; // Connexion PDO

// Sécurisation de l'accès membre
if (!isset($_SESSION['membre_id'])) {
    header("Location: login.php");
    exit();
}

$membre_id = $_SESSION['membre_id'];
$errors = [];
$successMessage = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type_credit = $_POST['type_credit'] ?? '';
    $montant_souhaite = intval($_POST['montant_souhaite'] ?? 0);
    $duree_mois = intval($_POST['duree_mois'] ?? 0);
    $objet = trim($_POST['objet'] ?? '');
    $declaration = isset($_POST['declaration_honneur']);

    // Validations obligatoires
    if (empty($type_credit) || $montant_souhaite < 100000 || $montant_souhaite > 5000000 || $duree_mois < 6 || $duree_mois > 60 || empty($objet)) {
        $errors[] = "Veuillez renseigner correctement les détails de votre demande de prêt.";
    }
    if (!$declaration) {
        $errors[] = "Vous devez obligatoire signer la déclaration sur l'honneur pour soumettre.";
    }

    // Gestion du fichier justificatif importé (PDF ou image)
    $justificatif_chemin = null;
    if (isset($_FILES['justificatif']) && $_FILES['justificatif']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['justificatif']['tmp_name'];
        $fileName = $_FILES['justificatif']['name'];
        $fileSize = $_FILES['justificatif']['size'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        if (in_array($fileExtension, $allowedExtensions)) {
            if ($fileSize <= 5000000) { // Max 5 Mo
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
                $uploadFileDir = './uploads/';
                
                // s'il n'existe pas, créer le répertoire uploads
                if (!is_dir($uploadFileDir)) {
                    mkdir($uploadFileDir, 0755, true);
                }
                
                $dest_path = $uploadFileDir . $newFileName;
                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    $justificatif_chemin = $dest_path;
                } else {
                    $errors[] = "Une erreur s'est produite lors du déplacement du fichier téléchargé.";
                }
            } else {
                $errors[] = "Le fichier téléchargé dépasse la taille limite autorisée (5 Mo).";
            }
        } else {
            $errors[] = "Extension de justificatif non autorisée. Seuls PDF, JPG, PNG sont acceptés.";
        }
    } else {
        $errors[] = "Le justificatif de revenus (PDF ou Image) est obligatoire chez PAMECAS.";
    }

    // Insertion si aucune erreur
    if (empty($errors)) {
        try {
            // Requête préparée PDO pour l'insertion
            $stmt = $pdo->prepare("INSERT INTO demandes_credit (membre_id, type_credit, montant_souhaite, duree_mois, objet, justificatif, statut) VALUES (?, ?, ?, ?, ?, ?, 'en_attente')");
            $stmt->execute([$membre_id, $type_credit, $montant_souhaite, $duree_mois, $objet, $justificatif_chemin]);
            
            // Ajouter une notification membre complémentaire
            $notif_msg = "Votre nouvelle demande de crédit de " . number_format($montant_souhaite, 0, ',', ' ') . " FCFA (" . htmlspecialchars($type_credit) . ") a été déposée avec succès. Instruction en cours.";
            $stmt_notif = $pdo->prepare("INSERT INTO notifications (membre_id, message) VALUES (?, ?)");
            $stmt_notif->execute([$membre_id, $notif_msg]);

            // Simulation d'un email de confirmation de dépôt et d'une alerte admin
            /*
            // Email de confirmation d'instruction à l'emprunteur
            $mail->Subject = 'Instruction de votre demande de prêt PAMECAS';
            // Email d'alerte à l'administrateur de l'agence
            $mail_admin->Subject = 'ALERTE : Nouvelle demande de crédit à valider';
            */

            $successMessage = "Votre dossier de demande de crédit a été transmis au comité d'instruction PAMECAS de votre agence. Vous recevrez un rapport d'évaluation d'ici 48 heures ouvrables.";

        } catch (PDOException $e) {
            $errors[] = "Erreur d'insertion en base de données : " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de crédit solidaire ou individuel - PAMECAS SÉNÉGAL</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pamecasBlue: '#003f5c',
                        pamecasOrange: '#f5a623',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-2xl w-full mx-auto space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b pb-4 border-slate-200">
            <div class="flex items-center gap-3">
                <a href="dashboard.php" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </a>
                <div>
                    <h2 class="text-xl font-black text-slate-900 tracking-tight">Nouvelle Demande de Crédit</h2>
                    <p class="text-xs text-slate-400">Remplissez le dossier d'instruction pour validation par l'agence.</p>
                </div>
            </div>
            <span class="text-xs font-mono font-bold text-pamecasBlue bg-slate-100 px-3 py-1.5 rounded-xl border">
                Espace Instruction
            </span>
        </div>

        <!-- Form container -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            
            <?php if (!empty($errors)): ?>
                <div class="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    <?php foreach ($errors as $error) echo "<p class='mb-1'>• $error</p>"; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($successMessage)): ?>
                <div class="text-center py-6 space-y-4">
                    <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <i data-lucide="check" class="w-8 h-8"></i>
                    </div>
                    <h3 class="font-bold text-slate-900 text-lg">Dossier déposé avec succès !</h3>
                    <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        <?php echo $successMessage; ?>
                    </p>
                    <div class="pt-4">
                        <a href="dashboard.php" class="bg-pamecasBlue text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors">
                            Retourner au tableau de bord
                        </a>
                    </div>
                </div>
            <?php else: ?>

                <form method="POST" action="demande_credit.php" enctype="multipart/form-data" class="space-y-5 text-xs">
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Type -->
                        <div class="flex flex-col gap-1.5">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Type de Crédit souhaité *</label>
                            <select name="type_credit" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none transition-all">
                                <option value="">Choisir un type...</option>
                                <option value="solidaire">Crédit Solidaire (Groupe de caution)</option>
                                <option value="individuel">Crédit Individuel Équipement</option>
                                <option value="habitat">Crédit Financement Habitat</option>
                                <option value="agricole">Crédit de Financement Agricole</option>
                            </select>
                        </div>

                        <!-- Montant -->
                        <div class="flex flex-col gap-1.5">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Montant demandé (FCFA) *</label>
                            <input type="number" name="montant_souhaite" required min="100000" max="5000000" placeholder="Ex: 1500000" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none transition-all">
                            <p class="text-[9px] text-slate-400">Limites : entre 100 000 et 5 000 000 FCFA</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Durée -->
                        <div class="flex flex-col gap-1.5">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Durée de remboursement (Mois) *</label>
                            <input type="number" name="duree_mois" required min="6" max="60" placeholder="Ex: 24" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none transition-all">
                            <p class="text-[9px] text-slate-400">Limites : entre 6 et 60 mois</p>
                        </div>

                        <!-- Justificatif Upload -->
                        <div class="flex flex-col gap-1.5">
                            <label class="font-bold text-slate-500 uppercase tracking-wider">Justificatif de revenus *</label>
                            <input type="file" name="justificatif" required accept=".pdf,.jpg,.jpeg,.png" class="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200">
                            <p class="text-[9px] text-slate-400">PDF, JPG ou PNG (Max 5Mo). Dernier bulletin ou caution.</p>
                        </div>
                    </div>

                    <!-- Objet -->
                    <div class="flex flex-col gap-1.5">
                        <label class="font-bold text-slate-500 uppercase tracking-wider">Objet détaillé du crédit *</label>
                        <textarea name="objet" required placeholder="Décrivez en quelques mots l'objet de ce financement (ex: Achat d'une machine à coudre industrielle, etc.)..." rows="4" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none transition-all"></textarea>
                    </div>

                    <!-- Déclaration sur l'honneur obligatoire -->
                    <div class="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start gap-3">
                        <input type="checkbox" name="declaration_honneur" id="chk" required class="mt-0.5 accent-pamecasOrange h-4 w-4 cursor-pointer">
                        <label for="chk" class="text-[10px] text-slate-500 cursor-pointer select-none leading-relaxed">
                            Je soussigné certifie sur l'honneur l'exactitude des informations fournies ci-dessus et accepte d'ouvrir mon dossier à l'appréciation du comité de crédit de <span class="font-bold text-slate-700">PAMECAS</span>, conformément aux réglementations de la BCEAO en vigueur.
                        </label>
                    </div>

                    <!-- Submit action -->
                    <div class="pt-3 flex gap-3">
                        <a href="dashboard.php" class="flex-1 py-3 text-center border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-all">
                            Annuler
                        </a>
                        <button type="submit" class="flex-1 bg-pamecasBlue text-white hover:bg-slate-900 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                            Soumettre la demande de prêt
                        </button>
                    </div>

                </form>

            <?php endif; ?>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>

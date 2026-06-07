<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Réinitialisation du mot de passe (forgot.php)
 * Développé en PHP / PDO / Tailwind CSS
 */

session_start();
require_once 'includes/db.php'; // Connexion BDD

$errors = [];
$success = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

    if (!$email) {
        $errors[] = "Veuillez entrer une adresse e-mail valide.";
    } else {
        try {
            // Vérifier si le membre existe
            $stmt = $pdo->prepare("SELECT id, prenom FROM membres WHERE email = ?");
            $stmt->execute([$email]);
            $membre = $stmt->fetch();

            if ($membre) {
                // Générer un jeton aléatoire
                $token = bin2hex(random_bytes(32));
                $expiration = date('Y-m-d H:i:s', strtotime('+1 hour'));

                // Mettre à jour dans la table membres
                $stmt = $pdo->prepare("UPDATE membres SET reset_token = ?, reset_expiration = ? WHERE email = ?");
                $stmt->execute([$token, $expiration, $email]);

                // Simuler ou envoyer l'email de réinitialisation
                // ... code d'envoi ...

                $success = "Un e-mail contenant les instructions de réinitialisation de mot de passe a été envoyé à " . htmlspecialchars($email) . ".";
            } else {
                // Pour des raisons de sécurité, afficher le même succès même si l'e-mail n'existe pas
                $success = "Si cette adresse e-mail est enregistrée dans notre système, un e-mail de réinitialisation vous a été envoyé.";
            }
        } catch (PDOException $e) {
            $errors[] = "Erreur système : " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe oublié - PAMECAS SÉNÉGAL</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
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
<body class="bg-slate-50 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-md w-full mx-auto space-y-6">
        
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Mot de passe oublié</h2>
            <p class="mt-1 text-xs text-slate-500">Un lien sécurisé unique vous sera partagé par courrier électronique.</p>
        </div>

        <div class="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
            <?php if (!empty($errors)): ?>
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    <?php foreach ($errors as $error) echo "<p class='mb-0'>• $error</p>"; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($success)): ?>
                <div class="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                    • <?php echo $success; ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="forgot.php" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Votre adresse e-mail de compte</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-pamecasBlue text-white hover:bg-slate-900 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                        Demander un nouveau mot de passe
                    </button>
                </div>
            </form>

            <p class="text-center text-xs text-slate-500 mt-6">
                <a href="login.php" class="text-pamecasOrange font-bold hover:underline">Se connecter à nouveau</a>
            </p>
        </div>
    </div>
</body>
</html>

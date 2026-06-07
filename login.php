<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Module 2 : Connexion sécurisée des membres actifs (login.php)
 * Développé en PHP / PDO / Tailwind CSS
 */

session_start();
require_once 'includes/db.php'; // Connexion PDO

// Redirection si déjà connecté
if (isset($_SESSION['membre_id'])) {
    header("Location: dashboard.php");
    exit();
}

$errors = [];
$success = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (!$email || empty($password)) {
        $errors[] = "Veuillez renseigner correctement vos identifiants d'accès.";
    } else {
        try {
            // Requête préparée PDO pour charger le membre correspondant
            $stmt = $pdo->prepare("SELECT id, prenom, nom, password, statut FROM membres WHERE email = ?");
            $stmt->execute([$email]);
            $membre = $stmt->fetch();

            if ($membre) {
                // Vérification du statut de sécurité
                if ($membre['statut'] !== 'actif') {
                    $errors[] = "Votre compte n'est pas encore activé. Veuillez vérifier vos e-mails pour entrer votre code de confirmation ou cliquez sur le lien d'activation.";
                    // Optionnel : redirection vers verify.php?email=...
                } else {
                    // Vérification sécurisée du mot de passe crypté
                    if (password_verify($password, $membre['password'])) {
                        
                        // Régulation/Régénération d'ID de session pour prévenir le détournement de session
                        session_regenerate_id(true);

                        // Injection en session
                        $_SESSION['membre_id'] = $membre['id'];
                        $_SESSION['membre_prenom'] = $membre['prenom'];
                        $_SESSION['membre_nom'] = $membre['nom'];
                        $_SESSION['membre_email'] = $email;

                        header("Location: dashboard.php");
                        exit();
                    } else {
                        $errors[] = "Adresse e-mail ou mot de passe incorrect.";
                    }
                }
            } else {
                $errors[] = "Adresse e-mail ou mot de passe incorrect.";
            }
        } catch (PDOException $e) {
            $errors[] = "Erreur de base de données : " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Espace membre sécurisé - PAMECAS SÉNÉGAL</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
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
<body class="bg-slate-50 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-md w-full mx-auto space-y-6">
        
        <div class="text-center">
            <span class="inline-flex self-center px-4 py-2 bg-pamecasBlue text-pamecasOrange rounded-full font-bold text-xs tracking-wider uppercase shadow-xs">
                PAMECAS SECURE GATEWAY
            </span>
            <h2 class="mt-4 text-3xl font-black text-slate-900 tracking-tight">Accéder à mon espace</h2>
            <p class="mt-1 text-xs text-slate-500">Saisissez vos identifiants pour piloter vos demandes de prêts.</p>
        </div>

        <div class="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
            <?php if (!empty($errors)): ?>
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    <?php foreach ($errors as $error) echo "<p class='mb-1'>• $error</p>"; ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="login.php" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Adresse email sécurisée</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mot de passe d'accès</label>
                        <a href="forgot.php" class="text-[10px] text-pamecasOrange font-bold hover:underline">Mot de passe oublié ?</a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-pamecasBlue text-white hover:bg-slate-900 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                        Se connecter à l'espace membre
                    </button>
                </div>
            </form>

            <p class="text-center text-xs text-slate-500 mt-6">
                Pas encore de compte ? <a href="register.php" class="text-pamecasOrange font-bold hover:underline">S'inscrire chez PAMECAS</a>
            </p>
        </div>
    </div>
</body>
</html>

<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Module 1 : Inscription des membres et envoi de code de validation e-mail (register.php)
 * Développé en PHP / PDO / Tailwind CSS
 */

session_start();
require_once 'includes/db.php'; // Connexion PDO fictive ou réelle

// Générer un Token CSRF pour sécuriser la saisie
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$errors = [];
$success = "";

// Traitement POST de l'inscription
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validation du token CSRF
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die("Erreur de sécurité : Jeton CSRF invalide.");
    }

    // Récupération et nettoyage des valeurs
    $prenom = trim($_POST['prenom'] ?? '');
    $nom = trim($_POST['nom'] ?? '');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $telephone = trim($_POST['telephone'] ?? '');
    $agence_id = trim($_POST['agence_id'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validation des champs côté serveur (PDO)
    if (empty($prenom) || empty($nom) || !$email || empty($telephone) || empty($agence_id) || empty($password)) {
        $errors[] = "Veuillez remplir correctement tous les champs obligatoires.";
    }
    if (strlen($password) < 8) {
        $errors[] = "Le mot de passe doit mesurer au moins 8 caractères.";
    }
    if ($password !== $confirm_password) {
        $errors[] = "Les deux mots de passe ne correspondent pas.";
    }

    if (empty($errors)) {
        try {
            // Vérifier si l'adresse email existe déjà
            $stmt = $pdo->prepare("SELECT id FROM membres WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $errors[] = "Un membre possède déjà cette adresse e-mail chez PAMECAS.";
            } else {
                // Hachage du mot de passe
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                // Génération du code d'activation à 6 chiffres
                $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
                
                // Expiration dans 15 minutes
                $expiration = date('Y-m-d H:i:s', strtotime('+15 minutes'));

                // Insertion de l'utilisateur avec statut 'en_attente' de validation
                $stmt = $pdo->prepare("INSERT INTO membres (prenom, nom, email, telephone, agence_id, password, statut, code_verification, code_expiration) VALUES (?, ?, ?, ?, ?, ?, 'en_attente', ?, ?)");
                $stmt->execute([$prenom, $nom, $email, $telephone, $agence_id, $hashedPassword, $code, $expiration]);

                // ENVOI DE L'EMAIL VIA PHPMAILER (Imagerie et mise en page du code)
                /*
                // Exemple d'intégration PHPMailer réelle :
                use PHPMailer\PHPMailer\PHPMailer;
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = 'smtp.pamecas.sn';
                $mail->SMTPAuth = true;
                $mail->Username = 'inscription@pamecas.sn';
                $mail->Password = 'secret_password';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = 587;
                $mail->setFrom('securite@pamecas.sn', 'PAMECAS SÉCURITÉ');
                $mail->addAddress($email, "$prenom $nom");
                $mail->isHTML(true);
                $mail->Subject = 'Votre code de confirmation PAMECAS';
                */

                $mail_body = "
                <html>
                <body style='font-family: sans-serif; background-color: #f8fafc; padding: 20px;'>
                    <div style='max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;'>
                        <div style='background-color: #003f5c; padding: 24px; text-align: center; color: white;'>
                            <h2 style='margin: 0; font-size: 22px; color: #f5a623;'>PAMECAS FINANCE SÉNÉGAL</h2>
                            <p style='margin: 4px 0 0 0; font-size: 11px; opacity: 0.8;'>Agrément BCEAO N° 96961</p>
                        </div>
                        <div style='padding: 30px; text-align: center; color: #1e293b;'>
                            <h3 style='margin-top: 0;'>Bonjour $prenom,</h3>
                            <p style='font-size: 13px; line-height: 1.5; color: #64748b;'>
                                Merci pour votre inscription chez PAMECAS. Entrez le code de vérification ci-dessous pour activer votre espace personnel et débuter votre accompagnement financier.
                            </p>
                            
                            <div style='margin: 25px 0;'>
                                <div style='font-size: 11px; color: #94a3b8; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px;'>VOTRE CODE DE CONFIRMATION</div>
                                <div style='display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 14px 28px; font-size: 32px; font-weight: 800; color: #003f5c; letter-spacing: 6px;'>
                                    $code
                                </div>
                            </div>
                            
                            <p style='font-size: 12px; color: #f5a623; font-weight: bold;'>Ce code expire dans 15 minutes.</p>
                            <p style='font-size: 11px; color: #94a3b8;'>Ne le partagez avec personne.</p>
                        </div>
                        <div style='background-color: #f8fafc; padding: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8;'>
                            L'équipe PAMECAS Finance — Dakar, Sénégal
                        </div>
                    </div>
                </body>
                </html>
                ";

                // (Dans un script réel, appeler $mail->Body = $mail_body; $mail->send();)
                
                // Rediriger vers la page de vérification du code
                header("Location: verify.php?email=" . urlencode($email));
                exit();
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
    <title>PAMECAS SÉNÉGAL - Inscription Membre</title>
    <!-- Tailwind CSS via CDN -->
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
            <span class="inline-flex self-center px-4 py-2 bg-pamecasBlue text-pamecasOrange rounded-full font-bold text-xs tracking-wider uppercase shadow-sm">
                PAMECAS FINANCE SÉNÉGAL
            </span>
            <h2 class="mt-4 text-3xl font-black text-slate-900 tracking-tight">Créer mon compte unique</h2>
            <p class="mt-1 text-xs text-slate-500">Un code de validation d'identité vous sera envoyé par e-mail.</p>
        </div>

        <div class="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
            <?php if (!empty($errors)): ?>
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    <?php foreach ($errors as $error) echo "<p class='mb-1'>• $error</p>"; ?>
                </div>
            <?php endif; ?>

            <form id="registerForm" method="POST" action="register.php" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prénom</label>
                        <input type="text" name="prenom" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nom</label>
                        <input type="text" name="nom" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Adresse E-mail (Reçoit le code)</label>
                    <input type="email" id="email" name="email" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                    <p id="emailError" class="text-[10px] text-red-500 hidden mt-1 font-bold">L'adresse e-mail n'a pas un format valide.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Téléphone cellulaire</label>
                    <input type="tel" name="telephone" required placeholder="+221 77..." class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Agence de rattachement</label>
                    <select name="agence_id" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                        <option value="">Sélectionnez votre agence...</option>
                        <option value="1">Dakar - Siège Avenue Malick Sy</option>
                        <option value="2">Dakar - Rufisque</option>
                        <option value="3">Saint-Louis - Quartier Sor</option>
                        <option value="4">Kaolack</option>
                        <option value="5">Thiès</option>
                        <option value="6">Ziguinchor</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mot de passe (8 caractères min.)</label>
                    <input type="password" id="password" name="password" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                    <p id="passLengthError" class="text-[10px] text-red-500 hidden mt-1 font-bold">Le mot de passe doit posséder au moins 8 caractères.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmer le mot de passe</label>
                    <input type="password" id="confirm_password" name="confirm_password" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:outline-none text-xs transition-all">
                    <p id="passMatchError" class="text-[10px] text-red-500 hidden mt-1 font-bold">Les deux mots de passe ne correspondent pas.</p>
                </div>

                <div class="pt-2">
                    <button type="submit" id="submitBtn" class="w-full bg-pamecasBlue text-white hover:bg-slate-900 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                        Créer mon compte PAMECAS
                    </button>
                </div>
            </form>

            <p class="text-center text-xs text-slate-500 mt-6">
                Déjà membre ? <a href="login.php" class="text-pamecasOrange font-bold hover:underline">Se connecter</a>
            </p>
        </div>
    </div>

    <!-- JS Realtime client side validation -->
    <script>
        const form = document.getElementById('registerForm');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirm_password = document.getElementById('confirm_password');
        const submitBtn = document.getElementById('submitBtn');

        const emailError = document.getElementById('emailError');
        const passLengthError = document.getElementById('passLengthError');
        const passMatchError = document.getElementById('passMatchError');

        function validation() {
            let isValid = true;
            
            // Email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() && !emailRegex.test(email.value)) {
                emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
            }

            // Mdp >= 8 characters check
            if (password.value && password.value.length < 8) {
                passLengthError.classList.remove('hidden');
                isValid = false;
            } else {
                passLengthError.classList.add('hidden');
            }

            // Matching passwords check
            if (password.value && confirm_password.value && password.value !== confirm_password.value) {
                passMatchError.classList.remove('hidden');
                isValid = false;
            } else {
                passMatchError.classList.add('hidden');
            }

            return isValid;
        }

        email.addEventListener('input', validation);
        password.addEventListener('input', validation);
        confirm_password.addEventListener('input', validation);

        form.addEventListener('submit', function (e) {
            if (!validation()) {
                e.preventDefault();
                alert('Veuillez corriger les erreurs de saisie avant de soumettre.');
            }
        });
    </script>
</body>
</html>

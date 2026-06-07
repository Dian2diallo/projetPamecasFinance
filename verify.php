<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Page de validation du code à 6 chiffres par e-mail (verify.php)
 * Développé en PHP / PDO / Tailwind CSS
 */

session_start();
require_once 'includes/db.php'; // Connexion PDO fictive ou réelle

$errors = [];
$email = $_GET['email'] ?? '';

// Si aucun email fourni, retourner à l'inscription
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: register.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collecter les 6 inputs individuels
    $codeInputs = $_POST['code'] ?? [];
    $compiled_code = implode('', $codeInputs);

    if (strlen($compiled_code) !== 6 || !ctype_digit($compiled_code)) {
        $errors[] = "Veuillez entrer un code de sécurité valide de 6 chiffres.";
    } else {
        try {
            // Sélectionner le membre
            $stmt = $pdo->prepare("SELECT id, prenom, nom, code_verification, code_expiration FROM membres WHERE email = ? AND statut = 'en_attente'");
            $stmt->execute([$email]);
            $membre = $stmt->fetch();

            if (!$membre) {
                $errors[] = "Compte inexistant, déjà actif ou invalide.";
            } else {
                $current_time = date('Y-m-d H:i:s');
                
                // Vérifier l'exactitude du code
                if ($membre['code_verification'] !== $compiled_code) {
                    $errors[] = "Le code rentré est incorrect. Veuillez réessayer.";
                }
                // Vérifier la validité de l'expiration
                elseif ($membre['code_expiration'] < $current_time) {
                    $errors[] = "Ce code de validation a expiré (limite 15 minutes). Veuillez demander un nouveau code.";
                }
                else {
                    // Mettre à jour le statut du membre en "actif"
                    $member_id = $membre['id'];
                    $stmt = $pdo->prepare("UPDATE membres SET statut = 'actif', code_verification = NULL, code_expiration = NULL WHERE id = ?");
                    $stmt->execute([$member_id]);

                    // Démarrer la session de membre connecté à PAMECAS
                    $_SESSION['membre_id'] = $member_id;
                    $_SESSION['membre_prenom'] = $membre['prenom'];
                    $_SESSION['membre_nom'] = $membre['nom'];
                    $_SESSION['membre_email'] = $email;
                    
                    // Régénérer le jeton de session pour la sécurité (prévention fixation session)
                    session_regenerate_id(true);

                    // Redirection directe vers le tableau de bord sécurisé
                    header("Location: dashboard.php");
                    exit();
                }
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
    <title>Saisie du code de confirmation - PAMECAS SÉNÉGAL</title>
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
            <span class="inline-flex self-center px-4 py-2 bg-pamecasOrange text-pamecasBlue rounded-full font-bold text-xs tracking-wider uppercase shadow-xs">
                SÉCURITÉ PAMECAS
            </span>
            <h2 class="mt-4 text-3xl font-black text-slate-900 tracking-tight">Code de confirmation</h2>
            <p class="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Nous venons d'envoyer un code de validation d'identité par email à <span class="text-pamecasBlue font-bold underline"><?php echo htmlspecialchars($email); ?></span>.
            </p>
        </div>

        <div class="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
            <?php if (!empty($errors)): ?>
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                    <?php foreach ($errors as $error) echo "<p class='mb-1'>• $error</p>"; ?>
                </div>
            <?php endif; ?>

            <!-- Message indicatif d'AJAX pour le renvoi -->
            <div id="ajaxFeedback" class="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold hidden"></div>

            <form method="POST" action="verify.php?email=<?php echo urlencode($email); ?>" class="space-y-6">
                
                <div>
                    <label class="block text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Saisissez le code à 6 chiffres reçu dans votre boîte de messagerie
                    </label>
                    
                    <!-- 6 inputs individuels de code de confirmation en rangée -->
                    <div class="flex justify-between gap-2 max-w-xs mx-auto">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                        <input type="text" name="code[]" maxlength="1" required class="code-input w-11 h-11 text-center font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-pamecasOrange focus:bg-white focus:outline-none transition-all">
                    </div>
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-pamecasBlue text-white hover:bg-slate-900 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                        Confirmer le code d'activation
                    </button>
                </div>
            </form>

            <div class="mt-6 text-center text-xs text-slate-500">
                Vous n'avez pas reçu l'email ? <br>
                <a href="#" id="resendLink" class="text-pamecasOrange font-bold hover:underline inline-block mt-2">Renvoyer le code par e-mail</a>
            </div>
        </div>

        <div class="text-center">
            <a href="register.php" class="text-xs text-slate-500 hover:text-slate-800 underline">Retourner à l'inscription</a>
        </div>
    </div>

    <!-- JS Autofocus et navigation entre les 6 cases de code -->
    <script>
        const inputs = document.querySelectorAll('.code-input');

        inputs.forEach((input, index) => {
            // Empêcher l'encodage de caractères non-numériques
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (input.value === '') {
                        if (index > 0) {
                            inputs[index - 1].focus();
                            inputs[index - 1].value = '';
                        }
                    } else {
                        input.value = '';
                    }
                    e.preventDefault();
                } else if (e.key >= '0' && e.key <= '9') {
                    input.value = e.key;
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    e.preventDefault();
                } else if (e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                }
            });

            // Focus automatique lors de la saisie par coller
            input.addEventListener('paste', (e) => {
                const pasteData = e.clipboardData.getData('text');
                if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
                    inputs.forEach((inp, idx) => {
                        inp.value = pasteData[idx];
                    });
                    inputs[5].focus();
                }
                e.preventDefault();
            });
        });

        // Appel AJAX pour la réexpédition du code de vérification (resend_code.php)
        document.getElementById('resendLink').addEventListener('click', function(e) {
            e.preventDefault();
            const emailEncoded = encodeURIComponent('<?php echo $email; ?>');
            const feedbackBox = document.getElementById('ajaxFeedback');

            feedbackBox.classList.add('hidden');
            feedbackBox.innerText = '';

            fetch('resend_code.php?email=' + emailEncoded)
                .then(response => response.json())
                .then(data => {
                    feedbackBox.classList.remove('hidden');
                    if (data.success) {
                        feedbackBox.className = "mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold";
                        feedbackBox.innerText = data.message;
                    } else {
                        feedbackBox.className = "mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold";
                        feedbackBox.innerText = data.error || "Erreur de renvoi.";
                    }
                })
                .catch(error => {
                    feedbackBox.classList.remove('hidden');
                    feedbackBox.className = "mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold";
                    feedbackBox.innerText = "Une erreur réseau s'est produite.";
                });
        });
    </script>
</body>
</html>

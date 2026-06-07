<?php
/**
 * PAMECAS FINANCE SÉNÉGAL
 * Réexpédition du code à 6 chiffres par e-mail via appel AJAX (resend_code.php)
 * Développé en PHP / PDO
 */

header('Content-Type: application/json');
session_start();
require_once 'includes/db.php'; // Connexion PDO

$email = $_GET['email'] ?? '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => "Adresse email invalide ou absente."]);
    exit();
}

try {
    // Vérifier si le membre existe et est en attente
    $stmt = $pdo->prepare("SELECT id, prenom, nom FROM membres WHERE email = ? AND statut = 'en_attente'");
    $stmt->execute([$email]);
    $membre = $stmt->fetch();

    if (!$membre) {
        echo json_encode(['success' => false, 'error' => "Aucun compte en attente de validation pour cet email."]);
        exit();
    }

    // Régénérer un code à 6 chiffres
    $new_code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $expiration = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    // Mettre à jour dans la base
    $stmt = $pdo->prepare("UPDATE membres SET code_verification = ?, code_expiration = ? WHERE id = ?");
    $stmt->execute([$new_code, $expiration, $membre['id']]);

    // Simuler/envoyer l'email de confirmation via PHPMailer
    // ... code d'envoi ...

    echo json_encode([
        'success' => true,
        'message' => "Un nouveau code d'activation de 6 chiffres a été réexpédié à " . $email
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => "Erreur serveur : " . $e->getMessage()]);
}
exit();

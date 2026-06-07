-- ====================================================================
-- SCRIPT DE BASE DE DONNÉES PAMECAS SÉNÉGAL
-- Version : r2026.06.06
-- ====================================================================

-- Modification de la table membres pour ajouter les codes d'activation et de réinitialisation
ALTER TABLE membres
  ADD COLUMN code_verification VARCHAR(6) NULL,
  ADD COLUMN code_expiration DATETIME NULL,
  ADD COLUMN reset_token VARCHAR(64) NULL,
  ADD COLUMN reset_expiration DATETIME NULL,
  ADD COLUMN statut VARCHAR(20) DEFAULT 'en_attente' AFTER id;

-- Création de la table des notifications membres
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  membre_id INT NOT NULL,
  message TEXT NOT NULL,
  lue TINYINT(1) DEFAULT 0,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (membre_id) REFERENCES membres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Création d'une table exemple demandes_credit s'il elle n'existe pas encore
CREATE TABLE IF NOT EXISTS demandes_credit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  membre_id INT NOT NULL,
  type_credit VARCHAR(50) NOT NULL, -- solidaire, individuel, habitat, agricole
  montant_souhaite INT NOT NULL,
  duree_mois INT NOT NULL,
  objet TEXT NOT NULL,
  justificatif VARCHAR(255) NULL,
  statut VARCHAR(20) DEFAULT 'en_attente', -- en_attente, approuvé, rejeté
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (membre_id) REFERENCES membres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion de données de test réalistes pour l'environnement PAMECAS
-- 1. Un membre actif : Mamadou Sow (ID: PAM-00482)
-- Mot de passe haché par défaut (exemple: 'pamecasSecurity2026')
INSERT INTO membres (id, prenom, nom, email, telephone, statut, solde_epargne, agence_id)
VALUES (482, 'Mamadou', 'Sow', 'mamadou.sow@pamecas.sn', '+221 77 412 85 96', 'actif', 1240000, 1)
ON DUPLICATE KEY UPDATE statut = 'actif', solde_epargne = 1240000;

-- 2. Crédit d'un montant de 2 500 000 FCFA sur 36 mois à taux de 2%
INSERT INTO demandes_credit (membre_id, type_credit, montant_souhaite, duree_mois, objet, statut)
VALUES (482, 'individuel', 2500000, 36, 'Financement de matériel de commerce', 'approuve');

-- 3. Ajout de 4 notifications non lues pour Mamadou Sow
INSERT INTO notifications (membre_id, message, lue) VALUES
(482, 'Votre demande de crédit individuel de 2 500 000 FCFA a été approuvée par l\'administrateur PAMECAS.', 0),
(482, 'Rappel : Échéance de remboursement de 85 254 FCFA attendue pour le 15 du mois prochain.', 0),
(482, 'Sécurité : Votre ID Personnel unique de microfinance est actif (PAM-00482).', 0),
(482, 'Offre : Épargnez plus de 1 000 000 FCFA et bénéficiez d\'avantages fidélité exclusifs.', 0);

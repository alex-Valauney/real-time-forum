# Real-Time Forum

## 01. Introduction

Ce document présente la conception et les spécifications techniques d’un forum en temps réel.  
L'objectif principal de ce projet est de permettre aux utilisateurs d’échanger des messages instantanément, de publier des contenus (posts) visibles par tous les membres, ainsi que d’utiliser un système de messagerie privée.  

Le site doit fonctionner avec une seule page HTML, proposer une expérience fluide, sécurisée, et accessible dès l’inscription. Les utilisateurs doivent pouvoir s’inscrire, se connecter, publier des messages publics et privés, et interagir avec les autres membres de la communauté en temps réel.

---

## 02. Cahier des charges

Pour ce forum, les contraintes suivantes ont été définies :

- Le site ne doit utiliser qu’une seule page HTML.
- La première interaction doit être une **connexion** ou une **inscription**.

### Lors de l'inscription, l'utilisateur doit fournir les informations suivantes :
- Pseudo
- Âge (minimum 13 ans)
- Genre
- Prénom
- Nom de famille
- Adresse e-mail
- Mot de passe

### Connexion :
- L’utilisateur peut se connecter avec :
  - Son **pseudo** ou son **adresse e-mail**
  - Son **mot de passe**

### Fonctionnalités :
- Déconnexion possible depuis n’importe quel appareil.
- Affichage :
  - Liste des personnes **connectées**
  - Liste des personnes **déconnectées**
- Les listes doivent être classées par ordre du **dernier message envoyé**.

### Messages privés :
- Chaque message privé doit inclure :
  - Le **pseudo de l’émetteur**
  - La **date d’envoi** du message
- Les messages sont affichés **par lot de 10**.

### Publications publiques (posts) :
- Les utilisateurs doivent pouvoir **créer des posts** visibles par tous les membres.
- Chaque post doit inclure :
  - Le **contenu**
  - Le **pseudo de l’auteur**
  - La **date de publication**

---

## 03. Choix des technologies

- **JavaScript** : imposé par le client pour le développement front-end.
- **HTML / CSS** : pour la structure et le design du site.
- **SQLite** :
  - Choisi pour sa simplicité d’utilisation
  - Ne nécessite pas de serveur
  - Idéal pour de petits sites web
- **bcrypt** :
  - Imposé par le client pour sécuriser les mots de passe
- **Go (Golang)** :
  - Utilisé pour l’interaction avec la base de données
  - Gestion du serveur et des fonctionnalités back-end

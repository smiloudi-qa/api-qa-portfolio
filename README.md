# 🧪 Automated API Testing Suite - Restful Booker

![CI/CD](https://github.com/smiloudi-qa/api-qa-portfolio/actions/workflows/api-tests.yml/badge.svg)
![Framework](https://img.shields.io/badge/Framework-Playwright_API-green)
![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen?logo=node.js)
![Status](https://img.shields.io/badge/Tests-Passing-brightgreen)

## 📌 Présentation du Projet
Suite de tests automatisés pour valider les endpoints REST de l'API publique **Restful Booker**.
Ce projet démontre la mise en œuvre de tests d'intégration backend avec **Playwright**, combinés à une exécution continue via **GitHub Actions**.

---

## 🎯 Couverture & Scénarios de Test
- **Authentification (`POST /auth`) :** Génération dynamique du token d'administration.
- **Création de ressource (`POST /booking`) :** Validation du code 200, vérification des types et des données créées.
- **Consultation (`GET /booking/{id}`) :** Récupération de la ressource par son identifiant unique.
- **Cas négatif / Gestion d'erreur (`GET /booking/999999`) :** Validation du code HTTP 404 sur ID inexistant.
- **Suppression sécurisée (`DELETE /booking/{id}`) :** Suppression d'une ressource avec authentification par Cookie/Token.

---

## 🛠️ Stack Technique
- **Moteur de test :** Playwright Test (API Engine)
- **Langage :** JavaScript (Node.js ES Modules)
- **CI/CD :** GitHub Actions
- **Rapports :** Playwright HTML Report

---

## 🚀 Installation & Exécution Locale

```bash
# 1. Cloner le dépôt
git clone [https://github.com/smiloudi-qa/api-qa-portfolio.git](https://github.com/smiloudi-qa/api-qa-portfolio.git)
cd api-qa-portfolio

# 2. Installer les dépendances
npm install

# 3. Lancer les tests
npm test

# 4. Afficher le rapport HTML
npm run test:report
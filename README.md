# 🧪 Automated REST API Testing Suite

![CI/CD](https://github.com/smiloudi-qa/api-qa-portfolio/actions/workflows/api-tests.yml/badge.svg)
![Framework](https://img.shields.io/badge/Framework-Playwright_API-green)
![Schema Validation](https://img.shields.io/badge/Schema-Ajv_JSON_Schema-orange)
![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen?logo=node.js)
![Status](https://img.shields.io/badge/Tests-Passing-brightgreen)

## 📌 Présentation du Projet
Projet d'automatisation de tests d'intégration et de validation de contrats backend sur des API REST publiques (**Restful Booker** et **FakeStore API**).

Ce dépôt démontre la mise en œuvre de bonnes pratiques QA :
- Validation de contrats d'API avec **JSON Schema** (`ajv`).
- Gestion des flux d'authentification (Tokens JWT / Cookies).
- Tests fonctionnels CRUD complets et scénarios d'erreur (4xx/5xx).
- Vérification des SLA de performance sur les temps de réponse.
- Intégration continue automatisée via **GitHub Actions**.

---

## 🎯 Suites de Tests Couvertes

### 1. Booking API (`tests/booking.spec.js`)
- `POST /auth` : Génération du token d'administration.
- `POST /booking` : Création de ressource et validation des types.
- `GET /booking/{id}` : Récupération et vérification de la persistance.
- `GET /booking/999999` : Test négatif (404 Not Found).
- `DELETE /booking/{id}` : Suppression sécurisée avec Cookie d'authentification.

### 2. FakeStore E-commerce API (`tests/fakestore-ecommerce.spec.js`)
- `POST /auth/login` : Authentification JWT nominale et test d'échec (mot de passe invalide).
- `GET /products/1` : Validation stricte de contrat de données avec **Ajv**.
- `GET /products` : Contrôle de pagination et seuil de temps de réponse (SLA).
- `POST /carts` : Création et validation d'un panier d'achat client.

---

## 🛠️ Stack Technique
- **Framework :** Playwright Test
- **Validation de contrat :** Ajv (JSON Schema validator)
- **Langage :** JavaScript (Node.js ES Modules)
- **CI/CD :** GitHub Actions

---

## 🚀 Installation & Exécution

```bash
# Cloner le projet
git clone [https://github.com/smiloudi-qa/api-qa-portfolio.git](https://github.com/smiloudi-qa/api-qa-portfolio.git)
cd api-qa-portfolio

# Installer les dépendances
npm install

# Exécuter l'ensemble des suites de tests
npm test

# Consulter le rapport HTML
npm run test:report
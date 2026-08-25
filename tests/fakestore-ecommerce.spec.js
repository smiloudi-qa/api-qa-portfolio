import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();
const BASE_URL = 'https://dummyjson.com';

// Schéma JSON strict pour la validation de contrat
const productSchema = {
  type: 'object',
  required: ['id', 'title', 'price', 'category', 'stock', 'rating'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    category: { type: 'string' },
    stock: { type: 'number' },
    rating: { type: 'number' },
  },
};

test.describe('E-commerce API - DummyJSON Test Suite', () => {

  // 1. Authentification nominale avec token JWT
  test('POST /auth/login - Connexion réussie et récupération du Token JWT', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'emilys',
        password: 'emilyspass',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(typeof body.accessToken).toBe('string');
  });

  // 2. Test négatif d'authentification
  test('POST /auth/login - Échec avec mot de passe invalide', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'emilys',
        password: 'wrong_password_123',
      },
    });

    expect(response.status()).toBe(400);
  });

  // 3. Validation de contrat JSON Schema avec Ajv
  test('GET /products/1 - Validation stricte du schéma JSON du produit', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/1`);
    expect(response.status()).toBe(200);

    const product = await response.json();
    const validate = ajv.compile(productSchema);
    const isValid = validate(product);

    expect(isValid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  // 4. Consultation du catalogue avec pagination et SLA
  test('GET /products - Vérifier la pagination et le temps de réponse', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/products?limit=5`);
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(3000); // Seuil de performance

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(5);
  });

  // 5. Création d'un panier d'achat
  test('POST /carts/add - Créer un panier pour un client', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/carts/add`, {
      data: {
        userId: 1,
        products: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.userId).toBe(1);
    expect(body.products.length).toBe(2);
  });

});
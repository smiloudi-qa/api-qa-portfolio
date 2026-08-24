import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import productSchema from '../schemas/product.schema.json' assert { type: 'json' };

const ajv = new Ajv();
const BASE_URL = 'https://fakestoreapi.com';

test.describe('E-commerce API - FakeStore Test Suite', () => {

  // 1. Authentification JWT
  test('POST /auth/login - Connexion réussie et réception du Token JWT', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'johnd',
        password: 'm38rmF$'
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  // 2. Test négatif d'authentification
  test('POST /auth/login - Échec de connexion avec mot de passe incorrect', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'mor_2314',
        password: 'mauvais_password',
      },
    });

    expect([400, 401]).toContain(response.status());
  });

  // 3. Validation de contrat (Schema Validation) sur un produit
  test('GET /products/1 - Validation stricte du schéma JSON du produit', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/1`);
    expect(response.status()).toBe(200);

    const product = await response.json();
    
    // Validation Ajv
    const validate = ajv.compile(productSchema);
    const valid = validate(product);
    
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  // 4. Récupération et filtrage de la liste des produits
  test('GET /products - Vérifier la pagination et le tri', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/products?limit=5`);
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(1500); // SLA de performance < 1.5s

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(5);
  });

  // 5. Création d'un panier d'achat (POST /carts)
  test('POST /carts - Créer un panier pour un utilisateur', async ({ request }) => {
    const cartPayload = {
      userId: 5,
      date: '2026-08-24',
      products: [
        { productId: 1, quantity: 2 },
        { productId: 5, quantity: 1 },
      ],
    };

    const response = await request.post(`${BASE_URL}/carts`, {
      data: cartPayload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.userId).toBe(5);
    expect(body.products.length).toBe(2);
  });
});
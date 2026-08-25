import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();
const BASE_URL = 'https://fakestoreapi.com';

const productSchema = {
  type: 'object',
  required: ['id', 'title', 'price', 'category', 'description', 'image', 'rating'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
    category: { type: 'string' },
    image: { type: 'string' },
    rating: {
      type: 'object',
      required: ['rate', 'count'],
      properties: {
        rate: { type: 'number' },
        count: { type: 'number' },
      },
    },
  },
};

test.describe('E-commerce API - FakeStore Test Suite', () => {

  test('POST /auth/login - Connexion réussie et récupération du Token JWT', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'johnd',
        password: 'm38rmF$',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('POST /auth/login - Échec avec mot de passe invalide', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: {
        username: 'johnd',
        password: 'wrong_password_123',
      },
    });

    expect([400, 401]).toContain(response.status());
  });

  test('GET /products/1 - Validation stricte du schéma JSON du produit', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/1`);
    expect(response.status()).toBe(200);

    const product = await response.json();
    const validate = ajv.compile(productSchema);
    const isValid = validate(product);

    expect(isValid).toBe(true);
  });

  test('GET /products - Vérifier la pagination et le temps de réponse', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/products?limit=5`);
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(3000);

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(5);
  });

  test('POST /carts - Créer un panier pour un client', async ({ request }) => {
    const cartPayload = {
      userId: 1,
      date: '2020-02-03',
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    const response = await request.post(`${BASE_URL}/carts`, {
      data: cartPayload,
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body).toHaveProperty('id');
  });

});
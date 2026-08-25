import { test, expect } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

test.describe('API Booking - Suite CRUD & Validation', () => {
  let token;
  let bookingId;

  test('POST /auth - Générer un token d administration', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    token = body.token;
  });

  test('POST /booking - Créer une nouvelle réservation', async ({ request }) => {
    const payload = {
      firstname: 'Slaheddine',
      lastname: 'Miloudi',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-09-01',
        checkout: '2026-09-05',
      },
      additionalneeds: 'Breakfast',
    };

    const response = await request.post(`${BASE_URL}/booking`, {
      data: payload,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body.booking.firstname).toBe('Slaheddine');
    bookingId = body.bookingid;
  });

  test('GET /booking/{id} - Récupérer la réservation', async ({ request }) => {
    test.skip(!bookingId, 'Booking ID non disponible');

    const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.lastname).toBe('Miloudi');
  });

  test('GET /booking/999999 - Retourner 404 pour un ID inexistant', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/booking/999999`);
    expect(response.status()).toBe(404);
  });

  test('DELETE /booking/{id} - Supprimer la réservation', async ({ request }) => {
    test.skip(!bookingId || !token, 'Token ou Booking ID non disponible');

    const response = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    expect(response.status()).toBe(201);
  });
});
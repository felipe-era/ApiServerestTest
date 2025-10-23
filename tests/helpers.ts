import { APIRequestContext, expect } from '@playwright/test';

export type CreatedUser = {
  _id: string;
  email: string;
  password: string;
  nome: string;
  administrador: 'true' | 'false';
};

export async function createRandomUser(
  request: APIRequestContext,
  admin: 'true' | 'false' = 'true'
): Promise<CreatedUser> {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1e4)}`;
  const payload = {
    nome: `Felipe QA ${suffix}`,
    email: `fee.qa.${suffix}@example.com`,
    password: 'TestePass123',
    administrador: admin
  };

  const res = await request.post('/usuarios', { data: payload });
  expect(res.status(), 'Status ao criar usuário').toBe(201);

  const body = await res.json();
  expect(body).toHaveProperty('_id');

  return {
    _id: body._id,
    email: payload.email,
    password: payload.password,
    nome: payload.nome,
    administrador: admin
  };
}

export async function loginAndGetToken(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const res = await request.post('/login', { data: { email, password } });
  expect(res.status(), 'Status do login').toBe(200);

  const body = await res.json();
  expect(body).toHaveProperty('authorization');

  const token: string = body.authorization.startsWith('Bearer ')
    ? body.authorization
    : `Bearer ${body.authorization}`;

  return token;
}

export async function deleteUser(
  request: APIRequestContext,
  id: string,
  token?: string
) {
  const headers = token ? { Authorization: token } : undefined;
  const res = await request.delete(`/usuarios/${id}`, { headers });

  expect([200, 404]).toContain(res.status());

  if (res.status() === 200) {
    const body = await res.json();
    expect(body).toHaveProperty('message');
  }
}

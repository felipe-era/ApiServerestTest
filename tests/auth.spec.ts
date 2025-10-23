import { test, expect } from '@playwright/test';

test('POST /login - deve rejeitar login com dados incorretos', async ({ request }) => {
    const res = await request.post('/login', { data: { email: 'naoexiste@example.com', password: 'errado' } });
    expect([400, 401]).toContain(res.status());
});
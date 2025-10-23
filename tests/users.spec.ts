import { test, expect } from '@playwright/test';
import { createRandomUser, loginAndGetToken, deleteUser, CreatedUser } from './helpers';

test.describe.serial('Fluxo validação e testes de usuários - ServeRest', () => {
    let created: CreatedUser;
    let token: string;


    test('CT001 - POST /usuarios - deve registrar novo usuário com sucesso', async ({ request }) => {
        created = await createRandomUser(request, 'true');
    });

    test('CT002 - POST /login - deve autenticar usuário e retornar token JWT', async ({ request }) => {
        token = await loginAndGetToken(request, created.email, created.password);
        expect(token).toMatch(/^Bearer\s.+/);
    });

    test('CT003 - POST /usuarios - deve falhar sem campos obrigatórios', async ({ request }) => {
        const res = await request.post('/usuarios', { data: { nome: 'SemEmail' } as any });
        expect(res.status()).toBe(400);
        const body = await res.json();

        expect(body).toEqual(expect.objectContaining({
            email: expect.stringMatching(/obrigatório/i),
            password: expect.stringMatching(/obrigatório/i),
            administrador: expect.stringMatching(/obrigatório/i),
        }));
    });

    test('CT004 - GET /usuarios - deve obter lista de usuários cadastrados', async ({ request }) => {
        const res = await request.get('/usuarios');
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('quantidade');
        expect(Array.isArray(body.usuarios)).toBeTruthy();
    });

    test('CT005 - GET /usuarios/{id} - deve consultar informações de um usuário específico', async ({ request }) => {
        const res = await request.get(`/usuarios/${created._id}`);
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toMatchObject({
            nome: created.nome,
            email: created.email,
            administrador: created.administrador,
            _id: created._id
        });
    });

    test('CT006 - PUT /usuarios/{id} - deve editar dados do usuário existente', async ({ request }) => {
        const novoNome = created.nome + ' Editado';
        const res = await request.put(`/usuarios/${created._id}`, {
            data: {
                nome: novoNome,
                email: created.email,
                password: created.password,
                administrador: created.administrador
            },
            headers: { Authorization: token }
        });
        expect(res.ok()).toBeTruthy();
        const check = await request.get(`/usuarios/${created._id}`);
        const body = await check.json();
        expect(body.nome).toBe(novoNome);
    });

    test('CT007 - NEGATIVO - deve impedir cadastro com e-mail já existente', async ({ request }) => {
        const res = await request.post('/usuarios', {
            data: {
                nome: 'Duplicado',
                email: created.email,
                password: 'abc123',
                administrador: 'false'
            }
        });
        expect([400, 409]).toContain(res.status());
        const body = await res.json();
        expect(body).toHaveProperty('message');
    });

    test('CT008 - PUT /usuarios/{id} - deve falhar ao usar e-mail já existente', async ({ request }) => {
        const alt = await createRandomUser(request, 'false');
        const res = await request.put(`/usuarios/${created._id}`, {
            data: { ...created, email: alt.email },
            headers: { Authorization: token }
        });
        expect([400, 409]).toContain(res.status());
    });

    test('CT009 - PUT /usuarios/{id} - comportamento sem token (documentar)', async ({ request }) => {
        const beforeRes = await request.get(`/usuarios/${created._id}`);
        expect(beforeRes.ok()).toBeTruthy();
        const before = await beforeRes.json();

        const tentativa = before.nome + ' X';

        // tenta atualizar SEM token
        const res = await request.put(`/usuarios/${created._id}`, {
            data: {
                nome: tentativa,
                email: created.email,
                password: created.password,
                administrador: created.administrador
            }
        });

        if (res.status() >= 200 && res.status() < 300) {
            const after = await (await request.get(`/usuarios/${created._id}`)).json();
            expect(after.nome).toBe(tentativa); // comportamento observado no ServeRest
        } else {
            const after = await (await request.get(`/usuarios/${created._id}`)).json();
            expect(after.nome).toBe(before.nome); // comportamento esperado em APIs que exigem JWT
        }
    });

    test('CT010 - DELETE /usuarios/{id} - deve remover usuário do sistema', async ({ request }) => {
        await deleteUser(request, created._id, token);
    });

    test('CT011 - DELETE /usuarios/{id} - deve lidar com id inexistente', async ({ request }) => {
        const res = await request.delete('/usuarios/aaaaaaaaaaaaaaaaaaaaaaaa');
        expect([200, 404]).toContain(res.status());
    });

    test('CT012 - NEGATIVO - deve retornar 404 ao buscar usuário inexistente', async ({ request }) => {
        const res = await request.get('/usuarios/99999999999999999999');
        expect([400, 404]).toContain(res.status());
    });
});
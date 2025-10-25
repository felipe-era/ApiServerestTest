# Projeto de Automação de Testes de API com Playwright

Este projeto é uma solução para o **Desafio de Automação de Testes de API**, focado em garantir 100% de cobertura funcional e de validação para um CRUD de usuários.

Os testes foram desenvolvidos utilizando **Playwright** e **TypeScript** para validar os endpoints da API de demonstração [ServeRest](https://serverest.dev/#/), que gerencia o cadastro, autenticação, consulta, atualização e exclusão de usuários.

## Informações da última RUN em CI/CD
https://github.com/felipe-era/ApiServerestTest/actions/runs/18750009193

## Tecnologias Utilizadas

| Ferramenta | Propósito |
| :--- | :--- |
| **Playwright** | Framework principal para execução dos testes de API (`@playwright/test`) |
| **TypeScript** | Linguagem para escrita dos testes e tipagem |
| **Node.js** | Ambiente de execução |
| **GitHub Actions** | Integração Contínua (CI/CD) e geração de artefatos |
| **Playwright HTML Reporter**| Geração de relatórios de execução |
| **Git & GitHub** | Controle de versão e hospedagem do código |

## Funcionalidades e Cobertura

Este projeto atende a todos os requisitos do desafio, incluindo:

* **Cobertura Completa do CRUD**: Validação de todos os endpoints (`POST`, `GET`, `PUT`, `DELETE`) para `/usuarios`.
* **Gerenciamento de Autenticação JWT**: Testes que obtêm um token (`POST /login`) e o utilizam em requisições autenticadas (`PUT`, `DELETE`).
* **Testes de Cenários Negativos**: Cobertura de casos de falha, como:
    * Tentativa de cadastro sem campos obrigatórios.
    * Tentativa de cadastro com e-mail duplicado.
    * Busca por IDs inexistentes.
* **Abstração e Helpers**: Funções auxiliares (`createRandomUser`, `loginAndGetToken`, `deleteUser`) são usadas para criar e limpar dados de teste, mantendo os testes limpos e reutilizáveis (similar ao padrão Page Object, mas para APIs).
* **Geração de Relatórios**: O [Playwright HTML Reporter](https://playwright.dev/docs/reporter-html) é usado para gerar relatórios detalhados automaticamente.
* **Integração Contínua (CI/CD)**: O projeto está configurado com um pipeline de **GitHub Actions** (`.github/workflows/ci.yml`).

## Cenários de Teste Cobertos

A suíte de testes (baseada no código fornecido) cobre os seguintes cenários:

### Endpoints: `POST /usuarios` e `POST /login`
* **CT001:** Deve registrar um novo usuário com sucesso.
* **CT002:** Deve autenticar um usuário válido e retornar um token JWT.
* **CT003:** Deve falhar ao tentar registrar sem os campos obrigatórios (email, password, etc.).
* **CT007:** Deve falhar ao tentar registrar um e-mail já existente.

### Endpoints: `GET /usuarios`
* **CT004:** Deve obter a lista completa de usuários cadastrados.
* **CT005:** Deve consultar as informações de um usuário específico por ID.
* **CT012:** Deve retornar erro (4xx) ao buscar um usuário com ID inexistente.

### Endpoint: `PUT /usuarios/{id}`
* **CT006:** Deve editar com sucesso os dados de um usuário existente (requer token).
* **CT008:** Deve falhar ao tentar atualizar um usuário usando um e-mail já existente (requer token).
* **CT009:** Deve validar o comportamento da API ao tentar editar sem um token de autenticação.

### Endpoint: `DELETE /usuarios/{id}`
* **CT010:** Deve remover um usuário com sucesso (requer token).
* **CT011:** Deve lidar corretamente com a tentativa de exclusão de um ID inexistente.

---

## Configuração do Ambiente

### Pré-requisitos

* **Node.js** (v18+ recomendado)
* **Git**

---

## Como Executar

### 1. Instalação

1.  Clone este repositório:
    ```bash
    git clone https://github.com/felipe-era/ApiServerestTest.git
    cd ApiServerestTest
    ```
2.  Instale as dependências do Playwright:
    ```bash
    npm install
    ```
3.  O Playwright precisa instalar seus navegadores (embora não sejam usados para API, fazem parte do pacote).
    ```bash
    npx playwright install
    ```

### 2. Execução dos Testes

Para rodar todos os testes de API em modo *headless* (terminal), execute:

```bash
npx playwright test

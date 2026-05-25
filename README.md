# Adota Pet — Plataforma de Adoção de Animais

Aplicativo móvel de **impacto social**: conecta tutores que precisam encontrar um novo lar para seus pets com pessoas que desejam adotar, de forma simples e completamente gratuita.

Trabalho prático da disciplina **Programação para Dispositivos Móveis (Android)**.

---

## Disciplina

**Disciplina:** Programação para Dispositivos Móveis em Android  
**Professor:** Julio Cartier  
**Aluno:** João Pedro Costa — MAT. 202403365511

---

## Problema Social

Morando em Florianópolis (Governador Celso Ramos), percebi que é muito comum ver situações em que animais precisam de um novo lar de uma hora para outra: a cachorra teve filhotes, aparece uma caixa cheia de gatinhos na porta de casa, ou o tutor precisa se mudar e não consegue levar o pet. Sei que isso não acontece só aqui é uma realidade em todo o país.

O **Adota Pet** resolve isso: qualquer pessoa cadastra seu animal com foto, descrição e contato, e interessados em adotar encontram pets disponíveis com filtros por espécie e busca por cidade, tudo em tempo real e de forma completamente gratuita.

---

## Funcionalidades

- Cadastro e login com e-mail e senha (Firebase Authentication)
- Verificação de e-mail ao criar conta e recuperação de senha
- Painel com estatísticas em tempo real (total de pets, disponíveis, adotados)
- Cadastro de pets com nome, espécie, raça, idade, porte, foto, cidade e contato
- Listagem de pets com filtro por espécie e busca por nome ou cidade
- Visualização detalhada de cada pet
- Marcar pet como adotado (atualização de status em tempo real)
- Exclusão de cadastro (somente pelo dono do anúncio)

---

## CRUD Completo

| Operação | Tela | Método Firebase |
|---|---|---|
| **Create** | `NovoPetScreen` | `addDoc` |
| **Read** | `ListaPetsScreen` / `HomeScreen` | `onSnapshot` |
| **Update** | `DetalhesPetScreen` | `updateDoc` |
| **Delete** | `DetalhesPetScreen` | `deleteDoc` |

---

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 55) |
| Linguagem | JavaScript |
| Navegação | React Navigation — Bottom Tabs + Native Stack |
| Autenticação | Firebase Authentication |
| Banco de dados | Firebase Firestore (nuvem, tempo real) |
| Estado | React Hooks (`useState`, `useEffect`) |
| Ícones | `@expo/vector-icons` (Ionicons) |

---

## Estrutura do Projeto

```
app-firebase/
├── components/
│   ├── LoginScreen.js        # Tela de login com recuperação de senha
│   ├── RegistroScreen.js     # Tela de cadastro de conta
│   ├── HomeScreen.js         # Painel com estatísticas em tempo real
│   ├── NovoPetScreen.js      # Formulário de cadastro de pet (Create)
│   ├── ListaPetsScreen.js    # Lista com filtros e busca (Read)
│   ├── DetalhesPetScreen.js  # Detalhes, atualização e exclusão (Update/Delete)
│   └── PetCard.js            # Componente reutilizável de card
├── database/
│   └── firebase.js           # Configuração e inicialização do Firebase
├── App.js                    # Navegação principal e controle de autenticação
├── app.json                  # Configuração do Expo
└── README.md
```

---

## Navegação

```
App.js
├── Stack (deslogado)
│   ├── LoginScreen
│   └── RegistroScreen
└── Bottom Tabs (logado)
    ├── HomeScreen
    ├── NovoPetScreen
    └── Stack (ListaPets)
        ├── ListaPetsScreen
        └── DetalhesPetScreen
```

---

## Como Rodar

**Pré-requisito:** Node.js instalado

```bash
# 1. Clone o repositório
git clone https://github.com/costajoaao/adota-pet.git

# 2. Entre na pasta
cd adota-pet/app-firebase

# 3. Instale as dependências
npm install --legacy-peer-deps

# 4. Inicie o app
npx expo start
```

- Pressione **`w`** para abrir no navegador
- Ou escaneie o QR Code com o app **Expo Go** (Android/iOS)

---

## Código e Estrutura

- **Componentização** — 7 componentes independentes, cada um com responsabilidade única
- `useState` — controle de formulários, estados de carregamento e filtros
- `useEffect` — listeners em tempo real do Firestore e monitoramento de autenticação (com cleanup de `unsubscribe`)

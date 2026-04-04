# 🚀 DocMind AI - Workspace Inteligente de Produtividade

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)<img width="1913" height="923" alt="Capturar" src="https://github.com/user-attachments/assets/9f2bcda0-ee0a-4198-b92e-2d5fecacd982" />


O **DocMind AI** é uma plataforma centralizada de produtividade que combina gestão de documentos com Inteligência Artificial, calendário de eventos e lista de tarefas. O objetivo é reduzir a troca de abas (context switching) ao unir escrita inteligente e organização em um único lugar.

---

## 🎯 Funcionalidades Principais

### 📝 Editor de Documentos com IA
*   **Integração com Gemini AI:** Ferramentas integradas para **Resumir** e **Reescrever** textos selecionados usando a API do Google Gemini.
*   **Rich Text Editor:** Implementado com Tiptap, oferecendo uma experiência de escrita limpa e profissional.
*   **Persistência em Tempo Real:** Documentos salvos automaticamente no banco de dados.

### 📅 Gestão de Tempo e Tarefas
*   **Calendário Dinâmico:** Visualização de eventos por mês com sistema de lembretes via `react-hot-toast`.
*   **Task List com Progresso:** Lista de tarefas com barra de progresso visual que calcula a conclusão em tempo real.

### 🔐 Segurança e Performance
*   **Autenticação Robusta:** Gestão de usuários via **Clerk**, garantindo login seguro e proteção de rotas.
*   **Backend as a Service:** Utilização do **Supabase** para banco de dados PostgreSQL e persistência de dados em tempo real.

---

## 🛠️ Desafios Técnicos e Aprendizados

Durante o desenvolvimento, foquei em boas práticas de engenharia de software:

1.  **Otimização de Renderização:** No componente de Calendário, implementei o padrão de limpeza em `useEffect` e o uso de `useCallback` para evitar o erro comum de *Cascading Renders* (renderizações em cascata), garantindo que as chamadas ao Supabase fossem eficientes.
2.  **UX Responsiva:** Utilizei **Tailwind CSS** para criar uma interface "Mobile-First" com menus laterais (sidebars) adaptáveis e transições suaves com `framer-motion` (ou Tailwind transitions).
3.  **Consumo de API de IA:** Implementei a lógica de comunicação assíncrona com a IA do Gemini, tratando estados de carregamento para que a interface não trave enquanto a IA processa o texto.

---

## 🏗️ Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS.
*   **Backend/Banco de Dados:** Supabase (PostgreSQL).
*   **Autenticação:** Clerk.
*   **Editor de Texto:** Tiptap.
*   **IA:** Google Gemini Pro API.
*   **Notificações:** React Hot Toast.

---

## ⚙️ Como rodar o projeto

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/docmind-ai.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente (.env):
    ```env
    VITE_SUPABASE_URL=sua_url
    VITE_SUPABASE_ANON_KEY=sua_chave
    VITE_CLERK_PUBLISHABLE_KEY=sua_chave
    VITE_APP_AI_TOKEN=seu_token_gemini
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## 👨‍💻 Autor

Anabelly Passos - [LinkedIn](www.linkedin.com/in/anabelly-passos-a4b44623b) - [Portfólio](https://portifolio-psi-ruddy-52.vercel.app/)

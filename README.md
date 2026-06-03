<div align="center">
  <h1>Pizzato 2025</h1>
</div>

O projeto consistiu no desenvolvimento de um site institucional moderno e responsivo para a marca Pizzato, com foco em representar toda história em sua trajetória no mundo dos vinhos.
  
---

## Índice

- [Sobre](#sobre)
- [Visualização](#visualizacao)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Documentação](#documentacao)

---

<h2 id="sobre">Sobre:</h2>

Através do painel de gerenciamento (manager), é possível:

- Gerenciar conteúdos da Home
- Configurar SEO para cada página
- Atualizar dados gerais
- Gerenciar conteúdos Institucional
- Gerenciar produtos e linhas
- Gerenciar conteúdos da página Enoturismo
- Visualizar emails de contato e gerenciar conteúdo desta página
- Alterar a política de privacidade
- Alterar conteúdos para cada idioma, sendo eles: inglês e português - BR


E através do site para o público:

- Visualizar as páginas:
    - **Home**: apresenta um pouco sobre a história, marcas, newsletter e slides
    - **Sobre**: história, localidade e tudo mais relacionado à marca
    - **Nossos Vinhos**: página de vendas com os vinhos, detalhes e resumo sobre cada vinho ao selecioná-lo 
    - **Enoturismo**: apresenta uma modalidade de viagem focada na apreciação do universo do vinho
    - **Contato**: informações de localidade, mapa, telefones para contato e form (dividido em categorias como geral, comercial e enoturismo)
    - **Blog**: site externo
    - **Loja Virtual**: site externo
    - **Marcas**: categoria com as marcas de vinhos
    - **Categorias**: categorias com os tipos de vinhos

---


<h2 id="visualizacao">Visualização:</h2>

<img width="400" alt="image home" src="https://github.com/user-attachments/assets/c747e420-f969-48ca-9de0-590122ca9f7c" />
<img width="400" alt="image sobre" src="https://github.com/user-attachments/assets/d614cf1a-7991-465d-9eff-b1ab1c8de39c" />
<img width="400" alt="image nossos vinhos" src="https://github.com/user-attachments/assets/b5130427-9a3b-443e-9935-c78dc62bfdff" />
<img width="400" alt="image enoturismo" src="https://github.com/user-attachments/assets/85c73930-eda5-4118-a76e-c735df5868df" />
<img width="400" alt="image contato" src="https://github.com/user-attachments/assets/1f6758a2-c837-4fff-b70f-f777a910e853" />
<img  width="400" alt="image categorias" src="https://github.com/user-attachments/assets/37794444-8e4b-4e68-b8b3-3ae6bf952416" />

---

<h2 id="tecnologias-utilizadas">Tecnologias Utilizadas:</h2>

### Back-end:
- **Laravel (^11.31)**: framework PHP para construção do projeto, gerenciamento de rotas, autenticação e etc.
- **PHP (^8.2)**: linguagem de desenvolvimento
- **Laravel Sanctum (^4.0)**: autenticação e proteção de rotas
- **Inertia.js (^1.0)**: integração entre backend Laravel e frontend React sem necessidade de API tradicional
- **Laravel Localization (^2.2)**: gerenciamennto de idiomas e rotas traduzidas
- **Ziggy (^2.0)**: compartilhamento de rotas Laravel diretamente no frontend React
- **Laravel Breeze (^2.2)**: estrutura inicial de autenticação e gerenciamento de usuários
- **Laravel Tinker (^2.9)**: ferramenta para testes e execução de comandos no ambiente
- **Laravel PT-BR Validator (*)**: validações adaptadas para formato brasileiro

### Front-end:
- **React (^18.2.0)**: biblioteca para construção de interfaces
- **Inertia React (^1.0.0)**: integração entre Laravel e React sem necessidade de API REST tradicional
- **Vite (^5.0)**: ferramenta de build e desenvolvimento rápido
- **Laravel Vite Plugin (^1.0)**: integração entre Laravel e Vite
- **Tailwind (^3.2.1)**: framework para estilização
- **PostCSS (^8.4.31)**: processador de CSS usado junto do Tailwind

### UI e experiência do usuário:
- **Font Awesome React (^0.2.2)**: biblioteca de ícones para interface
- **Headless UI (^2.0.0)**: componentes acessíveis e sem estilos pré-definidos
- **Swiper (^11.2.6)**: criação de sliders e carrosseis
- **Gsap (^3.12.7)**: biblioteca para animações
- **Lenis (^1.0.42)**: implementação de scroll suave
- **React Select (^5.10.1)**: select customizado
- **React Tag Input (^6.10.6)**: gerenciamento e criação de tags

### Tabelas, dados e formulários:
- **React Input Mask (^2.0.4)**: máscaras para inputs como CPF e telefones
- **React SortableJS (^6.1.4)**: drag and drop para ordenação de elementos

### Upload e manipulação de arquivos:
- **React Dropzone (^14.3.8)**: upload de arquivos via drag and drop
- **React Image Crop (^11.0.7)**: recorte de imagens no navegador
- **browser-image-compression (^2.0.2)**: compressão de imagens
- **Mammoth (^1.10.0)**: conversão de documentos Word (.docx) para HTML
- **Uppy (^4.x)**: sistema de upload avançado de arquivos
    - **Core**: gerenciamento principal do upload
    - **Dashboard**: interface visual para envio de arquivos
    - **Drag & Drop**: suporte a arrastar arquivos
    - **File Input**: seleção tradicional de arquivos
    - **Progress Bar**: barra de progresso
    - **XHR Upload**: envio de arquivos via requisições HTTP
    - **Locales**: suporte à internacionalização

### Editor de texto:
- **Tiptap (^2.11.7)**: editor de texto altamente cuustimizável
- Extensões utilizadas:
  - **Image**: suporte para imagens
  - **Link**: gerenciamento de links
  - **Underline**: sublinhado no texto
  - **Table**: criação de tabelas
  - **Table Row:** gerenciamento de linhas
  - **Table Header**: cabeçalhos de tabelas
  - **Table Cell**: células de tabelas
  - **List Item**: manipulação de listas
  - **Figure Extension**: suporte a figuras
  - **Starter Kit**: funcionalidades básicas do editor
 

---

<h2 id="arquitetura-do-projeto">Arquitetura principal do Projeto:</h2>

```bash
Pizzato-2025
│
├── app
│   ├── Http
│   │   ├── Controllers    # Controladores responsáveis pelas requisições e retornar respostas (separado por Manager)
│   │   ├── Middleware     # Interceptação, autenticação e tratamento de requisições
│   │   ├── Requests       # Validação e autorização de formulários e requisições (separado por Manager)
│   │   ├── helpers.php    # Auxiliares globais utilizados no projeto
│   ├── Models             # Representação das tabelas do banco (Eloquent)
│   ├── Providers          # Configuração de pacotes
├── bootstrap              # Inicialização do framework
├── config                 # Arquivos de configuração
├── database               # Migrations, seeds e factories
├── public                 # Diretório público acessível pelo navegador
│   ├── admin              # Arquivos relacionados ao Manager
│   ├── content            # Arquivos relacionados as páginas e gerenciáveis pelo Manager
│   ├── site               # Arquivos do site institucional
├── resources              # Frontend e recursos
│   ├── css                # Estilização 
│   ├── js                 # Componentes, páginas, hooks e layouts (separados por Manager)
│   ├── lang               # Traduções de recursos estáticos como header, footer e etc.
│   ├── views              # Templates e views do Laravel/Inertia
├── routes                 # Definição das rotas web e Manager
├── storage                # Arquivos gerados (logs, cache e etc.)
├── tests
│

```

---

<h2 id="como-executar-o-projeto">Como Executar o Projeto:</h2>

1. Clone o repositório:

```bash
git clone https://github.com/Octal-web/Pizzato-2025.git
cd Pizzato-2025
```

2. Instale as dependências do Front-end:

```bash
npm install
```

3. Instale as dependências do Back-end:

```bash
composer install
```

4. Configure o ambiente

Crie o arquivo .env:

```bash
cp .env.example .env
```

Gere a chave da aplicação:
```bash
php artisan key:generate
```

Configure o banco de dados SQL e preencha com o acesso no .env

5. Rode o projeto:
```bash
npm run dev
php artisan serve
```

<h2 id="documentacao">Documentação:</h2>
Este README apresenta uma visão geral do projeto.

Para uma documentação completa, incluindo arquitetura, instalação detalhada, páginas, fluxo, controllers e componentes, acesse a Wiki do projeto:
[Wiki do projeto](https://github.com/Octal-web/Pizzato-2025/wiki)



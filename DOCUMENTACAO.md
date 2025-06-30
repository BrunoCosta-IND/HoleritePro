# Sistema de Gestão de Holerites

## Visão Geral

O Sistema de Gestão de Holerites é uma aplicação web completa desenvolvida em React que permite a gestão eficiente de holerites para empresas. O sistema possui dois perfis principais: **Criador** (configuração e gestão do sistema) e **Administrador** (operações diárias).

## Funcionalidades Implementadas

### 🔐 Painel do Criador

#### 1. Tela de Login do Criador
- **Localização**: `/criador-login`
- **Características**:
  - Tema escuro por padrão com alternância para claro
  - Validação de e-mail, senha e pergunta de segurança
  - Pergunta de segurança: "Qual o nome do seu cachorro?" (Resposta: "Chocolate")
  - Design moderno e responsivo
  - Validação em tempo real

#### 2. Dashboard Principal do Criador
- **Localização**: `/criador-dashboard`
- **Características**:
  - Cards informativos com estatísticas do sistema
  - Ações rápidas para configuração
  - Navegação para outras telas do criador
  - Informações da licença e suporte

#### 3. Tela de Personalização
- **Localização**: `/criador-personalizacao`
- **Características**:
  - Configuração de nome da empresa
  - Upload de logo personalizado
  - Seletor de cores (fundo, botões, textos)
  - Seleção de fontes
  - Preview em tempo real das alterações
  - Salvamento das configurações no localStorage

#### 4. Gestão de Funcionalidades PRO
- **Localização**: `/criador-funcionalidades`
- **Características**:
  - Toggle switches para ativar/desativar recursos
  - **Webhook de WhatsApp**: Notificações automáticas
  - **Relatório de Assinaturas**: Controle de assinaturas
  - Informações de preços e impacto no painel do admin
  - Validação de configurações

### 👨‍💼 Painel do Administrador

#### 5. Dashboard do Administrador
- **Localização**: `/admin-dashboard`
- **Características**:
  - Header com nome e logo da empresa (personalizáveis)
  - Cards informativos (funcionários, holerites, status)
  - Ações rápidas condicionais baseadas nas funcionalidades PRO
  - Histórico de uploads recentes
  - Integração com configurações do Criador

#### 6. Cadastro de Funcionários
- **Localização**: `/admin/funcionarios/cadastrar`
- **Características**:
  - Formulário completo com validação
  - Máscara automática para CPF e WhatsApp
  - Validação de CPF com algoritmo oficial
  - Controle de limite de funcionários
  - Verificação de CPF duplicado
  - Cálculo automático de custos

#### 7. Upload de Holerites
- **Localização**: `/admin/holerites/upload`
- **Características**:
  - Upload múltiplo de arquivos PDF
  - Identificação automática de funcionários
  - Configuração condicional de webhook
  - Barra de progresso para uploads
  - Validação de tipos de arquivo
  - Resumo do envio

## Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Roteamento**: React Router DOM
- **Estado**: React Hooks (useState, useEffect)
- **Persistência**: localStorage

## Estrutura do Projeto

```
gestao-holerites/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes shadcn/ui
│   │   ├── CriadorLogin.jsx       # Login do Criador
│   │   ├── CriadorDashboard.jsx   # Dashboard do Criador
│   │   ├── CriadorPersonalizacao.jsx # Personalização
│   │   ├── CriadorFuncionalidades.jsx # Funcionalidades PRO
│   │   ├── AdminDashboard.jsx     # Dashboard do Admin
│   │   ├── AdminCadastroFuncionarios.jsx # Cadastro
│   │   └── AdminUploadHolerites.jsx # Upload
│   ├── App.jsx                    # Componente principal
│   └── main.jsx                   # Ponto de entrada
├── index.html
├── package.json
└── README.md
```

## Configurações e Integrações

### Funcionalidades PRO

O sistema possui um mecanismo de controle de funcionalidades PRO que permite ativar/desativar recursos:

1. **Webhook de WhatsApp**
   - Quando ativo: Campo de configuração visível no upload
   - Quando inativo: Mensagem "Disponível apenas na versão PRO"

2. **Relatório de Assinaturas**
   - Quando ativo: Card e botão de relatórios visíveis
   - Quando inativo: Card com mensagem de upgrade

### Personalização Visual

- **Nome da Empresa**: Aplicado em headers e títulos
- **Cores**: Botões e elementos visuais seguem a paleta definida
- **Logo**: Substituição do ícone padrão (funcionalidade preparada)
- **Fontes**: Seleção entre diferentes famílias tipográficas

### Validações Implementadas

- **CPF**: Algoritmo oficial de validação de CPF brasileiro
- **WhatsApp**: Validação de formato (10-11 dígitos)
- **E-mail**: Validação de formato padrão
- **Arquivos**: Apenas PDFs aceitos no upload
- **Limites**: Controle de funcionários por plano

## Como Executar

1. **Instalar dependências**:
   ```bash
   cd gestao-holerites
   npm install
   ```

2. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação**:
   - URL: `http://localhost:5173`
   - Redirecionamento automático para login do Criador

## Credenciais de Teste

### Login do Criador
- **E-mail**: admin@sistema.com
- **Senha**: 123456
- **Pergunta de Segurança**: Chocolate

## Fluxo de Navegação

1. **Acesso inicial** → Login do Criador
2. **Após login** → Dashboard do Criador
3. **Configurações** → Personalização e Funcionalidades PRO
4. **Operações** → Dashboard do Administrador
5. **Gestão** → Cadastro de Funcionários e Upload de Holerites

## Recursos Avançados

### Responsividade
- Design adaptável para desktop, tablet e mobile
- Componentes otimizados para diferentes tamanhos de tela

### Acessibilidade
- Contraste adequado entre cores
- Navegação por teclado
- Labels descritivos para formulários

### Performance
- Componentes otimizados
- Lazy loading preparado
- Minimização de re-renders

### Segurança
- Validação client-side robusta
- Sanitização de inputs
- Controle de acesso por rotas

## Próximos Passos (Sugestões)

1. **Backend Integration**
   - API REST para persistência de dados
   - Autenticação JWT
   - Upload real de arquivos

2. **Funcionalidades Adicionais**
   - Sistema de notificações
   - Relatórios em PDF
   - Dashboard analytics

3. **Melhorias de UX**
   - Animações e transições
   - Feedback visual aprimorado
   - Modo offline

## Suporte e Manutenção

O sistema foi desenvolvido seguindo as melhores práticas de React e está preparado para:
- Fácil manutenção e extensão
- Adição de novas funcionalidades
- Integração com APIs externas
- Deploy em produção

---

**Desenvolvido com React + Vite + Tailwind CSS + shadcn/ui**


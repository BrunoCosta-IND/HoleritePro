# Sistema de Gestão de Holerites - Versão Simplificada

## 📋 Visão Geral

Sistema de gestão de holerites simplificado com apenas dois tipos de usuários:
- **Administradores**: Gerenciam funcionários e upload de holerites
- **Funcionários**: Acessam e assinam seus holerites

## 🗂️ Estrutura do Sistema

### **Tabelas Principais:**

1. **`usuarios`** - Administradores do sistema
2. **`funcionarios`** - Funcionários que acessam os holerites
3. **`holerite`** - Documentos com status de assinatura
4. **`empresa_config`** - Configurações visuais e limites
5. **`funcionalidades_pro`** - Controle de funcionalidades premium
6. **`logs_atividade`** - Auditoria de ações do sistema
7. **`uploads_n8n`** - Integração com webhooks N8N

### **Funcionalidades:**

#### **Painel Administrador:**
- Dashboard com estatísticas
- Cadastro de funcionários
- Upload de holerites
- Configurações da empresa
- Relatórios de assinaturas

#### **Painel Funcionário:**
- Visualização de holerites
- Assinatura digital de documentos
- Histórico de holerites
- Download de documentos

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado
- **Validação de CPF** e e-mail
- **Logs de auditoria** para todas as ações
- **Políticas de acesso** baseadas em perfis

## 🚀 Como Usar

### **1. Configuração do Banco de Dados:**

Execute o arquivo `schema_completo_sistema.sql` no SQL Editor do Supabase:

```sql
-- Execute o schema completo
-- Configure o bucket 'holerites' no Storage
-- Atualize as credenciais no arquivo utils.js
```

### **2. Configuração do Storage:**

No painel do Supabase, crie um bucket chamado `holerites`:
- **Nome**: holerites
- **Público**: false
- **Tamanho máximo**: 10MB
- **Tipos permitidos**: pdf

### **3. Credenciais de Teste:**

#### **Administrador:**
- **E-mail**: admin@empresa.com
- **Senha**: 123456

#### **Funcionário:**
- **CPF**: 11122233344
- **Senha**: 123456

## 📊 Funcionalidades Principais

### **Upload de Holerites:**
- Upload múltiplo de arquivos PDF
- Identificação automática de funcionários
- Extração de mês/ano do nome do arquivo
- Status de upload em tempo real

### **Assinatura Digital:**
- Aceite de termos obrigatório
- Registro de IP e timestamp
- Status de assinatura (pendente/assinado/rejeitado)
- Histórico completo de assinaturas

### **Relatórios:**
- Estatísticas do sistema
- Relatório de assinaturas
- Holerites pendentes
- Funcionários ativos

## 🔧 Configurações

### **Configurações da Empresa:**
- Nome da empresa
- Cores personalizadas
- Logo e favicon
- Limite de funcionários

### **Funcionalidades PRO:**
- Webhook WhatsApp
- Relatórios avançados
- Integração N8N

## 📱 Interface

### **Design Responsivo:**
- Interface moderna e intuitiva
- Tema claro/escuro
- Componentes reutilizáveis
- Feedback visual em tempo real

### **Navegação:**
- Login unificado (e-mail para admin, CPF para funcionário)
- Dashboard personalizado por tipo de usuário
- Navegação intuitiva entre seções

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Autenticação**: Supabase Auth

## 📈 Performance

- **Índices otimizados** para consultas frequentes
- **Triggers automáticos** para timestamps
- **Views para relatórios** comuns
- **Funções auxiliares** para consultas complexas

## 🔄 Migração

### **Removido:**
- Painel criador completo
- Componentes relacionados ao criador
- Rotas do criador
- Referências ao tipo 'criador' no banco

### **Mantido:**
- Todas as funcionalidades de admin e funcionário
- Sistema de logs e auditoria
- Configurações e personalização
- Integrações e webhooks

## 📝 Notas Importantes

1. **Senhas**: Em produção, implemente hash bcrypt adequado
2. **CPF**: Validação simplificada para testes
3. **Storage**: Configure políticas de acesso adequadas
4. **Logs**: Monitore logs de atividade regularmente
5. **Backup**: Configure backup automático do banco

## 🚀 Próximos Passos

1. Execute o schema no Supabase
2. Configure o bucket de storage
3. Atualize as credenciais no `utils.js`
4. Teste com as credenciais de exemplo
5. Personalize conforme necessário

---

**Sistema simplificado e otimizado para máxima eficiência!** 🎯 
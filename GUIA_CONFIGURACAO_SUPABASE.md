# 🚀 Guia Completo - Configuração Automática do Supabase

## 📋 Resposta à sua pergunta:

**O MCP do Supabase não está disponível nas ferramentas atuais**, mas posso te ajudar com alternativas para criar o banco completo automaticamente.

## 🛠️ Opções Disponíveis:

### **1. 📝 Manual (Mais Confiável)**
```bash
# 1. Acesse https://supabase.com
# 2. Crie novo projeto
# 3. Vá para SQL Editor
# 4. Execute schema_completo_sistema.sql
```

### **2. 🤖 Script Automático (Criado)**
```bash
# Execute o script que criei
node setup_supabase.js
```

### **3. 🔧 CLI do Supabase**
```bash
# Instale o CLI
npm install -g supabase

# Configure
supabase login
supabase init

# Execute o schema
supabase db push
```

## 🎯 **Recomendação: Método Manual**

### **Passo 1: Criar Projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Escolha sua organização
4. Digite um nome: `gestao-holerites`
5. Defina uma senha forte
6. Escolha região (Brasil se disponível)
7. Clique em **"Create new project"**

### **Passo 2: Executar Schema SQL**
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `schema_completo_sistema.sql`
4. Cole no editor
5. Clique em **"Run"**

### **Passo 3: Configurar Storage**
1. Vá para **Storage** no painel
2. Clique em **"New bucket"**
3. Configure:
   - **Nome**: `holerites`
   - **Público**: `false`
   - **Tamanho máximo**: `10MB`
   - **Tipos permitidos**: `pdf`

### **Passo 4: Atualizar Credenciais**
1. Vá para **Settings** > **API**
2. Copie a **URL** e **anon key**
3. Atualize o arquivo `src/lib/utils.js`:

```javascript
export const supabase = createClient(
  'SUA_URL_AQUI',
  'SUA_ANON_KEY_AQUI'
);
```

## 🔍 **Verificação da Configuração**

### **Teste 1: Verificar Tabelas**
```sql
-- Execute no SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Resultado esperado:**
- usuarios
- funcionarios
- holerite
- empresa_config
- funcionalidades_pro
- logs_atividade
- uploads_n8n

### **Teste 2: Verificar Dados Iniciais**
```sql
-- Verificar usuário admin
SELECT * FROM usuarios WHERE email = 'admin@empresa.com';

-- Verificar funcionários de teste
SELECT * FROM funcionarios WHERE ativo = true;
```

### **Teste 3: Testar Login**
1. Execute o projeto: `npm run dev`
2. Acesse: `http://localhost:5173`
3. Teste login:
   - **Admin**: `admin@empresa.com` / `123456`
   - **Funcionário**: `11122233344` / `123456`

## 🚨 **Possíveis Problemas e Soluções**

### **Erro 1: "Function not found"**
```sql
-- Execute primeiro
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **Erro 2: "Permission denied"**
- Verifique se está logado no Supabase
- Confirme que tem permissões de admin no projeto

### **Erro 3: "Bucket not found"**
- Crie o bucket manualmente no Storage
- Configure as políticas de acesso

### **Erro 4: "Connection failed"**
- Verifique a URL e chave no `utils.js`
- Confirme que o projeto está ativo

## 📊 **Status da Configuração**

### **✅ Checklist:**
- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado
- [ ] Bucket "holerites" criado
- [ ] Credenciais atualizadas
- [ ] Login funcionando
- [ ] Upload de arquivos funcionando

## 🎉 **Próximos Passos**

1. **Teste todas as funcionalidades**
2. **Configure webhooks** (se necessário)
3. **Personalize cores e logo**
4. **Adicione mais funcionários**
5. **Faça backup regular**

## 💡 **Dicas Importantes**

### **Segurança:**
- Troque as senhas padrão em produção
- Configure RLS adequadamente
- Monitore logs de atividade

### **Performance:**
- Os índices já estão otimizados
- Views para relatórios criadas
- Triggers automáticos configurados

### **Manutenção:**
- Faça backup regular do banco
- Monitore uso de storage
- Atualize dependências regularmente

---

**🎯 O sistema está pronto para uso! Execute o schema manualmente para máxima confiabilidade.** 
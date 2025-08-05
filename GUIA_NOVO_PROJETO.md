# 🚀 GUIA RÁPIDO - NOVO PROJETO SUPABASE

## ✅ **Novo Projeto Configurado:**
- **URL**: `https://lyzuwgjwvtsfgwttxzdk.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Status**: ✅ Credenciais atualizadas no `src/lib/utils.js`

## 🎯 **Passos para Executar:**

### **1. Acessar o Novo Projeto**
1. Vá para: https://supabase.com/dashboard
2. Clique no projeto: `lyzuwgjwvtsfgwttxzdk`
3. Vá para **SQL Editor**

### **2. Executar Schema**
1. Clique em **"New query"**
2. Copie todo o conteúdo de `schema_novo_projeto.sql`
3. Cole no editor
4. Clique em **"Run"**

### **3. Verificar Instalação**
Execute esta query para verificar:

```sql
SELECT 
    'Sistema OK!' as status,
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM funcionarios) as funcionarios,
    (SELECT COUNT(*) FROM empresa_config) as configs;
```

### **4. Configurar Storage**
1. Vá para **Storage** no menu lateral
2. Clique em **"New bucket"**
3. Configure:
   - **Nome**: `holerites`
   - **Público**: `false`
   - **Tamanho máximo**: `10MB`
   - **Tipos permitidos**: `pdf`

### **5. Testar o Sistema**
1. Execute: `npm run dev`
2. Acesse: `http://localhost:5173`
3. Teste login:
   - **Admin**: `admin@empresa.com` / `123456`
   - **Funcionário**: `11122233344` / `123456`

## 📊 **Resultado Esperado:**

### **Tabelas Criadas:**
- ✅ `usuarios` - Administradores
- ✅ `funcionarios` - Funcionários  
- ✅ `holerite` - Documentos
- ✅ `empresa_config` - Configurações
- ✅ `funcionalidades_pro` - Funcionalidades
- ✅ `logs_atividade` - Logs
- ✅ `uploads_n8n` - Webhooks

### **Dados Iniciais:**
- ✅ 1 usuário admin
- ✅ 3 funcionários de teste
- ✅ Configurações padrão

## 🔧 **Configurações Atualizadas:**

### **Arquivo `src/lib/utils.js`:**
```javascript
const supabaseUrl = 'https://lyzuwgjwvtsfgwttxzdk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5enV3Z2p3dnRzZmd3dHR4emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDQ4MDMsImV4cCI6MjA2OTkyMDgwM30.-9NttBkzpCL8oYuxgB1W6-7avA1AKcye4z30RpLtyRE';
```

## 🎉 **Sistema Pronto!**

Este novo projeto deve funcionar perfeitamente:
- ✅ **Sem problemas de timeout**
- ✅ **Credenciais corretas**
- ✅ **Schema otimizado**
- ✅ **Todas as funcionalidades**

## 📋 **Checklist Final:**

- [ ] Schema executado no novo projeto
- [ ] Verificação de dados executada
- [ ] Bucket "holerites" criado
- [ ] Projeto executando (`npm run dev`)
- [ ] Login admin funcionando
- [ ] Login funcionário funcionando

---

**🎯 Execute o schema no novo projeto e teste todas as funcionalidades!** 
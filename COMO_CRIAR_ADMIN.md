# 👑 COMO CRIAR CONTAS DE ADMINISTRADOR

## 🎯 **OPÇÕES DISPONÍVEIS:**

### **✅ Opção 1: Via Interface (Recomendado)**

#### **📋 Passos:**
1. **Acesse** o sistema como administrador
2. **Vá para** o Dashboard do Administrador
3. **Clique** no card "Cadastrar Administrador" (ícone de escudo roxo)
4. **Preencha** os dados:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
   - Confirme a senha
5. **Clique** em "Criar Administrador"

#### **✅ Funcionalidades:**
- **Validação** de email único
- **Verificação** de senha forte
- **Lista** de administradores existentes
- **Busca** e filtros
- **Exclusão** de administradores
- **Interface** responsiva

### **✅ Opção 2: Via SQL Direto**

#### **📋 Script SQL:**
```sql
-- Inserir novo administrador
INSERT INTO funcionarios (
  nome,
  email,
  senha,
  tipo,
  cargo,
  ativo,
  created_at
) VALUES (
  'Nome do Administrador',
  'admin@empresa.com',
  'senha123',
  'admin',
  'Administrador',
  true,
  NOW()
);
```

#### **⚠️ Observações:**
- **Senha:** Use uma senha forte
- **Email:** Deve ser único no sistema
- **Tipo:** Sempre 'admin'
- **Ativo:** true para conta ativa

### **✅ Opção 3: Via Supabase Dashboard**

#### **📋 Passos:**
1. **Acesse** o Supabase Dashboard
2. **Vá para** Table Editor
3. **Selecione** a tabela `funcionarios`
4. **Clique** em "Insert Row"
5. **Preencha:**
   - `nome`: Nome completo
   - `email`: Email único
   - `senha`: Senha forte
   - `tipo`: 'admin'
   - `cargo`: 'Administrador'
   - `ativo`: true
6. **Salve** a linha

## 🔐 **SEGURANÇA:**

### **✅ Boas Práticas:**
- **Senhas fortes:** Mínimo 8 caracteres, com números e símbolos
- **Emails únicos:** Não reutilize emails existentes
- **Nomes completos:** Use nomes reais para identificação
- **Contas limitadas:** Crie apenas o necessário
- **Monitoramento:** Verifique regularmente as contas ativas

### **✅ Permissões:**
- **Acesso total:** Todos os módulos do sistema
- **Cadastro:** Funcionários e outros administradores
- **Upload:** Holerites e documentos
- **Configurações:** Webhooks e configurações do sistema
- **Relatórios:** Visualização de dados e estatísticas

## 📱 **ACESSO AO SISTEMA:**

### **✅ Login:**
1. **Acesse:** `http://192.168.1.232:5173`
2. **Use:** Email e senha do administrador
3. **Selecione:** Tipo "Administrador"
4. **Clique:** Entrar

### **✅ Dashboard:**
- **Cards informativos:** Estatísticas do sistema
- **Ações rápidas:** Cadastro, upload, relatórios
- **Histórico:** Últimos uploads e atividades
- **Configurações:** Personalização do sistema

## 🛠️ **GERENCIAMENTO:**

### **✅ Lista de Administradores:**
- **Visualização:** Todos os admins cadastrados
- **Busca:** Por nome ou email
- **Exclusão:** Remover admins desnecessários
- **Status:** Contas ativas/inativas

### **✅ Funcionalidades:**
- **Criar:** Novos administradores
- **Editar:** Dados dos administradores
- **Excluir:** Remover contas
- **Buscar:** Filtrar por critérios
- **Exportar:** Lista de administradores

## 🚨 **IMPORTANTE:**

### **✅ Lembre-se:**
- **Backup:** Sempre faça backup antes de alterações
- **Teste:** Teste as contas criadas
- **Documentação:** Mantenha registro das contas
- **Segurança:** Use senhas fortes e únicas
- **Monitoramento:** Verifique atividades suspeitas

### **✅ Em caso de problemas:**
1. **Verifique** se o email é único
2. **Confirme** se a senha tem pelo menos 6 caracteres
3. **Teste** o login com as credenciais
4. **Verifique** se a conta está ativa
5. **Consulte** os logs do sistema

## 🎯 **RESULTADO:**

**Agora você pode:**
- ✅ **Criar** contas de administrador via interface
- ✅ **Gerenciar** administradores existentes
- ✅ **Acessar** todas as funcionalidades do sistema
- ✅ **Configurar** webhooks e notificações
- ✅ **Monitorar** atividades do sistema

**Acesse o sistema e teste a criação de administradores!** 👑 
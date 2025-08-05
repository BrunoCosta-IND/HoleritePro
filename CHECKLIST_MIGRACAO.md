# ✅ CHECKLIST - MIGRAÇÃO PARA NOVO SUPABASE

## 🎯 Status da Migração

- [x] **Credenciais atualizadas** no `src/lib/utils.js`
- [ ] **Schema SQL executado** no Supabase
- [ ] **Bucket de storage criado**
- [ ] **Políticas de storage configuradas**
- [ ] **Sistema testado** localmente
- [ ] **Login funcionando** com credenciais de teste

## 📋 Passos Detalhados

### 1. ✅ Configuração do Supabase (CONCLUÍDO)

- [x] URL atualizada: `https://lgqtbaavnawggzdtlijk.supabase.co`
- [x] Anon Key atualizada no `utils.js`
- [x] Arquivo de configuração criado

### 2. 🔧 Executar Schema SQL

- [ ] Acessar painel do Supabase
- [ ] Ir para SQL Editor
- [ ] Criar nova query
- [ ] Copiar conteúdo de `supabase_schema_simples.sql`
- [ ] Executar script
- [ ] Verificar se não há erros

### 3. 🗂️ Configurar Storage

- [ ] Criar bucket `holerites`
- [ ] Marcar como bucket público
- [ ] Executar políticas de storage no SQL Editor:

```sql
-- Política para permitir upload de arquivos
CREATE POLICY "Permitir upload de holerites" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'holerites');

-- Política para permitir visualização de arquivos
CREATE POLICY "Permitir visualização de holerites" ON storage.objects
FOR SELECT USING (bucket_id = 'holerites');

-- Política para permitir atualização de arquivos
CREATE POLICY "Permitir atualização de holerites" ON storage.objects
FOR UPDATE USING (bucket_id = 'holerites');
```

### 4. 🧪 Verificar Configuração

- [ ] Verificar tabelas criadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

**Tabelas esperadas:**
- [ ] `usuarios`
- [ ] `funcionarios`
- [ ] `holerite`
- [ ] `empresa_config`
- [ ] `funcionalidades_pro`
- [ ] `logs_atividade`

- [ ] Verificar dados iniciais:

```sql
SELECT * FROM usuarios WHERE email = 'admin@sistema.com';
SELECT * FROM funcionarios WHERE cpf = '98765432100';
```

### 5. 🚀 Testar Sistema

- [ ] Executar projeto localmente: `npm run dev`
- [ ] Testar login do criador:
  - E-mail: `admin@sistema.com`
  - Senha: `123456`
- [ ] Testar login do funcionário:
  - CPF: `98765432100`
  - Senha: `123456`
- [ ] Testar upload de arquivos
- [ ] Testar assinatura de documentos

## 🔍 Verificações de Segurança

### Row Level Security (RLS)
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de acesso configuradas
- [ ] Testar acesso restrito por usuário

### Storage Security
- [ ] Bucket configurado corretamente
- [ ] Políticas de acesso ao storage
- [ ] Testar upload e download de arquivos

## 📊 Funcionalidades a Testar

### Login e Autenticação
- [ ] Login de criador/admin
- [ ] Login de funcionário
- [ ] Logout
- [ ] Validação de credenciais

### Gestão de Funcionários
- [ ] Cadastro de funcionários
- [ ] Listagem de funcionários
- [ ] Edição de dados
- [ ] Desativação de funcionários

### Upload de Holerites
- [ ] Upload de arquivos PDF
- [ ] Validação de formato
- [ ] Armazenamento no Supabase
- [ ] Listagem de holerites

### Assinatura Digital
- [ ] Visualização de holerites
- [ ] Assinatura de documentos
- [ ] Registro de IP e timestamp
- [ ] Aceite de termos

### Dashboard e Relatórios
- [ ] Estatísticas do sistema
- [ ] Relatórios de assinaturas
- [ ] Configurações da empresa
- [ ] Logs de atividade

## 🚨 Troubleshooting

### Se houver erro de conexão:
- [ ] Verificar credenciais no `utils.js`
- [ ] Confirmar projeto ativo no Supabase
- [ ] Testar URL no navegador

### Se houver erro de tabelas:
- [ ] Executar schema novamente
- [ ] Verificar logs no SQL Editor
- [ ] Confirmar criação de todas as tabelas

### Se houver erro de storage:
- [ ] Criar bucket `holerites`
- [ ] Configurar políticas de acesso
- [ ] Testar upload manual

### Se houver erro de login:
- [ ] Verificar dados de teste no banco
- [ ] Confirmar credenciais corretas
- [ ] Testar com diferentes usuários

## 📞 Suporte

### Arquivos de Referência:
- [ ] `CONFIGURACAO_NOVO_SUPABASE.md` - Instruções detalhadas
- [ ] `supabase_schema_simples.sql` - Schema SQL
- [ ] `INSTRUCOES_SCHEMA_SIMPLES.md` - Guia do schema
- [ ] `CPFS_VALIDOS_TESTE.md` - CPFs para teste

### Credenciais de Teste:
- **Criador**: admin@sistema.com / 123456
- **Funcionário**: 98765432100 / 123456

---

**🎉 Checklist completo! Siga cada etapa para garantir uma migração bem-sucedida.** 
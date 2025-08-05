# 🚀 INSTRUÇÕES PARA SCHEMA SIMPLIFICADO

## 📋 Problema Resolvido

O erro de validação de CPF estava ocorrendo porque os CPFs de teste não eram válidos segundo o algoritmo brasileiro. Para facilitar os testes iniciais, criei um **schema simplificado** sem validação de CPF.

## 🔧 Como Usar o Schema Simplificado

### 1. Use o arquivo `supabase_schema_simples.sql`

Este arquivo contém:
- ✅ Todas as tabelas necessárias
- ✅ Row Level Security (RLS)
- ✅ Índices para performance
- ✅ Views e funções auxiliares
- ❌ **SEM validação de CPF** (para facilitar testes)

### 2. Execute no Supabase

1. Vá para **SQL Editor** no Supabase
2. Clique em **"New query"**
3. Copie todo o conteúdo de `supabase_schema_simples.sql`
4. Cole no editor SQL
5. Clique em **"Run"**

### 3. Credenciais de Teste

Após executar o schema simplificado:

**Criador do Sistema:**
- E-mail: `admin@sistema.com`
- Senha: `123456`
- CPF: `12345678900` (qualquer CPF funciona)

**Funcionário de Teste:**
- CPF: `98765432100`
- Senha: `123456`

## 🔄 Migração para Schema Completo (Opcional)

Quando quiser adicionar validação de CPF:

1. **Execute o schema completo** (`supabase_schema.sql`)
2. **Use CPFs válidos** listados em `CPFS_VALIDOS_TESTE.md`
3. **Atualize os dados** com CPFs válidos

## 📊 Diferenças entre os Schemas

| Recurso | Schema Simples | Schema Completo |
|---------|----------------|-----------------|
| Validação de CPF | ❌ Não | ✅ Sim |
| Validação de WhatsApp | ❌ Não | ✅ Sim |
| Todas as tabelas | ✅ Sim | ✅ Sim |
| RLS e Segurança | ✅ Sim | ✅ Sim |
| Performance | ✅ Sim | ✅ Sim |
| Facilidade de teste | ✅ Sim | ❌ Requer CPFs válidos |

## 🚀 Próximos Passos

1. **Execute o schema simplificado** primeiro
2. **Teste todas as funcionalidades**
3. **Configure o bucket `holerites`**
4. **Atualize as credenciais** no código
5. **Teste o login** com as credenciais fornecidas

## ✅ Checklist para Schema Simples

- [ ] Executar `supabase_schema_simples.sql`
- [ ] Configurar bucket `holerites`
- [ ] Atualizar credenciais no código
- [ ] Testar login do criador
- [ ] Testar login do funcionário
- [ ] Testar upload de arquivos
- [ ] Testar assinatura de documentos

## 🔧 Troubleshooting

### Se ainda houver erro de CPF:

1. **Verifique se está usando o schema correto**
2. **Confirme que executou `supabase_schema_simples.sql`**
3. **Verifique se não há constraints antigas** no banco

### Para limpar constraints antigas:

```sql
-- Remover constraints de CPF se existirem
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS check_cpf_valido;
ALTER TABLE funcionarios DROP CONSTRAINT IF EXISTS check_cpf_valido;
ALTER TABLE holerite DROP CONSTRAINT IF EXISTS check_cpf_valido;
```

## 📞 Suporte

Se encontrar problemas:

1. **Use o schema simplificado** para testes iniciais
2. **Verifique se todas as tabelas foram criadas**
3. **Teste as credenciais de conexão**
4. **Confirme que o bucket foi criado**

---

**🎉 O schema simplificado resolve o problema de validação de CPF e permite testes rápidos!** 
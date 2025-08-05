# 🔧 CONFIGURAR STORAGE VIA INTERFACE SUPABASE

## ❌ PROBLEMA IDENTIFICADO
**Erro de permissão:** `ERROR: 42501: must be owner of table objects`
- Não podemos modificar diretamente a tabela `storage.objects` via SQL
- Precisamos usar a interface do Supabase

## 🎯 SOLUÇÃO ALTERNATIVA

### **OPÇÃO 1: Via Interface do Supabase (Recomendado)**

#### **PASSO 1: Acessar Storage no Supabase**
1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá para:** Storage (no menu lateral)
4. **Clique em:** "New bucket" ou verifique se `holerites` existe

#### **PASSO 2: Configurar Bucket `holerites`**
1. **Se bucket não existe:**
   - **Nome:** `holerites`
   - **Public bucket:** ✅ Marcar como público
   - **File size limit:** 50MB
   - **Allowed MIME types:** `application/pdf`

2. **Se bucket já existe:**
   - **Clique no bucket** `holerites`
   - **Vá em:** Settings
   - **Marque:** "Public bucket" ✅
   - **Salve as alterações**

#### **PASSO 3: Configurar Políticas RLS**
1. **Vá para:** SQL Editor
2. **Execute apenas as políticas** (sem modificar RLS):

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir upload para todos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização para todos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON storage.objects;

-- Criar políticas permissivas
CREATE POLICY "Permitir upload para todos" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir visualização para todos" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização para todos" ON storage.objects
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir exclusão para todos" ON storage.objects
    FOR DELETE USING (true);
```

### **OPÇÃO 2: Script SQL Corrigido**

Execute o script `solucao_interface_supabase_corrigido.sql` que:
- ✅ Remove SELECT problemáticos
- ✅ Cria políticas permissivas
- ✅ Configura bucket como público
- ✅ Verifica configuração final

## 📋 VERIFICAÇÃO

### **Após configuração, verifique:**

1. **Bucket público:**
   ```sql
   SELECT id, name, public FROM storage.buckets WHERE id = 'holerites';
   ```
   **Resultado esperado:** `public = true`

2. **Políticas configuradas:**
   ```sql
   SELECT policyname, cmd FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```
   **Resultado esperado:** 4 políticas (INSERT, SELECT, UPDATE, DELETE)

## 🧪 TESTE FINAL

### **PASSO 1: Limpar Console**
- **Pressione:** Ctrl+L no console do navegador

### **PASSO 2: Testar Upload**
1. **Selecione arquivo** PDF (ex: `04527705210.pdf`)
2. **Clique em:** Enviar Holerites
3. **Verifique logs** no console

### **PASSO 3: Logs Esperados**
```
🚀 === INICIANDO UPLOAD ===
📁 Arquivos para upload: 1
☁️ Iniciando upload para storage...
✅ Upload para storage concluído
💾 === INSERINDO NO BANCO ===
✅ Registro inserido no banco com sucesso!
🎉 === UPLOAD CONCLUÍDO COM SUCESSO ===
```

## 🚨 SE AINDA HOUVER PROBLEMA

### **Verificar via Interface:**
1. **Storage > Buckets > holerites**
2. **Verificar se está público**
3. **Verificar se arquivos aparecem**

### **Verificar via SQL:**
```sql
-- Verificar bucket
SELECT * FROM storage.buckets WHERE id = 'holerites';

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Verificar arquivos no storage
SELECT * FROM storage.objects WHERE bucket_id = 'holerites';
```

**Execute a configuração via interface do Supabase primeiro!** 🔧 
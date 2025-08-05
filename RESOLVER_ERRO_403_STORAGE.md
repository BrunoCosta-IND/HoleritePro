# 🔧 RESOLVER ERRO 403 - STORAGE RLS

## ❌ PROBLEMA IDENTIFICADO
**Erro 403 - Row Level Security Policy:**
```
❌ Erro no upload do storage:
{statusCode: '403', error: 'Unauthorized', message: 'new row violates row-level security policy'}
```

## 🎯 CAUSA DO PROBLEMA
O bucket de storage `holerites` tem **RLS (Row Level Security)** ativo e está bloqueando o upload de arquivos.

## 🧪 SOLUÇÃO PASSO A PASSO

### **PASSO 1: Executar SQL de Correção**
1. Execute o SQL `corrigir_storage_rls.sql` no Supabase
2. Este script irá:
   - ✅ Verificar se bucket `holerites` existe
   - ✅ Configurar políticas RLS para permitir upload
   - ✅ Tornar bucket público
   - ✅ Testar configuração

### **PASSO 2: Verificar Configuração**
Após executar o SQL, você deve ver:
```
✅ Bucket holerites existe!
✅ Política criada: Permitir upload para admins
✅ Política criada: Permitir visualização pública
✅ Bucket holerites está público
✅ Políticas de storage configuradas
```

### **PASSO 3: Testar Upload Novamente**
1. **Limpe o console** (Ctrl+L)
2. **Selecione arquivo** PDF (ex: `04527705210.pdf`)
3. **Clique em:** Enviar Holerites
4. **Verifique logs** - Agora deve funcionar

## 📋 LOGS ESPERADOS APÓS CORREÇÃO

### **Logs de Sucesso:**
```
🚀 === INICIANDO UPLOAD ===
📁 Arquivos para upload: 1
📄 === PROCESSANDO ARQUIVO ===
👤 CPF extraído: 04527705210
☁️ Iniciando upload para storage...
✅ Upload para storage concluído
💾 === INSERINDO NO BANCO ===
✅ Registro inserido no banco com sucesso!
🎉 === UPLOAD CONCLUÍDO COM SUCESSO ===
```

### **Logs de Erro (se ainda houver problema):**
```
❌ Erro no upload do storage: { ... }
📋 Detalhes do erro: {
  message: 'new row violates row-level security policy',
  statusCode: '403',
  error: 'Unauthorized'
}
```

## 🔧 POLÍTICAS CONFIGURADAS

### **Para Storage (Bucket holerites):**
- ✅ **INSERT:** Permitir upload para admins
- ✅ **SELECT:** Permitir visualização pública
- ✅ **UPDATE:** Permitir atualização para admins
- ✅ **DELETE:** Permitir exclusão para admins
- ✅ **Bucket público:** Acesso público habilitado

## 🚨 POSSÍVEIS PROBLEMAS ADICIONAIS

### **1. Bucket não existe**
- **Sintoma:** "Bucket holerites NÃO existe!"
- **Solução:** Criar bucket no Supabase Storage

### **2. Políticas não aplicadas**
- **Sintoma:** Ainda erro 403 após SQL
- **Solução:** Verificar se SQL foi executado corretamente

### **3. Permissões de usuário**
- **Sintoma:** Erro de autenticação
- **Solução:** Verificar se está logado como admin

## 🎯 PRÓXIMOS PASSOS

1. **Execute o SQL** `corrigir_storage_rls.sql`
2. **Verifique mensagens** de sucesso
3. **Teste upload** novamente
4. **Verifique logs** no console
5. **Confirme** que arquivo aparece no storage

## 📋 CHECKLIST DE VERIFICAÇÃO

### **✅ Antes do Teste:**
- [ ] SQL executado com sucesso
- [ ] Mensagens de sucesso no SQL
- [ ] Console limpo para logs
- [ ] Login como admin

### **✅ Durante o Teste:**
- [ ] CPF extraído corretamente
- [ ] Upload para storage funcionou
- [ ] Inserção no banco funcionou
- [ ] Logs mostram sucesso

### **✅ Após o Teste:**
- [ ] Arquivo aparece no Supabase Storage
- [ ] Registro aparece na tabela holerite
- [ ] Funcionário vê seu holerite

**Execute o SQL e teste novamente!** 🔧 
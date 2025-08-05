# 🔧 RESOLVER HOLERITES NÃO SALVOS NO BANCO

## ❌ PROBLEMA IDENTIFICADO

Os holerites não estão sendo salvos no banco de dados. Vou ajudar você a diagnosticar e corrigir o problema.

## 🧪 DIAGNÓSTICO PASSO A PASSO

### **PASSO 1: Verificar Estrutura da Tabela**
1. Execute o SQL `verificar_tabela_holerite.sql` no Supabase
2. Verifique se a tabela existe e se tem a estrutura correta
3. Anote qualquer erro ou problema encontrado

### **PASSO 2: Corrigir Tabela (se necessário)**
1. Execute o SQL `corrigir_tabela_holerite.sql` no Supabase
2. Este script vai:
   - ✅ Criar a tabela se não existir
   - ✅ Configurar triggers e funções
   - ✅ Desabilitar RLS temporariamente
   - ✅ Criar políticas permissivas
   - ✅ Testar inserção

### **PASSO 3: Testar Upload com Logs Detalhados**
1. Abra: `http://localhost:5173/admin/upload-holerites`
2. Abra DevTools (F12) → Console
3. Selecione um arquivo PDF
4. Clique em **Enviar Holerites**
5. **ATENÇÃO:** Agora os logs são muito mais detalhados

### **PASSO 4: Verificar Logs Esperados**

**Logs de Upload Melhorados:**
```
=== INICIANDO UPLOAD ===
Iniciando upload de 1 arquivos
Processando arquivo: 04527705210.pdf
Nome único gerado: 04527705210_2024_01_123456789.pdf
Upload para storage concluído
URL pública obtida: https://...
Tentando inserir no banco: {
  cpf: "04527705210",
  mes: 1,
  ano: 2024,
  file_url: "https://...",
  file_name: "04527705210.pdf",
  file_size: 123456,
  status: "pendente"
}
Registro inserido no banco com sucesso: [{ id: 1, cpf: "04527705210", ... }]
Enviando aviso de holerite pronto para funcionário: 04527705210
...
```

## 🔍 VERIFICAR RESULTADO

### **✅ Se funcionar:**
- ✅ Logs mostram "Registro inserido no banco com sucesso"
- ✅ Dados retornados do insert
- ✅ Webhook enviado
- ✅ Funcionário vê holerite no painel

### **❌ Se não funcionar:**
1. **Verifique os logs detalhados** no console
2. **Execute o SQL** `verificar_tabela_holerite.sql` novamente
3. **Verifique se há erros** específicos no log
4. **Teste a inserção manual** no Supabase

## 🚨 TROUBLESHOOTING

### **Problema 1: "Tabela não existe"**
**Solução:** Execute `corrigir_tabela_holerite.sql`

### **Problema 2: "Erro de RLS"**
**Solução:** O script já desabilita RLS, mas verifique se funcionou

### **Problema 3: "Erro de constraint"**
**Solução:** Verifique se os dados estão no formato correto

### **Problema 4: "Erro de conexão"**
**Solução:** Verifique se o Supabase está acessível

## 📋 LOGS ESPERADOS

### **Logs de Sucesso:**
```
Tentando inserir no banco: {
  cpf: "04527705210",
  mes: 1,
  ano: 2024,
  file_url: "https://...",
  file_name: "04527705210.pdf",
  file_size: 123456,
  status: "pendente"
}
Registro inserido no banco com sucesso: [{ id: 1, cpf: "04527705210", ... }]
```

### **Logs de Erro:**
```
Erro ao inserir no banco: {
  code: "23505",
  message: "duplicate key value violates unique constraint",
  details: "Key (cpf, mes, ano)=(04527705210, 1, 2024) already exists.",
  hint: "You might need to specify ON CONFLICT clause."
}
```

## 🎯 PRÓXIMOS PASSOS

1. **Execute os SQLs** de verificação e correção
2. **Teste o upload** com logs detalhados
3. **Verifique os logs** no console
4. **Me informe o resultado** com os logs completos

**Execute os testes e me informe o resultado!** 🔧 
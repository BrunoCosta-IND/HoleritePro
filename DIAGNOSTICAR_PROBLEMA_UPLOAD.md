# 🔍 DIAGNOSTICAR PROBLEMA DE UPLOAD

## ❌ PROBLEMA IDENTIFICADO
Os holerites não estão sendo salvos no Supabase após o upload.

## 🧪 DIAGNÓSTICO PASSO A PASSO

### **PASSO 1: Executar SQL de Diagnóstico**
1. Execute o SQL `verificar_insercao_holerite.sql` no Supabase
2. Este script irá:
   - ✅ Verificar estrutura da tabela `holerite`
   - ✅ Testar inserções simples e complexas
   - ✅ Verificar permissões e RLS
   - ✅ Verificar se funcionários existem

### **PASSO 2: Verificar Logs do Console**
1. **Abra DevTools** (F12) → Console
2. **Limpe o console** (Ctrl+L)
3. **Faça upload** de um arquivo PDF
4. **Copie TODOS os logs** do console

### **PASSO 3: Verificar Dados do Arquivo**
1. **Confirme nome do arquivo** - Deve conter CPF
2. **Exemplo:** `04527705210.pdf` ou `04527705210_2024_01.pdf`
3. **Verifique se CPF** está sendo extraído corretamente

## 🔍 LOGS ESPERADOS

### **Logs de Seleção de Arquivo:**
```
Arquivos selecionados: ["04527705210.pdf"]
Extraindo CPF do arquivo: 04527705210.pdf
CPF encontrado: 04527705210
Processando arquivo: {
  nome: "04527705210.pdf",
  funcionario: "BRUNO COSTA DE OLIVEIRA",
  cpf: "04527705210",
  mes: 1,
  ano: 2024
}
```

### **Logs de Upload:**
```
🚀 === INICIANDO UPLOAD ===
📁 Arquivos para upload: 1
📋 Lista de arquivos: [{ nome: "04527705210.pdf", cpf: "04527705210", mes: 1, ano: 2024 }]
✅ Iniciando processo de upload...
📄 === PROCESSANDO ARQUIVO ===
📄 Nome do arquivo: 04527705210.pdf
👤 CPF extraído: 04527705210
📅 Mês/Ano: 1/2024
👨‍💼 Funcionário: BRUNO COSTA DE OLIVEIRA
🔧 Gerando nome único...
✅ Nome único gerado: 04527705210_2024_01_123456789.pdf
☁️ Iniciando upload para storage...
✅ Upload para storage concluído
💾 === INSERINDO NO BANCO ===
📊 Dados para inserção: { cpf: "04527705210", mes: 1, ano: 2024, ... }
🔍 Validando dados...
✅ Dados válidos para inserção
🗄️ Executando INSERT no banco...
✅ Registro inserido no banco com sucesso!
📊 Dados retornados: [{ id: 1, cpf: "04527705210", ... }]
```

## 🚨 LOGS DE ERRO ESPERADOS

### **Erro de CPF não encontrado:**
```
CPF não encontrado no arquivo: arquivo.pdf
❌ Dados inválidos para inserção: {
  cpf: null,
  mes: undefined,
  ano: undefined
}
```

### **Erro de banco:**
```
❌ Erro ao inserir no banco: { ... }
📋 Detalhes completos do erro: {
  code: "23505",
  message: "duplicate key value violates unique constraint",
  details: "Key (cpf, mes, ano)=(04527705210, 1, 2024) already exists.",
  hint: "You might need to specify ON CONFLICT clause.",
  statusCode: 400
}
```

### **Erro de storage:**
```
❌ Erro no upload do storage: { ... }
📋 Detalhes do erro: {
  message: "The resource already exists",
  statusCode: 400,
  error: "duplicate"
}
```

## 🔧 POSSÍVEIS CAUSAS

### **1. CPF não extraído corretamente**
- **Sintoma:** "Dados inválidos para inserção"
- **Solução:** Verificar nome do arquivo contém CPF

### **2. Erro de RLS/Políticas**
- **Sintoma:** "Erro ao inserir no banco" com código de permissão
- **Solução:** Executar SQL de configuração

### **3. Funcionário não existe**
- **Sintoma:** CPF extraído mas funcionário não encontrado
- **Solução:** Cadastrar funcionário primeiro

### **4. Erro de storage**
- **Sintoma:** "Erro no upload do storage"
- **Solução:** Verificar bucket e permissões

### **5. Dados duplicados**
- **Sintoma:** "duplicate key value violates unique constraint"
- **Solução:** Verificar se holerite já existe

## 🎯 PRÓXIMOS PASSOS

1. **Execute o SQL** `verificar_insercao_holerite.sql`
2. **Teste upload** com logs detalhados
3. **Copie TODOS os logs** do console
4. **Me envie os logs** - Especialmente os com ❌
5. **Identifique onde falha** - Cada etapa tem seu log

## 📋 CHECKLIST DE VERIFICAÇÃO

### **✅ Antes do Upload:**
- [ ] Funcionário cadastrado no banco
- [ ] Nome do arquivo contém CPF
- [ ] Console limpo para logs
- [ ] Login como admin

### **✅ Durante o Upload:**
- [ ] CPF extraído corretamente
- [ ] Dados válidos para inserção
- [ ] Upload para storage funcionou
- [ ] Inserção no banco funcionou

### **✅ Após o Upload:**
- [ ] Logs mostram sucesso
- [ ] Dados aparecem no Supabase
- [ ] Funcionário vê seus holerites

**Execute o diagnóstico e me envie os logs completos!** 🔍 
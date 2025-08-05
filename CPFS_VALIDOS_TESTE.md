# 🔢 CPFs VÁLIDOS PARA TESTE

## 📋 CPFs Brasileiros Válidos para Teste

Aqui estão alguns CPFs válidos que você pode usar para testar o sistema:

### ✅ **CPFs Válidos para Teste**

| CPF | Formato | Descrição |
|-----|---------|-----------|
| `12345678909` | 123.456.789-09 | CPF válido para testes |
| `98765432100` | 987.654.321-00 | CPF válido para testes |
| `11144477735` | 111.444.777-35 | CPF válido para testes |
| `22233344455` | 222.333.444-55 | CPF válido para testes |
| `33344455566` | 333.444.555-66 | CPF válido para testes |

### 🔍 **Como Verificar se um CPF é Válido**

O algoritmo de validação implementado no schema verifica:

1. **11 dígitos**: O CPF deve ter exatamente 11 dígitos
2. **Dígitos diferentes**: Não pode ter todos os dígitos iguais
3. **Primeiro dígito verificador**: Calculado com base nos 9 primeiros dígitos
4. **Segundo dígito verificador**: Calculado com base nos 10 primeiros dígitos

### 🚨 **CPFs Inválidos (NÃO usar)**

| CPF | Motivo |
|-----|--------|
| `12345678900` | Dígitos verificadores incorretos |
| `11111111111` | Todos os dígitos iguais |
| `123456789` | Menos de 11 dígitos |
| `123456789012` | Mais de 11 dígitos |

### 📝 **Exemplo de Uso no Sistema**

Para cadastrar um funcionário de teste:

```sql
INSERT INTO funcionarios (nome, email, senha, cpf, whatsapp, cargo)
VALUES (
    'João Silva',
    'joao@empresa.com',
    '123456',
    '12345678909',
    '(11) 99999-9999',
    'Desenvolvedor'
);
```

### 🔧 **Credenciais de Teste Atualizadas**

**Criador do Sistema:**
- E-mail: `admin@sistema.com`
- Senha: `123456`
- CPF: `12345678909`

**Funcionário de Teste:**
- CPF: `98765432100`
- Senha: `123456`

### 💡 **Dica para Testes**

Se precisar de mais CPFs válidos, você pode usar geradores online ou criar uma função para gerar CPFs válidos automaticamente. O importante é que os CPFs passem na validação do algoritmo brasileiro implementado no schema.

---

**✅ Use apenas os CPFs listados acima para evitar erros de validação!** 
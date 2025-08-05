# 🔧 CORREÇÃO DO ERRO 406 - LOGIN

## 🚨 Problema Identificado

O erro 406 estava ocorrendo porque o código de login estava tentando buscar usuários com `tipo: 'admin'`, mas no banco de dados o usuário foi criado com `tipo: 'criador'`.

## ✅ Correção Aplicada

### 1. Corrigido o Código de Login

**Arquivo**: `src/components/AdminLogin.jsx`

**Antes**:
```javascript
.eq('tipo', 'admin')
```

**Depois**:
```javascript
.in('tipo', ['admin', 'criador'])
```

### 2. Verificar Dados no Banco

Execute no SQL Editor do Supabase:

```sql
-- Verificar usuário criado
SELECT id, nome, email, tipo FROM usuarios WHERE email = 'admin@sistema.com';
```

**Resultado esperado**:
- nome: `Administrador do Sistema`
- email: `admin@sistema.com`
- tipo: `criador`

### 3. Testar Login Agora

**Credenciais de Teste**:
- **E-mail**: `admin@sistema.com`
- **Senha**: `123456`

## 🔍 Outras Possíveis Correções

### Se ainda houver erro 406:

1. **Verificar se o RLS está desabilitado**:
```sql
-- Desabilitar RLS temporariamente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios DISABLE ROW LEVEL SECURITY;
```

2. **Verificar se os dados existem**:
```sql
-- Verificar todos os usuários
SELECT * FROM usuarios;

-- Verificar funcionários
SELECT * FROM funcionarios;
```

3. **Reinserir dados se necessário**:
```sql
-- Deletar e reinserir usuário de teste
DELETE FROM usuarios WHERE email = 'admin@sistema.com';

INSERT INTO usuarios (nome, email, senha, cpf, tipo)
VALUES (
    'Administrador do Sistema',
    'admin@sistema.com',
    '123456',
    '12345678900',
    'criador'
);
```

## 🚀 Próximos Passos

1. **Teste o login** com as credenciais corrigidas
2. **Se funcionar**, reabilite o RLS com políticas corretas
3. **Configure o bucket** `holerites` se ainda não fez
4. **Teste todas as funcionalidades**

## 📞 Troubleshooting

### Se o erro persistir:

1. **Verifique o console** do navegador para mais detalhes
2. **Confirme que o schema foi executado** corretamente
3. **Teste a conexão** diretamente no SQL Editor
4. **Verifique se as credenciais** do Supabase estão corretas

---

**🎯 A correção principal foi alterar `.eq('tipo', 'admin')` para `.in('tipo', ['admin', 'criador'])` para permitir login tanto com admin quanto criador.** 
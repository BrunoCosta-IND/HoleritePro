# Configuração MCP do Supabase

## Arquivo de Configuração Criado

Foi criado o arquivo `mcp-config.json` com a configuração do MCP do Supabase.

## Passos para Configuração

### 1. Substituir Placeholders

No arquivo `mcp-config.json`, você precisa substituir os placeholders:

- `<project-ref>`: Substitua pelo ID do seu projeto Supabase
- `<sbp_40b874ae193113090fd764ec77c13a3fc8c2656f>`: Substitua pelo seu token de acesso real

### 2. Como Obter o Project Ref

1. Acesse o [dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para Settings > General
4. Copie o "Reference ID" (algo como `abcdefghijklmnop`)

### 3. Como Obter o Access Token

1. No dashboard do Supabase, vá para Settings > Access Tokens
2. Gere um novo token ou use um existente
3. Copie o token (começa com `sbp_`)

### 4. Configuração Final

Após substituir os valores, seu arquivo deve ficar assim:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=seu-project-ref-aqui"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### 5. Integração com Cursor

Para usar esta configuração no Cursor:

1. Copie o conteúdo do `mcp-config.json`
2. Abra as configurações do Cursor
3. Procure por "MCP" ou "Model Context Protocol"
4. Cole a configuração

### 6. Verificação

Após a configuração, você poderá:
- Fazer consultas ao banco de dados Supabase
- Executar operações de CRUD
- Gerenciar tabelas e dados
- Usar funções do Supabase

## Segurança

⚠️ **Importante**: 
- Nunca commite o arquivo `mcp-config.json` com tokens reais
- Adicione `mcp-config.json` ao `.gitignore` se contiver tokens
- Use variáveis de ambiente quando possível

## Exemplo de Uso

Com o MCP configurado, você poderá usar comandos como:
- Consultar dados das tabelas
- Inserir/atualizar registros
- Executar funções do Supabase
- Gerenciar autenticação 
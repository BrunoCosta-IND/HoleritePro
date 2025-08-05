# Atualizar Configuração MCP Global

## Problema Identificado

O arquivo `c:\Users\bruno\.cursor\mcp.json` tem uma estrutura incorreta com objetos aninhados. Precisamos corrigir isso e adicionar o Supabase.

## Configuração Corrigida

Substitua todo o conteúdo do arquivo `c:\Users\bruno\.cursor\mcp.json` por:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://n8n.brunoinc.space/",
        "N8N_API_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZDk0MTllNy05NTdlLTRkOTMtYTdjNi02ZWQ4NWQ4MDUzMDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUzNDU1NTE2fQ.FURDx6jTvYbIEu8fc-uJ8c-1zgKUqK36njK5mvan6vM"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "MCP_MODE": "stdio"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-brave-search"],
      "env": {
        "MCP_MODE": "stdio",
        "BRAVE_API_KEY": "your-brave-api-key-here"
      }
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "MCP_MODE": "stdio",
        "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
      }
    },
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=<project-ref>"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<sbp_40b874ae193113090fd764ec77c13a3fc8c2656f>"
      }
    }
  }
}
```

## Passos para Atualizar

1. **Abra o arquivo**: `c:\Users\bruno\.cursor\mcp.json`
2. **Substitua todo o conteúdo** pela configuração acima
3. **Substitua os placeholders**:
   - `<project-ref>` → ID do seu projeto Supabase
   - `<sbp_40b874ae193113090fd764ec77c13a3fc8c2656f>` → Seu token real

## Como Obter os Valores

### Project Ref:
1. Acesse [dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para Settings > General
4. Copie o "Reference ID"

### Access Token:
1. No dashboard, vá para Settings > Access Tokens
2. Gere um novo token ou use um existente
3. Copie o token (começa com `sbp_`)

## Configuração Final

Após substituir os valores, a seção do Supabase deve ficar assim:

```json
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
```

## Reiniciar Cursor

Após salvar o arquivo, reinicie o Cursor para que as mudanças tenham efeito.

## Verificação

Para verificar se está funcionando:
1. Abra o Cursor
2. Tente usar comandos relacionados ao Supabase
3. Verifique se não há erros na configuração 
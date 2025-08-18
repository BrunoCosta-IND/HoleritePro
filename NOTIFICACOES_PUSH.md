# Configuração de Notificações Push

Este documento explica como configurar e usar o sistema de notificações push do PWA.

## 🚀 Como Funciona

1. **Login do Funcionário**: Quando o funcionário faz login, o sistema solicita permissão para enviar notificações
2. **Registro da Subscription**: Se permitido, o navegador registra uma subscription única para o usuário
3. **Upload de Holerite**: Quando o admin faz upload de um holerite, o sistema envia notificação push
4. **Recebimento**: O funcionário recebe a notificação mesmo com o app fechado

## 📋 Pré-requisitos

### 1. Configurar VAPID Keys

Você precisa gerar chaves VAPID (Voluntary Application Server Identification):

```bash
# Instalar web-push globalmente
npm install -g web-push

# Gerar chaves VAPID
web-push generate-vapid-keys
```

### 2. Configurar Variáveis de Ambiente

Adicione as chaves VAPID ao seu arquivo `.env`:

```env
VITE_VAPID_PUBLIC_KEY=sua_chave_publica_vapid
SUPABASE_VAPID_PRIVATE_KEY=sua_chave_privada_vapid
```

### 3. Criar Tabela no Banco

Execute o SQL para criar a tabela de subscriptions:

```sql
-- Executar o arquivo: criar_tabela_push_subscriptions.sql
```

## 🔧 Configuração do Supabase

### 1. Edge Function

Deploy a Edge Function `send-push-notification` no Supabase:

```bash
supabase functions deploy send-push-notification
```

### 2. Configurar VAPID no Supabase

No dashboard do Supabase, vá em Settings > API e adicione as chaves VAPID.

## 📱 Como Usar

### Para Funcionários

1. **Primeiro Login**: O sistema solicitará permissão para notificações
2. **Permitir**: Clique em "Permitir" para receber notificações
3. **Receber Notificações**: Quando um holerite for enviado, você receberá uma notificação

### Para Administradores

1. **Upload de Holerite**: Faça upload normalmente
2. **Notificação Automática**: O sistema enviará notificação push automaticamente
3. **Logs**: Verifique os logs no console para acompanhar o envio

## 🔍 Debugging

### Verificar Permissões

```javascript
// No console do navegador
console.log('Notification permission:', Notification.permission)
```

### Verificar Subscription

```javascript
// Verificar se há subscription ativa
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Subscription:', subscription)
  })
})
```

### Logs do Service Worker

Abra as DevTools > Application > Service Workers para ver logs detalhados.

## 🛠️ Estrutura dos Arquivos

```
src/
├── hooks/
│   └── usePushNotifications.js    # Hook para gerenciar notificações
├── components/
│   ├── AdminLogin.jsx             # Solicita permissão no login
│   └── AdminUploadHolerites.jsx   # Envia notificação no upload
public/
└── sw.js                          # Service Worker com handlers
supabase/
└── functions/
    └── send-push-notification/    # Edge Function para envio
```

## 🚨 Troubleshooting

### Notificação não aparece

1. Verificar se a permissão foi concedida
2. Verificar se o service worker está registrado
3. Verificar logs do service worker
4. Verificar se as chaves VAPID estão corretas

### Erro de CORS

1. Verificar se a Edge Function está configurada corretamente
2. Verificar headers CORS na Edge Function

### Subscription não salva

1. Verificar se o usuário está autenticado
2. Verificar se a tabela `push_subscriptions` foi criada
3. Verificar políticas RLS no Supabase

## 📊 Monitoramento

### Logs Importantes

- `📱 Enviando notificação push para funcionário`
- `✅ Subscription encontrada, enviando notificação push`
- `✅ Notificação push enviada com sucesso`

### Métricas

- Taxa de sucesso das notificações
- Número de subscriptions ativas
- Tempo de entrega das notificações

## 🔒 Segurança

- As subscriptions são vinculadas ao usuário autenticado
- RLS (Row Level Security) protege os dados
- Chaves VAPID são necessárias para autenticação
- Notificações só são enviadas para usuários autorizados

## 📝 Notas Importantes

1. **HTTPS Obrigatório**: Notificações push só funcionam em HTTPS
2. **Service Worker**: Deve estar registrado e ativo
3. **Permissão do Usuário**: O usuário deve permitir notificações
4. **Navegador Suportado**: Chrome, Firefox, Safari, Edge
5. **Dispositivo**: Funciona em desktop e mobile

## 🎯 Próximos Passos

1. Implementar notificações em lote
2. Adicionar templates de notificação personalizáveis
3. Implementar agendamento de notificações
4. Adicionar analytics de notificações
5. Implementar notificações de lembrete

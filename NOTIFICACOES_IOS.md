# Notificações iOS - Guia de Configuração

## 📱 Limitações do iOS para PWAs

O iOS tem limitações específicas para notificações push em PWAs:

1. **Não suporta Service Workers** para notificações push
2. **Não permite notificações em background** para PWAs
3. **Só permite notificações locais** quando o app está aberto

## 🔧 Solução Implementada

Criamos um sistema híbrido que funciona em todas as plataformas:

### **Para Android/Desktop:**
- ✅ Notificações push reais via Service Worker
- ✅ Funcionam mesmo com app fechado
- ✅ Usam VAPID keys

### **Para iOS:**
- ✅ Notificações locais quando o app está aberto
- ✅ Sistema de notificações pendentes
- ✅ Verificação automática ao abrir o app

## 🚀 Como Funciona no iOS

### **1. Login do Funcionário**
```javascript
// Detecta automaticamente se é iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

if (isIOS) {
  // Solicita permissão para notificações locais
  await requestIOSPermission()
}
```

### **2. Upload de Holerite (Admin)**
```javascript
// Quando admin faz upload
if (isIOS) {
  // Salva notificação pendente no banco
  await savePendingNotification(userId, payload)
}
```

### **3. Abertura do App (Funcionário)**
```javascript
// Quando funcionário abre o app
if (isIOS) {
  // Verifica notificações pendentes
  await checkPendingNotifications()
  // Mostra notificações locais
}
```

## 📋 Configuração Necessária

### **1. Executar SQLs**
```sql
-- Tabela de subscriptions (já criada)
-- Executar: criar_tabela_push_subscriptions.sql

-- Tabela de notificações pendentes (nova)
-- Executar: criar_tabela_pending_notifications.sql
```

### **2. Variáveis de Ambiente**
```env
# Mesmas chaves VAPID (usadas para Android/Desktop)
VITE_VAPID_PUBLIC_KEY=sua_chave_publica
SUPABASE_VAPID_PRIVATE_KEY=sua_chave_privada
```

## 🔍 Debugging iOS

### **Verificar se é iOS**
```javascript
// No console do navegador
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
console.log('É iOS?', isIOS)
```

### **Verificar Permissão**
```javascript
// Verificar permissão de notificação
console.log('Notification permission:', Notification.permission)
```

### **Verificar Notificações Pendentes**
```javascript
// No dashboard do funcionário
// Abrir DevTools > Console
// Procurar por: "Verificando notificações pendentes"
```

## 📊 Fluxo Completo iOS

1. **Funcionário faz login** → Sistema detecta iOS
2. **Solicita permissão** → Usuário permite notificações locais
3. **Admin faz upload** → Sistema salva notificação pendente
4. **Funcionário abre app** → Sistema verifica notificações pendentes
5. **Mostra notificação** → Notificação local aparece

## 🎯 Vantagens da Solução

- ✅ **Funciona em todas as plataformas**
- ✅ **Não requer configuração adicional**
- ✅ **Detecção automática de plataforma**
- ✅ **Fallback elegante para iOS**
- ✅ **Experiência consistente**

## 🚨 Limitações iOS

- ❌ **Não funciona com app fechado**
- ❌ **Não suporta notificações push reais**
- ❌ **Depende do usuário abrir o app**
- ❌ **Limitação da Apple, não do nosso código**

## 📝 Notas Importantes

1. **Safari no iOS** é o único navegador que suporta PWAs
2. **Notificações locais** só funcionam quando o app está ativo
3. **Sistema de pendentes** garante que nenhuma notificação seja perdida
4. **Detecção automática** não requer configuração manual

## 🔄 Próximas Melhorias

1. **Notificações em lote** para iOS
2. **Agendamento de notificações** locais
3. **Badge count** no ícone do app
4. **Sons personalizados** para notificações
5. **Templates de notificação** específicos para iOS

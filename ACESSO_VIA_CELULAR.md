# 📱 ACESSO VIA CELULAR - SISTEMA DE HOLERITES

## 🎯 **CONFIGURAÇÃO REALIZADA:**
- ✅ **Servidor configurado** para aceitar conexões de rede
- ✅ **IP Local:** `192.168.1.232`
- ✅ **Porta:** `5173`
- ✅ **Status:** Servidor rodando em `0.0.0.0:5173`

## 📱 **COMO ACESSAR PELO CELULAR:**

### **PASSO 1: Conectar na Mesma Rede**
- ✅ **WiFi:** Celular e computador na mesma rede WiFi
- ✅ **Rede:** `192.168.1.x` (sua rede local)

### **PASSO 2: Acessar o Sistema**
**No navegador do celular, digite:**
```
http://192.168.1.232:5173
```

### **PASSO 3: Testar Login**
- ✅ **Funcionário:** Use CPF e senha
- ✅ **Admin:** Use email e senha

## 🔧 **SE NÃO FUNCIONAR:**

### **Opção 1: Liberar Firewall (Windows)**
1. **Abra PowerShell como Administrador**
2. **Execute:**
```powershell
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
```

### **Opção 2: Desativar Firewall Temporariamente**
1. **Painel de Controle** → **Sistema e Segurança**
2. **Firewall do Windows Defender**
3. **Desativar temporariamente**

### **Opção 3: Verificar Antivírus**
- ✅ **Windows Defender:** Pode bloquear conexões
- ✅ **Outros antivírus:** Verificar configurações

## 📋 **TESTES PARA VERIFICAR:**

### **Teste 1: Ping do Celular**
```
ping 192.168.1.232
```

### **Teste 2: Verificar Porta**
```bash
telnet 192.168.1.232 5173
```

### **Teste 3: Navegador**
```
http://192.168.1.232:5173
```

## 🚨 **PROBLEMAS COMUNS:**

### **❌ "Não é possível acessar este site"**
- **Causa:** Firewall bloqueando
- **Solução:** Liberar porta 5173

### **❌ "Conexão recusada"**
- **Causa:** Servidor não rodando
- **Solução:** Verificar se `npm run dev` está ativo

### **❌ "Tempo limite esgotado"**
- **Causa:** IP incorreto ou rede diferente
- **Solução:** Verificar IP e rede WiFi

## 🎯 **INSTRUÇÕES RÁPIDAS:**

### **Para Acessar:**
1. **Celular na mesma WiFi**
2. **Navegador:** `http://192.168.1.232:5173`
3. **Login:** CPF (funcionário) ou email (admin)

### **Para Testar:**
1. **Upload:** Holerite pelo admin
2. **Login:** Funcionário no celular
3. **Visualizar:** Holerite disponível
4. **Assinar:** Documento

## 📱 **RESULTADO ESPERADO:**
- ✅ **Sistema carrega** no celular
- ✅ **Login funciona** normalmente
- ✅ **Interface responsiva** (mobile-friendly)
- ✅ **Funcionalidades completas** disponíveis

**Agora teste acessando `http://192.168.1.232:5173` no seu celular!** 📱 
// Validações para o sistema de gestão de holerites

// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return { valid: false, error: 'CPF é obrigatório' }
  
  const numbers = cpf.replace(/\D/g, '')
  
  if (numbers.length !== 11) {
    return { valid: false, error: 'CPF deve ter 11 dígitos' }
  }
  
  // Verificar se não é uma sequência de números iguais
  if (/^(\d)\1{10}$/.test(numbers)) {
    return { valid: false, error: 'CPF inválido' }
  }
  
  // Algoritmo de validação do CPF
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.charAt(9))) {
    return { valid: false, error: 'CPF inválido' }
  }
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.charAt(10))) {
    return { valid: false, error: 'CPF inválido' }
  }
  
  return { valid: true, cpf: numbers }
}

// Validação de e-mail
export const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'E-mail é obrigatório' }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'E-mail inválido' }
  }
  
  return { valid: true, email: email.toLowerCase() }
}

// Validação de WhatsApp
export const validateWhatsApp = (whatsapp) => {
  if (!whatsapp) return { valid: false, error: 'WhatsApp é obrigatório' }
  
  const numbers = whatsapp.replace(/\D/g, '')
  
  if (numbers.length < 10 || numbers.length > 11) {
    return { valid: false, error: 'WhatsApp deve ter 10 ou 11 dígitos' }
  }
  
  // Verificar se começa com número válido
  if (numbers.length === 11 && !['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(numbers.substring(0, 2))) {
    return { valid: false, error: 'Código de área inválido' }
  }
  
  return { valid: true, whatsapp: numbers }
}

// Validação de senha
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Senha é obrigatória' }
  
  if (password.length < 6) {
    return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Senha muito longa' }
  }
  
  return { valid: true }
}

// Validação de nome
export const validateName = (name) => {
  if (!name) return { valid: false, error: 'Nome é obrigatório' }
  
  const cleanName = name.trim()
  
  if (cleanName.length < 2) {
    return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' }
  }
  
  if (cleanName.length > 100) {
    return { valid: false, error: 'Nome muito longo' }
  }
  
  // Verificar se contém apenas letras, espaços e alguns caracteres especiais
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
  if (!nameRegex.test(cleanName)) {
    return { valid: false, error: 'Nome contém caracteres inválidos' }
  }
  
  return { valid: true, name: cleanName }
}

// Validação de cargo
export const validateCargo = (cargo) => {
  if (!cargo) return { valid: false, error: 'Cargo é obrigatório' }
  
  const cleanCargo = cargo.trim()
  
  if (cleanCargo.length < 2) {
    return { valid: false, error: 'Cargo deve ter pelo menos 2 caracteres' }
  }
  
  if (cleanCargo.length > 50) {
    return { valid: false, error: 'Cargo muito longo' }
  }
  
  return { valid: true, cargo: cleanCargo }
}

// Validação de arquivo PDF
export const validatePDF = (file) => {
  if (!file) return { valid: false, error: 'Arquivo é obrigatório' }
  
  // Verificar tipo de arquivo
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Apenas arquivos PDF são permitidos' }
  }
  
  // Verificar tamanho (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande (máximo 10MB)' }
  }
  
  // Verificar nome do arquivo
  if (file.name.length > 255) {
    return { valid: false, error: 'Nome do arquivo muito longo' }
  }
  
  return { valid: true, file }
}

// Validação de data de holerite
export const validateHoleriteData = (mes, ano) => {
  if (!mes || !ano) {
    return { valid: false, error: 'Mês e ano são obrigatórios' }
  }
  
  const mesNum = parseInt(mes)
  const anoNum = parseInt(ano)
  
  if (mesNum < 1 || mesNum > 12) {
    return { valid: false, error: 'Mês inválido (1-12)' }
  }
  
  const currentYear = new Date().getFullYear()
  if (anoNum < 2020 || anoNum > currentYear + 1) {
    return { valid: false, error: `Ano inválido (2020-${currentYear + 1})` }
  }
  
  return { valid: true, mes: mesNum, ano: anoNum }
}

// Validação completa de funcionário
export const validateFuncionario = (data) => {
  const errors = {}
  
  // Validar nome
  const nameValidation = validateName(data.nome)
  if (!nameValidation.valid) {
    errors.nome = nameValidation.error
  }
  
  // Validar CPF
  const cpfValidation = validateCPF(data.cpf)
  if (!cpfValidation.valid) {
    errors.cpf = cpfValidation.error
  }
  
  // Validar e-mail
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error
  }
  
  // Validar WhatsApp
  const whatsappValidation = validateWhatsApp(data.whatsapp)
  if (!whatsappValidation.valid) {
    errors.whatsapp = whatsappValidation.error
  }
  
  // Validar cargo
  const cargoValidation = validateCargo(data.cargo)
  if (!cargoValidation.valid) {
    errors.cargo = cargoValidation.error
  }
  
  // Validar senha se fornecida
  if (data.senha) {
    const passwordValidation = validatePassword(data.senha)
    if (!passwordValidation.valid) {
      errors.senha = passwordValidation.error
    }
  }
  
  const hasErrors = Object.keys(errors).length > 0
  
  return {
    valid: !hasErrors,
    errors,
    data: hasErrors ? null : {
      nome: nameValidation.name,
      cpf: cpfValidation.cpf,
      email: emailValidation.email,
      whatsapp: whatsappValidation.whatsapp,
      cargo: cargoValidation.cargo,
      ...(data.senha && { senha: data.senha })
    }
  }
}

// Validação completa de usuário
export const validateUsuario = (data) => {
  const errors = {}
  
  // Validar nome
  const nameValidation = validateName(data.nome)
  if (!nameValidation.valid) {
    errors.nome = nameValidation.error
  }
  
  // Validar CPF
  const cpfValidation = validateCPF(data.cpf)
  if (!cpfValidation.valid) {
    errors.cpf = cpfValidation.error
  }
  
  // Validar e-mail
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error
  }
  
  // Validar senha se fornecida
  if (data.senha) {
    const passwordValidation = validatePassword(data.senha)
    if (!passwordValidation.valid) {
      errors.senha = passwordValidation.error
    }
  }
  
  // Validar tipo
  if (!data.tipo || !['admin', 'criador'].includes(data.tipo)) {
    errors.tipo = 'Tipo de usuário inválido'
  }
  
  const hasErrors = Object.keys(errors).length > 0
  
  return {
    valid: !hasErrors,
    errors,
    data: hasErrors ? null : {
      nome: nameValidation.name,
      cpf: cpfValidation.cpf,
      email: emailValidation.email,
      tipo: data.tipo,
      ...(data.senha && { senha: data.senha }),
      ...(data.cargo && { cargo: data.cargo }),
      ...(data.whatsapp && { whatsapp: data.whatsapp })
    }
  }
}

// Formatação de CPF
export const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1.$2')
  if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')
}

// Formatação de WhatsApp
export const formatWhatsApp = (value) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

// Sanitização de entrada
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validação de rate limiting
export const checkRateLimit = (key, maxRequests = 5, timeWindow = 60000) => {
  const now = Date.now()
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]')
  
  // Filtrar requests dentro da janela de tempo
  const validRequests = requests.filter(time => now - time < timeWindow)
  
  if (validRequests.length >= maxRequests) {
    return { allowed: false, error: 'Muitas tentativas. Tente novamente em alguns minutos.' }
  }
  
  // Adicionar nova request
  validRequests.push(now)
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests))
  
  return { allowed: true }
} 
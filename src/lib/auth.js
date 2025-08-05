import bcrypt from 'bcryptjs'
import { supabase } from './utils'

// Função para hash de senha
export const hashPassword = async (password) => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Função para verificar senha
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

// Função de login segura
export const loginUser = async (email, password) => {
  try {
    // Buscar usuário por email
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('tipo', 'admin')
      .single()

    if (error || !user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.senha)
    
    if (!isValidPassword) {
      return { success: false, error: 'Senha incorreta' }
    }

    // Login de auditoria
    await logActivity(user.id, 'login', `Login realizado com sucesso`)

    return { 
      success: true, 
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        cpf: user.cpf
      }
    }
  } catch (error) {
    console.error('Erro no login:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função de login para funcionários
export const loginFuncionario = async (cpf, password) => {
  try {
    // Buscar funcionário por CPF
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('cpf', cpf)
      .single()

    if (error || !funcionario) {
      return { success: false, error: 'Funcionário não encontrado' }
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, funcionario.senha)
    
    if (!isValidPassword) {
      return { success: false, error: 'Senha incorreta' }
    }

    // Log de auditoria
    await logActivity(funcionario.id, 'login_funcionario', `Login de funcionário realizado`)

    return { 
      success: true, 
      user: {
        id: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
        cpf: funcionario.cpf,
        cargo: funcionario.cargo,
        tipo: 'funcionario'
      }
    }
  } catch (error) {
    console.error('Erro no login do funcionário:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para criar usuário com senha hasheada
export const createUser = async (userData) => {
  try {
    // Hash da senha
    const hashedPassword = await hashPassword(userData.senha)
    
    const payload = {
      ...userData,
      senha: hashedPassword,
      tipo: 'admin' // Forçar tipo admin
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([payload])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Log de auditoria
    await logActivity(data[0].id, 'create_user', `Usuário criado: ${userData.email}`)

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para criar funcionário com senha hasheada
export const createFuncionario = async (funcionarioData) => {
  try {
    // Hash da senha
    const hashedPassword = await hashPassword(funcionarioData.senha)
    
    const payload = {
      ...funcionarioData,
      senha: hashedPassword
    }

    const { data, error } = await supabase
      .from('funcionarios')
      .insert([payload])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Log de auditoria
    await logActivity(data[0].id, 'create_funcionario', `Funcionário criado: ${funcionarioData.email}`)

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Erro ao criar funcionário:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para resetar senha
export const resetPassword = async (userId, newPassword, tableName = 'usuarios') => {
  try {
    const hashedPassword = await hashPassword(newPassword)
    
    const { error } = await supabase
      .from(tableName)
      .update({ senha: hashedPassword })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Log de auditoria
    await logActivity(userId, 'password_reset', `Senha resetada`)

    return { success: true }
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para log de atividades
export const logActivity = async (userId, action, details) => {
  try {
    await supabase
      .from('logs_atividade')
      .insert([{
        usuario_id: userId,
        acao: action,
        detalhes: details,
        timestamp: new Date().toISOString(),
        ip: await getClientIP()
      }])
  } catch (error) {
    console.error('Erro ao registrar log:', error)
  }
}

// Função para obter IP do cliente
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    return 'unknown'
  }
}

// Função para validar sessão
export const validateSession = () => {
  const userSession = localStorage.getItem('usuarioLogado')
  if (!userSession) return null
  
  try {
    return JSON.parse(userSession)
  } catch (error) {
    localStorage.removeItem('usuarioLogado')
    return null
  }
}

// Função para logout
export const logout = async () => {
  const user = validateSession()
  if (user) {
    await logActivity(user.id, 'logout', 'Logout realizado')
  }
  localStorage.removeItem('usuarioLogado')
} 
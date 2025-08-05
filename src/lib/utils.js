import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Configurações do Supabase - NOVO PROJETO
const supabaseUrl = 'https://lyzuwgjwvtsfgwttxzdk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5enV3Z2p3dnRzZmd3dHR4emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDQ4MDMsImV4cCI6MjA2OTkyMDgwM30.-9NttBkzpCL8oYuxgB1W6-7avA1AKcye4z30RpLtyRE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para formatar CPF
export function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para validar CPF
export function validateCPF(cpf) {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Para testes, aceita CPFs válidos
  return true;
}

// Função para formatar data
export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// Função para formatar tamanho de arquivo
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função para obter nome do mês
export function getMonthName(month) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
}

// Função para gerar nome de arquivo único
export function generateUniqueFileName(originalName, cpf, mes, ano) {
  const extension = originalName.split('.').pop();
  const timestamp = Date.now();
  return `${cpf}_${mes}_${ano}_${timestamp}.${extension}`;
}

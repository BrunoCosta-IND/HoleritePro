#!/usr/bin/env node

/**
 * Script de Configuração Automática do Supabase
 * Sistema de Gestão de Holerites
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurações do Supabase (atualize com suas credenciais)
const SUPABASE_URL = 'https://lgqtbaavnavggzdtlijk.supabase.co';
const SUPABASE_ANON_KEY = 'sua_chave_anon_aqui';

// Inicializar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...');
  
  try {
    // 1. Ler o schema SQL
    const schemaPath = path.join(__dirname, 'schema_completo_sistema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Schema SQL carregado com sucesso');
    
    // 2. Executar o schema
    console.log('⚙️ Executando schema no Supabase...');
    
    // Dividir o SQL em comandos individuais
    const commands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await supabase.rpc('exec_sql', { sql: command });
          console.log('✅ Comando executado:', command.substring(0, 50) + '...');
        } catch (error) {
          console.log('⚠️ Erro no comando:', error.message);
        }
      }
    }
    
    console.log('✅ Schema executado com sucesso!');
    
    // 3. Verificar se as tabelas foram criadas
    console.log('🔍 Verificando tabelas criadas...');
    
    const tables = [
      'usuarios',
      'funcionarios', 
      'holerite',
      'empresa_config',
      'funcionalidades_pro',
      'logs_atividade',
      'uploads_n8n'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Erro na tabela ${table}:`, error.message);
        } else {
          console.log(`✅ Tabela ${table} criada com sucesso`);
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar tabela ${table}:`, error.message);
      }
    }
    
    console.log('\n🎉 Configuração concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure o bucket "holerites" no Storage do Supabase');
    console.log('2. Atualize as credenciais no arquivo src/lib/utils.js');
    console.log('3. Teste o sistema com as credenciais de exemplo');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    console.log('\n💡 Dica: Execute o schema manualmente no SQL Editor do Supabase');
  }
}

// Função para criar bucket de storage
async function createStorageBucket() {
  console.log('📦 Criando bucket de storage...');
  
  try {
    // Nota: Criação de bucket via API pode não estar disponível
    // Recomenda-se criar manualmente no painel do Supabase
    console.log('ℹ️ Crie o bucket "holerites" manualmente no painel do Supabase:');
    console.log('   - Nome: holerites');
    console.log('   - Público: false');
    console.log('   - Tamanho máximo: 10MB');
    console.log('   - Tipos permitidos: pdf');
  } catch (error) {
    console.log('⚠️ Erro ao criar bucket:', error.message);
  }
}

// Função principal
async function main() {
  console.log('🏗️ Configuração Automática do Sistema de Holerites');
  console.log('==================================================\n');
  
  // Verificar se as credenciais estão configuradas
  if (SUPABASE_ANON_KEY === 'sua_chave_anon_aqui') {
    console.log('❌ Configure as credenciais do Supabase no script');
    console.log('📝 Atualize SUPABASE_URL e SUPABASE_ANON_KEY');
    return;
  }
  
  await setupDatabase();
  await createStorageBucket();
  
  console.log('\n✅ Configuração finalizada!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase, createStorageBucket }; 
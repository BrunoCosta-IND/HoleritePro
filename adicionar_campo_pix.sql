-- Adicionar campo PIX na tabela funcionarios
-- Execute este SQL no seu banco Supabase

-- Adicionar coluna PIX
ALTER TABLE funcionarios 
ADD COLUMN pix VARCHAR(100);

-- Comentário para documentar o campo
COMMENT ON COLUMN funcionarios.pix IS 'Chave PIX do funcionário (apenas para informação)';

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
AND column_name = 'pix'; 
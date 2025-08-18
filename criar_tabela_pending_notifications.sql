-- Criar tabela para armazenar notificações pendentes (especialmente para iOS)
CREATE TABLE IF NOT EXISTS pending_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_pending_notifications_user_id ON pending_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_notifications_sent ON pending_notifications(sent);

-- Habilitar RLS (Row Level Security)
ALTER TABLE pending_notifications ENABLE ROW LEVEL SECURITY;

-- Política para usuários só verem suas próprias notificações
CREATE POLICY "Users can manage their own pending notifications" ON pending_notifications
  FOR ALL USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pending_notifications_updated_at 
  BEFORE UPDATE ON pending_notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

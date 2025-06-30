// Backend para resetar senha de usuário no Supabase Auth
// Instale: npm install express @supabase/supabase-js cors
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Use sua Service Role Key aqui (NUNCA exponha no frontend!)
const supabase = createClient(
  'https://wrvylxugofbckdnouvqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndydnlseHVnb2ZiY2tkbm91dnFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk0OTQwOSwiZXhwIjoyMDY2NTI1NDA5fQ._DBGZWk1iLdHwggQJBd_4F7-Kw2SS_P06gt4v7rCVFE'
);

app.post('/api/resetar-senha', async (req, res) => {
  const { email, novaSenha } = req.body;
  if (!email || !novaSenha) {
    return res.status(400).json({ error: 'E-mail e nova senha são obrigatórios.' });
  }

  // Buscar usuário pelo e-mail
  const { data: users, error: searchError } = await supabase.auth.admin.listUsers({ email });
  if (searchError || !users || users.users.length === 0) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const userId = users.users[0].id;

  // Atualizar senha
  const { error } = await supabase.auth.admin.updateUserById(userId, { password: novaSenha });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
}); 
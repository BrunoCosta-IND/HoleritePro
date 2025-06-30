import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrvylxugofbckdnouvqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndydnlseHVnb2ZiY2tkbm91dnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDk0MDksImV4cCI6MjA2NjUyNTQwOX0.uHqG2yDxlrYLJSHjM_-tGbwTaIWXexgKCz3hgDC6z0A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
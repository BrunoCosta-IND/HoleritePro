import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const supabase = createClient(
  'https://juaxetskyatdzwtpkboq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YXhldHNreWF0ZHp3dHBrYm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzY5NDMsImV4cCI6MjA2NzE1Mjk0M30.McflzaMB330tKbb6BJKcBoncWkpCMjv-8NcLvmrh3s0'
);

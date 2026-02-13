/**
 * Cliente Supabase — Preparado para integración futura.
 * 
 * INSTRUCCIONES PARA ACTIVAR:
 * 1. Crear un proyecto en https://supabase.com
 * 2. Copiar la URL del proyecto y la clave anónima
 * 3. Crear archivo .env.local con:
 *    NEXT_PUBLIC_SUPABASE_URL=tu_url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave
 * 4. Instalar: npm install @supabase/supabase-js
 * 5. Descomentar el código a continuación
 * 
 * ESQUEMA SQL SUGERIDO:
 * 
 * CREATE TABLE support_tickets (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   message TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE sizing_results (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   method TEXT NOT NULL,
 *   installation_type TEXT,
 *   rooms INTEGER,
 *   devices JSONB,
 *   ats_enabled BOOLEAN DEFAULT false,
 *   running_load NUMERIC,
 *   peak_load NUMERIC,
 *   recommended_generator TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder export para que el archivo no genere errores de importación
export const supabase = null;

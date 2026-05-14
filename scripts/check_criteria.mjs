import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data, error } = await supabase
  .from('project_applications')
  .select('id, status, notes, custom_answers')
  .eq('status', 'rejected')
  .limit(3);

if (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

console.log(`\n=== ${data.length} registros rechazados (muestra) ===\n`);
for (const row of data) {
  const ca = row.custom_answers ?? {};
  console.log('ID:', row.id);
  console.log('notes:', row.notes);
  console.log('razon_rechazo:', ca.razon_rechazo ?? '(vacío)');
  console.log('cumple_edad:', ca.cumple_edad ?? '(vacío)');
  console.log('cumple_municipio:', ca.cumple_municipio ?? '(vacío)');
  console.log('cumple_empleabilidad:', ca.cumple_empleabilidad ?? '(vacío)');
  console.log('cumple_estrato:', ca.cumple_estrato ?? '(vacío)');
  console.log('cumple_sisben:', ca.cumple_sisben ?? '(vacío)');
  console.log('cumple_formacion:', ca.cumple_formacion ?? '(vacío)');
  console.log('---');
}

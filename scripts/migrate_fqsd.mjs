import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carga variables desde .env.local en la raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// ── CONFIG ─────────────────────────────────────────────────────────────────────
// Modos de ejecución:
//   node migrate_fqsd.mjs           → simulación local (sin Supabase)
//   node migrate_fqsd.mjs --check   → verifica quién ya existe en Supabase
//   node migrate_fqsd.mjs --run     → migración real
const DRY_RUN    = !process.argv.includes('--run') && !process.argv.includes('--check');
const CHECK_MODE = process.argv.includes('--check');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno. Verifica que .env.local tenga SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const COHORT_ID     = '0f89803e-e36a-43a8-aeb6-70a72bc6acce';
const PROJECT_ID    = '8d336f07-1115-435f-b917-75043df25cba';
const ORIGIN_SOURCE = 'convocatoria virtual';
const EXCEL_PATH    = resolve(__dirname, '../databases/Estructura db.xlsx');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── HELPERS ────────────────────────────────────────────────────────────────────
function excelSerialToDate(serial) {
  if (!serial || typeof serial !== 'number') return null;
  return new Date((serial - 25569) * 86400 * 1000).toISOString().split('T')[0];
}

function excelSerialToISO(serial) {
  if (!serial || typeof serial !== 'number') return null;
  return new Date((serial - 25569) * 86400 * 1000).toISOString();
}

function normalizeDoc(d) {
  return String(d ?? '').replace(/[.\s,\-]/g, '').trim();
}

function isValidDoc(doc) {
  return /^\d{5,12}$/.test(doc);
}

function parseDocType(raw) {
  const s = String(raw ?? '').trim();
  if (s.startsWith('CC'))  return 'CC';
  if (s.startsWith('CE'))  return 'CE';
  if (s.startsWith('PPT')) return 'PPT';
  return 'CC';
}

function parseEstrato(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  if (s.toLowerCase().includes('rural')) return 'zona_rural';
  const match = s.match(/\((\d)\)/);
  return match ? match[1] : null;
}

function parseSisben(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  if (s.startsWith('No aplica')) return 'No aplica';
  // Valid values: A1 a A5, B1 a B7, C1 a C18, D1 a D21
  if (/^[ABCD]\d/.test(s)) return s.split(' ').slice(0, 3).join(' ');
  return s;
}

// Divide "Nombre Completo" en first_name y last_name.
// Convención Colombia: [nombre(s)] [apellido paterno] [apellido materno]
// 4+ palabras → primeras 2 = nombre, últimas N = apellido
// 3 palabras  → primera 1 = nombre, últimas 2 = apellido
// 2 palabras  → primera = nombre, segunda = apellido
function splitName(fullName) {
  const words = String(fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { first: '', last: '' };
  if (words.length === 1) return { first: words[0], last: '' };
  if (words.length === 2) return { first: words[0], last: words[1] };
  if (words.length === 3) return { first: words[0], last: `${words[1]} ${words[2]}` };
  return { first: `${words[0]} ${words[1]}`, last: words.slice(2).join(' ') };
}

// Construye la razón de rechazo listando qué criterios no cumplió.
function getRejectionReason(row) {
  const fails = [];
  if (row['CUMPLE / NO CUMPLE EDAD']         === 'NO CUMPLE') fails.push('edad');
  if (row['CUMPLE / NO CUMPLE MUNICIPIO']     === 'NO CUMPLE') fails.push('municipio');
  if (row['CUMPLE / NO CUMPLE EMPLEABILIDAD'] === 'NO CUMPLE') fails.push('empleabilidad');
  if (row['CUMPLE / NO CUMPLE ESTRATO']       === 'NO CUMPLE') fails.push('estrato');
  if (row['CUMPLE / NO CUMPLE SISBEN']        === 'NO CUMPLE') fails.push('sisbén');
  if (row['CUMPLE / NO CUMPLE FORMACION']     === 'NO CUMPLE') fails.push('formación TI');
  return fails.length ? `No cumple: ${fails.join(', ')}` : 'No admitida (razón no especificada)';
}

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  const s = String(val ?? '').toLowerCase().trim();
  return s === 'true' || s === 'si' || s === 'sí' || s === 'acepto' || s === '1';
}

// ── 1. TRANSFORMAR FILAS DEL EXCEL ─────────────────────────────────────────────
function transformRows(rawRows) {
  return rawRows.map((r, i) => {
    const fullName   = String(r['Nombre Completo'] ?? '').trim();
    const { first, last } = splitName(fullName);
    const docRaw     = String(r['Número de Documento de Identidad'] ?? '').trim();
    const docNorm    = normalizeDoc(docRaw);
    const email      = String(r['Dirección de correo electrónico'] ?? '').toLowerCase().trim();
    const verificacion = String(r['Verificación CUMPLE / NO CUMPLE'] ?? '').trim();
    const isHabilitada = verificacion === 'Habilitada';
    const rejectionReason = isHabilitada ? null : getRejectionReason(r);

    const candidate = {
      first_name:       first,
      last_name:        last,
      document_type:    parseDocType(r['Tipo de Documento de Identidad']),
      document_number:  docNorm,
      phone:            String(r['Número celular con WhatsApp '] ?? '').trim(),
      email,
      city:             String(r['Municipio de Residencia'] ?? '').trim(),
      address:          String(r['Dirección de Residencia'] ?? '').trim(),
      birth_date:       excelSerialToDate(r['Fecha de Nacimiento']),
      age:              r['Edad'] ? parseInt(r['Edad'], 10) : null,
      origin_source:    ORIGIN_SOURCE,
      is_active:        isHabilitada,
      accepted_policies: parseBool(r['Autorizo el uso y tratamiento de mis datos ']),
      accepted_at:      isHabilitada ? new Date().toISOString() : null,
    };

    const application = {
      cohort_id:    COHORT_ID,
      current_step: isHabilitada ? 'inscripcion' : 'Preinscripcion',
      status:       isHabilitada ? 'active' : 'rejected',
      notes:        rejectionReason,
      custom_answers: {
        // Datos del programa QSD
        verificacion,
        sisben:              parseSisben(r['Grupo Sisbén']),
        estrato:             parseEstrato(r['Estrato Socioeconómico']),
        barrio:              String(r['Barrio de Residencia'] ?? '').trim() || null,
        ocupacion:           String(r['Ocupación Actual'] ?? '').trim() || null,
        tiempo_desempleado:  String(r['Tiempo Desempleado (Solo Desempleado)'] ?? '').trim() || null,
        perfil_ti:           String(r['En caso de que si, elige uno de los perfiles presente en esta lista'] ?? '').trim() || null,
        perfil_otro:         String(r['¿Otro? ¿Cuál?'] ?? '').trim() || null,
        tiene_formacion_ti:  parseBool(r['¿Tienes formación en algún campo TI/ Digital?']),
        // Flags de elegibilidad
        cumple_edad:          r['CUMPLE / NO CUMPLE EDAD']         === 'CUMPLE',
        cumple_municipio:     r['CUMPLE / NO CUMPLE MUNICIPIO']     === 'CUMPLE',
        cumple_empleabilidad: r['CUMPLE / NO CUMPLE EMPLEABILIDAD'] === 'CUMPLE',
        cumple_estrato:       r['CUMPLE / NO CUMPLE ESTRATO']       === 'CUMPLE',
        cumple_sisben:        r['CUMPLE / NO CUMPLE SISBEN']        === 'CUMPLE',
        cumple_formacion:     r['CUMPLE / NO CUMPLE FORMACION']     === 'CUMPLE',
        cumple_perfil:        r['CUMPLE / NO CUMPLE FORMACION especifica'] === 'CUMPLE',
        // Contacto y auditoría
        correo_formulario:    email,
        correo_alterno:       String(r['Correo Electrónico alterno'] ?? '').trim() || null,
        telefono_secundario:  String(r['Teléfono Secundario'] ?? '').trim() || null,
        comunicacion_enviada: parseBool(r['Enviada la comunicacion']),
        fecha_registro:       excelSerialToISO(r['Marca temporal']),
        fecha_expedicion_doc: excelSerialToDate(r['Fecha de expedicón de documento']),
        razon_rechazo:        rejectionReason,
      },
    };

    const socioDemo = {
      socioeconomic_stratum: parseEstrato(r['Estrato Socioeconómico']),
    };

    return {
      candidate,
      application,
      socioDemo,
      _docRaw: docRaw,
      _docNorm: docNorm,
      _isValid: isValidDoc(docNorm),
      _fullName: fullName,
    };
  });
}

// ── 2. DEDUPLICAR ──────────────────────────────────────────────────────────────
// Estrategia: por cada documento duplicado, se prefiere el registro "Habilitada".
// Si ambos tienen el mismo estado, se toma el primero (orden del Excel).
// Luego se hace lo mismo para emails duplicados entre los registros ya únicos por doc.
function deduplicate(transformed) {
  const warnings = [];
  const byDoc   = new Map(); // docNorm → item
  const byEmail = new Map(); // email → item
  const invalid = [];

  // Primera pasada: deduplicar por documento
  for (const item of transformed) {
    if (!item._isValid) {
      invalid.push(item);
      continue;
    }

    const doc = item._docNorm;
    if (byDoc.has(doc)) {
      const existing = byDoc.get(doc);
      const newIsActive     = item.application.status === 'active';
      const existingIsActive = existing.application.status === 'active';

      if (newIsActive && !existingIsActive) {
        warnings.push({ tipo: 'dup_doc_reemplazado', doc, mantenido: item._fullName, descartado: existing._fullName });
        byDoc.set(doc, item);
      } else {
        warnings.push({ tipo: 'dup_doc_omitido', doc, mantenido: existing._fullName, descartado: item._fullName });
      }
    } else {
      byDoc.set(doc, item);
    }
  }

  // Segunda pasada: deduplicar por email entre los únicos por doc
  for (const item of byDoc.values()) {
    const email = item.candidate.email;
    if (!email) {
      invalid.push(item);
      continue;
    }

    if (byEmail.has(email)) {
      const existing = byEmail.get(email);
      const newIsActive      = item.application.status === 'active';
      const existingIsActive = existing.application.status === 'active';

      if (newIsActive && !existingIsActive) {
        warnings.push({ tipo: 'dup_email_reemplazado', email, mantenido: item._fullName, descartado: existing._fullName });
        byEmail.set(email, item);
      } else {
        warnings.push({ tipo: 'dup_email_omitido', email, mantenido: existing._fullName, descartado: item._fullName });
      }
    } else {
      byEmail.set(email, item);
    }
  }

  return { unique: [...byEmail.values()], invalid, warnings };
}

// ── 3. INSERT EN LOTES ─────────────────────────────────────────────────────────
async function batchInsert(table, rows, batchSize = 100) {
  const result = { inserted: 0, errors: [] };
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      result.errors.push({ desde: i, hasta: i + batch.length - 1, error: error.message });
    } else {
      result.inserted += batch.length;
    }
  }
  return result;
}

// ── VERIFICACIÓN CONTRA SUPABASE ──────────────────────────────────────────────
async function checkExisting(unique) {
  const docNumbers = unique.map(u => u.candidate.document_number);
  const emails     = unique.map(u => u.candidate.email);

  // Buscar por documento
  const { data: byDoc, error: e1 } = await supabase
    .from('candidates')
    .select('id, document_number, email, first_name, last_name')
    .in('document_number', docNumbers);
  if (e1) throw new Error(`Error consultando por documento: ${e1.message}`);

  // Buscar por email (para detectar misma persona con diferente doc)
  const { data: byEmail, error: e2 } = await supabase
    .from('candidates')
    .select('id, document_number, email, first_name, last_name')
    .in('email', emails);
  if (e2) throw new Error(`Error consultando por email: ${e2.message}`);

  const existsByDoc   = new Map(byDoc.map(c => [c.document_number, c]));
  const existsByEmail = new Map(byEmail.map(c => [c.email, c]));

  const results = {
    existePorDoc:   [],   // doc coincide exactamente → mismo candidato
    existePorEmail: [],   // doc no coincide pero email sí → posible duplicado
    nuevos:         [],   // no existe de ninguna forma
  };

  for (const item of unique) {
    const doc   = item.candidate.document_number;
    const email = item.candidate.email;
    const name  = `${item.candidate.first_name} ${item.candidate.last_name}`;

    if (existsByDoc.has(doc)) {
      const existing = existsByDoc.get(doc);
      results.existePorDoc.push({
        name,
        doc,
        email,
        supabase_id:    existing.id,
        supabase_name:  `${existing.first_name} ${existing.last_name}`,
        supabase_email: existing.email,
      });
    } else if (existsByEmail.has(email)) {
      const existing = existsByEmail.get(email);
      results.existePorEmail.push({
        name,
        doc,
        email,
        supabase_id:   existing.id,
        supabase_name: `${existing.first_name} ${existing.last_name}`,
        supabase_doc:  existing.document_number,
      });
    } else {
      results.nuevos.push({ name, doc, email });
    }
  }

  return results;
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
async function main() {
  const modeLabel = CHECK_MODE ? '🔎  MODO VERIFICACIÓN — consultando Supabase'
    : DRY_RUN ? '🔍  MODO SIMULACIÓN — sin conexión a Supabase'
    : '🚀  MODO EJECUCIÓN — insertando en Supabase';
  console.log(modeLabel + '\n');

  // 1. Leer Excel
  console.log('📂 Leyendo Excel...');
  const wb      = XLSX.readFile(EXCEL_PATH);
  const ws      = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`   ${rawRows.length} filas leídas\n`);

  // 2. Transformar
  console.log('⚙️  Transformando datos...');
  const transformed = transformRows(rawRows);

  // 3. Deduplicar
  console.log('🔎 Detectando duplicados...\n');
  const { unique, invalid, warnings } = deduplicate(transformed);

  const habilitados = unique.filter(u => u.application.status === 'active');
  const rechazados  = unique.filter(u => u.application.status === 'rejected');

  // ── Resumen ──
  console.log('═══════════════════════════════════════════════');
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('═══════════════════════════════════════════════');
  console.log(`   Total en Excel:              ${rawRows.length}`);
  console.log(`   Documentos inválidos:         ${invalid.length}`);
  console.log(`   Duplicados resueltos:         ${warnings.length}`);
  console.log(`   Registros únicos a migrar:    ${unique.length}`);
  console.log(`   ├─ Habilitados (active):      ${habilitados.length}`);
  console.log(`   └─ No admitidos (rejected):   ${rechazados.length}`);

  if (invalid.length) {
    console.log(`\n❌ Documentos inválidos (omitidos):`);
    invalid.forEach(i =>
      console.log(`   ${i._fullName} — doc: "${i._docRaw}" — email: ${i.candidate.email}`)
    );
  }

  if (warnings.length) {
    console.log(`\n⚠️  Duplicados resueltos:`);
    warnings.forEach(w => {
      if (w.tipo === 'dup_doc_reemplazado')
        console.log(`   [doc:${w.doc}] Se reemplaza "${w.descartado}" → se mantiene "${w.mantenido}" (habilitado)`);
      if (w.tipo === 'dup_doc_omitido')
        console.log(`   [doc:${w.doc}] Se omite "${w.descartado}" → se mantiene "${w.mantenido}"`);
      if (w.tipo === 'dup_email_reemplazado')
        console.log(`   [email:${w.email}] Se reemplaza "${w.descartado}" → se mantiene "${w.mantenido}" (habilitado)`);
      if (w.tipo === 'dup_email_omitido')
        console.log(`   [email:${w.email}] Se omite "${w.descartado}" → se mantiene "${w.mantenido}"`);
    });
  }

  // ── Muestra de 3 registros ──
  console.log('\n📋 Muestra (primeros 3 registros a insertar):');
  unique.slice(0, 3).forEach((item, i) => {
    const c = item.candidate;
    const a = item.application;
    console.log(`\n  [${i + 1}] ${c.first_name} ${c.last_name}`);
    console.log(`       doc: ${c.document_type} ${c.document_number} | email: ${c.email}`);
    console.log(`       ciudad: ${c.city} | nacimiento: ${c.birth_date} | edad: ${c.age}`);
    console.log(`       step: ${a.current_step} | status: ${a.status}`);
    console.log(`       sisben: ${a.custom_answers.sisben} | estrato: ${a.custom_answers.estrato}`);
    console.log(`       perfil_ti: ${a.custom_answers.perfil_ti ?? '—'}`);
    if (a.notes) console.log(`       notas: ${a.notes}`);
  });

  if (DRY_RUN) {
    console.log('\n\n✋ Simulación completada.');
    console.log('   node scripts/migrate_fqsd.mjs --check  → verificar quién ya existe en Supabase');
    console.log('   node scripts/migrate_fqsd.mjs --run    → ejecutar migración real');
    return;
  }

  // ── MODO CHECK ───────────────────────────────────────────────────────────────
  if (CHECK_MODE) {
    console.log('\n🔗 Consultando Supabase...');
    const check = await checkExisting(unique);

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 RESULTADO DE VERIFICACIÓN');
    console.log('═══════════════════════════════════════════════');
    console.log(`   Nuevos (no existen en plataforma):   ${check.nuevos.length}`);
    console.log(`   Ya existen (por documento):          ${check.existePorDoc.length}`);
    console.log(`   Posibles duplicados (por email):     ${check.existePorEmail.length}`);

    if (check.existePorDoc.length) {
      console.log('\n⚠️  Ya registrados en plataforma (mismo documento):');
      check.existePorDoc.forEach(p => {
        const mismoNombre  = p.supabase_name.trim().toLowerCase() === p.name.trim().toLowerCase();
        const mismoEmail   = p.supabase_email === p.email;
        const tag = mismoNombre ? '✅ mismo nombre' : `⚠️  nombre diferente → plataforma: "${p.supabase_name}"`;
        const emailTag = mismoEmail ? '' : ` | email plataforma: ${p.supabase_email}`;
        console.log(`   ${p.name} (doc: ${p.doc}) — ${tag}${emailTag}`);
      });
    }

    if (check.existePorEmail.length) {
      console.log('\n🔴 Posibles duplicados (email coincide pero documento diferente):');
      console.log('   REVISAR MANUALMENTE — puede ser la misma persona con cédula incorrecta:');
      check.existePorEmail.forEach(p => {
        console.log(`   Excel:     ${p.name} | doc: ${p.doc} | email: ${p.email}`);
        console.log(`   Supabase:  ${p.supabase_name} | doc: ${p.supabase_doc}`);
        console.log();
      });
    }

    if (check.nuevos.length) {
      console.log(`\n✅ Nuevos (se crearán en la migración): ${check.nuevos.length}`);
      if (check.nuevos.length <= 20) {
        check.nuevos.forEach(p => console.log(`   ${p.name} (doc: ${p.doc})`));
      } else {
        check.nuevos.slice(0, 10).forEach(p => console.log(`   ${p.name} (doc: ${p.doc})`));
        console.log(`   ... y ${check.nuevos.length - 10} más`);
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('💡 Para proceder: node scripts/migrate_fqsd.mjs --run');
    console.log('   El script omite automáticamente los que ya existen por documento.');
    return;
  }

  // ── INSERCIÓN EN SUPABASE ────────────────────────────────────────────────────
  console.log('\n\n⬆️  Paso 1/4 — Verificando candidatos existentes en Supabase...');
  const docNumbers = unique.map(u => u.candidate.document_number);
  const { data: existing, error: existingErr } = await supabase
    .from('candidates')
    .select('id, document_number')
    .in('document_number', docNumbers);
  if (existingErr) throw new Error(`Error buscando existentes: ${existingErr.message}`);

  const existingDocs = new Set(existing.map(e => e.document_number));
  const newItems     = unique.filter(u => !existingDocs.has(u.candidate.document_number));
  const alreadyItems = unique.filter(u => existingDocs.has(u.candidate.document_number));

  console.log(`   ${existingDocs.size} ya existen en Supabase (se omiten)`);
  console.log(`   ${newItems.length} nuevos a insertar`);

  console.log('\n⬆️  Paso 2/4 — Insertando candidates...');
  const candidatePayloads = newItems.map(u => u.candidate);
  const candidateResult = await batchInsert('candidates', candidatePayloads);
  console.log(`   ✅ ${candidateResult.inserted} insertados`);
  if (candidateResult.errors.length) {
    candidateResult.errors.forEach(e =>
      console.log(`   ❌ Filas ${e.desde}-${e.hasta}: ${e.error}`)
    );
  }

  // Obtener IDs de todos (nuevos + existentes) para las siguientes tablas
  console.log('\n🔍 Paso 3/4 — Obteniendo IDs de candidatos...');
  const { data: allCandidates, error: fetchErr } = await supabase
    .from('candidates')
    .select('id, document_number')
    .in('document_number', docNumbers);
  if (fetchErr) throw new Error(`Error obteniendo IDs: ${fetchErr.message}`);

  const candidateIdMap = {};
  allCandidates.forEach(c => { candidateIdMap[c.document_number] = c.id; });
  console.log(`   ${Object.keys(candidateIdMap).length} IDs obtenidos`);

  // socio_demographic_data (solo para candidatos nuevos que tenemos ID)
  const socioPayloads = newItems
    .filter(u => candidateIdMap[u.candidate.document_number] && u.socioDemo.socioeconomic_stratum)
    .map(u => ({
      candidate_id:          candidateIdMap[u.candidate.document_number],
      socioeconomic_stratum: u.socioDemo.socioeconomic_stratum,
    }));

  if (socioPayloads.length) {
    const socioResult = await batchInsert('socio_demographic_data', socioPayloads);
    console.log(`   ✅ ${socioResult.inserted} registros socio-demográficos insertados`);
    if (socioResult.errors.length)
      socioResult.errors.forEach(e => console.log(`   ❌ Filas ${e.desde}-${e.hasta}: ${e.error}`));
  }

  // project_applications — inserta de a uno para aislar conflictos individuales
  // sin romper toda la migración si un registro ya existe.
  console.log('\n⬆️  Paso 4/4 — Insertando project_applications...');
  const appPayloads = unique
    .filter(u => candidateIdMap[u.candidate.document_number])
    .map(u => ({
      cohort_id:    COHORT_ID,
      candidate_id: candidateIdMap[u.candidate.document_number],
      current_step:   u.application.current_step,
      status:         u.application.status,
      notes:          u.application.notes,
      custom_answers: u.application.custom_answers,
    }));

  let appsInserted = 0;
  let appsSkipped  = 0;
  const appsErrors = [];

  for (const payload of appPayloads) {
    const { error } = await supabase
      .from('project_applications')
      .insert(payload);

    if (!error) {
      appsInserted++;
    } else if (error.code === '23505') {
      // Violación de unicidad — ya tiene application en este proyecto
      appsSkipped++;
    } else {
      appsErrors.push({ candidate_id: payload.candidate_id, error: error.message });
    }
  }

  console.log(`   ✅ ${appsInserted} applications insertadas`);
  if (appsSkipped)  console.log(`   ⏭  ${appsSkipped} ya tenían application en este proyecto (omitidas)`);
  if (appsErrors.length)
    appsErrors.forEach(e => console.log(`   ❌ ${e.candidate_id}: ${e.error}`));

  // ── REPORTE FINAL ────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════');
  console.log('📊 REPORTE FINAL');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Candidates insertados:         ${candidateResult.inserted}`);
  console.log(`⏭  Candidates ya existentes:      ${alreadyItems.length}`);
  console.log(`✅ Project applications creadas:  ${appsInserted}`);
  console.log(`⏭  Applications ya existían:      ${appsSkipped}`);
  console.log(`⚠️  Registros omitidos (Excel):   ${rawRows.length - unique.length}`);
  const totalErrors = candidateResult.errors.length + appsErrors.length;
  if (totalErrors > 0) console.log(`❌ Errores:                       ${totalErrors}`);
  console.log('\n🎉 Migración completada.');
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});

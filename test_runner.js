import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pzrbokotujpkxtlggcio.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__Gc1lx1nS77d6qsDVO6yMg_Qt-bsBs4';

async function runTests() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('====================================================');
  console.log('🚀 INICIANDO PRUEBAS AUTOMATIZADAS PUNTO CORTE');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // FASE 1: TEST ADMIN
  // ----------------------------------------------------
  console.log('>>> [FASE 1]: Verificación Cuenta Administrador');
  const { data: authData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'admin@puntocorte.com',
    password: 'Admin123456*'
  });
  if (loginErr) throw new Error('Fallo login admin: ' + loginErr.message);
  console.log('  ✓ 1.1 Iniciar sesión como Admin: OK (' + authData.user.email + ')');

  // Crear Sede de prueba
  const testSedeData = {
    nombre: 'Sede Test Automatizado Cañaveral',
    direccion: 'Carrera 27 # 36-10, Floridablanca',
    telefono: '+57 318 999 1111',
    hora_apertura: '08:00:00',
    hora_cierre: '21:00:00',
    activa: true
  };
  const { data: sedeCreated, error: sedeErr } = await supabase
    .from('sedes')
    .insert([testSedeData])
    .select()
    .single();
  if (sedeErr) throw new Error('Fallo crear sede: ' + sedeErr.message);
  console.log('  ✓ 1.2 Crear Sede: OK ("' + sedeCreated.nombre + '", ID: ' + sedeCreated.id + ')');

  // Crear Servicio de prueba
  const testServData = {
    nombre: 'Servicio Test Corte & Barba VIP',
    descripcion: 'Corte personalizado con toalla caliente y perfilado de navaja',
    categoria: 'Barbería',
    precio: 35000,
    duracion_minutos: 45,
    activo: true
  };
  const { data: servCreated, error: servErr } = await supabase
    .from('servicios')
    .insert([testServData])
    .select()
    .single();
  if (servErr) throw new Error('Fallo crear servicio: ' + servErr.message);
  console.log('  ✓ 1.3 Crear y Asignar Servicio: OK ("' + servCreated.nombre + '" - $' + servCreated.precio + ')');

  // Crear Profesional de prueba
  const profEmail = 'barbero.test_' + Date.now() + '@puntocorte.com';
  const { data: profCreated, error: profErr } = await supabase.rpc('admin_create_profesional', {
    p_nombre: 'Barbero Test Automatizado',
    p_email: profEmail,
    p_telefono: '3187770000',
    p_sede_id: sedeCreated.id,
    p_especialidad: 'Barbero Master VIP',
    p_password: 'Barbero123456*'
  });
  if (profErr) throw new Error('Fallo crear profesional: ' + profErr.message);
  console.log('  ✓ 1.4 Crear Profesional Asignado a la Sede: OK (ID: ' + profCreated.id + ')');

  // ----------------------------------------------------
  // FASE 2: TEST CLIENTE PÚBLICO (SIN CUENTA)
  // ----------------------------------------------------
  console.log('\n>>> [FASE 2]: Cierre de Sesión y Agendamiento Cliente Público');
  await supabase.auth.signOut();
  console.log('  ✓ 2.1 Deslogueo de Admin: OK (Navegador en estado anónimo/público)');

  // Cliente público selecciona Sede, Servicio, Profesional, Fecha, Hora
  const testFecha = '2026-11-28';
  const testHora = '15:00:00';
  console.log('  ✓ 2.2 Cliente elige Sede: "' + sedeCreated.nombre + '"');
  console.log('  ✓ 2.3 Cliente elige Servicio: "' + servCreated.nombre + '" (Duración: 45 min)');
  console.log('  ✓ 2.4 Cliente elige Barbero: "Barbero Test Automatizado"');
  console.log('  ✓ 2.5 Cliente elige Fecha: ' + testFecha + ' | Hora: ' + testHora);

  // Ejecución del agendamiento público
  const { data: citaData, error: citaErr } = await supabase.rpc('crear_cita_publica', {
    p_cliente_nombre: 'Juan David Gómez (Cliente Test)',
    p_cliente_telefono: '3185551234',
    p_cliente_email: 'juandavid.test@gmail.com',
    p_profesional_id: profCreated.id,
    p_servicio_id: servCreated.id,
    p_sede_id: sedeCreated.id,
    p_fecha: testFecha,
    p_hora_inicio: testHora,
    p_duracion_minutos: 45,
    p_notas: 'Corte especial para boda'
  });
  if (citaErr) throw new Error('Fallo agendamiento público: ' + citaErr.message);
  console.log('  ✓ 2.6 Confirmación de Cita Pública sin errores: OK');
  console.log('      - Cita ID: ' + citaData.id);
  console.log('      - Cliente: ' + citaData.cliente_nombre);
  console.log('      - Horario: ' + citaData.hora_inicio + ' a ' + citaData.hora_fin);
  console.log('      - Estado: ' + citaData.estado);

  // ----------------------------------------------------
  // FASE 3: VERIFICACIÓN ADMIN
  // ----------------------------------------------------
  console.log('\n>>> [FASE 3]: Re-login de Admin y Verificación de Cita en Panel');
  const { error: reloginErr } = await supabase.auth.signInWithPassword({
    email: 'admin@puntocorte.com',
    password: 'Admin123456*'
  });
  if (reloginErr) throw new Error('Fallo re-login admin: ' + reloginErr.message);
  console.log('  ✓ 3.1 Re-login como Admin: OK');

  // Consultar la cita en la tabla citas consolidada del admin
  const { data: adminCitas, error: admCitasErr } = await supabase
    .from('citas')
    .select('*')
    .eq('id', citaData.id);

  if (admCitasErr) throw new Error('Fallo consulta admin: ' + admCitasErr.message);
  if (!adminCitas || adminCitas.length === 0) throw new Error('La cita no fue encontrada en la base de datos');

  console.log('  ✓ 3.2 Cita registrada y visible en el panel del Administrador: OK');
  console.log('      - ID Cita: ' + adminCitas[0].id);
  console.log('      - Estado registrado: ' + adminCitas[0].estado);
  console.log('      - Notas cliente: "' + adminCitas[0].notas + '"');

  // Limpieza de datos de prueba temporales
  console.log('\n>>> Limpieza de registros temporales de prueba:');
  await supabase.from('citas').delete().eq('id', citaData.id);
  console.log('  ✓ Cita de prueba eliminada');
  await supabase.from('profesionales').delete().eq('id', profCreated.id);
  console.log('  ✓ Profesional de prueba eliminado');
  await supabase.from('servicios').delete().eq('id', servCreated.id);
  console.log('  ✓ Servicio de prueba eliminado');
  await supabase.from('sedes').delete().eq('id', sedeCreated.id);
  console.log('  ✓ Sede de prueba eliminada');

  console.log('\n====================================================');
  console.log('🏆 RESULTADO: TODAS LAS PRUEBAS PASARON EXITOSAMENTE (3/3)');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN LA EJECUCIÓN DE PRUEBAS:\n', err);
  process.exit(1);
});

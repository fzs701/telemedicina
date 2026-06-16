import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, checkmarkCircleOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const RecetasMedico: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId') || 'b147b1d6-76a6-40b8-9701-583220347841';
  const medicoNombre = localStorage.getItem('usuarioNombre') || 'Médico';

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/api/mensajes/medico/${medicoId}`)
      .then(res => res.json())
      .then(data => { if (data.ok) setPacientes(data.pacientes); })
      .catch(() => {});
  }, [medicoId]);

  const enviarReceta = async () => {
    if (!pacienteSeleccionado || !medicamentos.trim()) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/recetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: pacienteSeleccionado,
          medicoNombre,
          medicamentos,
          observaciones
        })
      });
      const data = await res.json();
      if (data.ok) {
        setEnviado(true);
        setMedicamentos('');
        setObservaciones('');
        setPacienteSeleccionado('');
        setTimeout(() => setEnviado(false), 3000);
      }
    } catch {}
    setCargando(false);
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f9f9f9' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />
            <IonCol size="9" style={{ padding: '40px', overflowY: 'auto' }}>

              <div onClick={() => history.push('/medico-dashboard')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Emitir Receta Médica</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Completa el formulario para enviar una receta al paciente</p>

              <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', maxWidth: '700px' }}>

                {/* Seleccionar paciente */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '14px' }}>
                    Paciente
                  </label>
                  <select
                    value={pacienteSeleccionado}
                    onChange={e => setPacienteSeleccionado(e.target.value)}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' }}
                  >
                    <option value=''>— Seleccionar paciente —</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.rut})</option>
                    ))}
                  </select>
                </div>

                {/* Medicamentos */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '14px' }}>
                    Medicamentos y dosis
                  </label>
                  <textarea
                    value={medicamentos}
                    onChange={e => setMedicamentos(e.target.value)}
                    placeholder="Ej: Enalapril 10mg - 1 comprimido cada 12 horas&#10;Aspirina 100mg - 1 comprimido al día con el desayuno"
                    rows={5}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Observaciones */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '14px' }}>
                    Indicaciones adicionales
                  </label>
                  <textarea
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Ej: Evitar consumo de sal. Reposo relativo. Control en 7 días."
                    rows={3}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Botón enviar */}
                {enviado ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00875E', fontWeight: 'bold', fontSize: '15px' }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '22px' }} />
                    Receta enviada con éxito
                  </div>
                ) : (
                  <button
                    onClick={enviarReceta}
                    disabled={cargando || !pacienteSeleccionado || !medicamentos.trim()}
                    style={{ padding: '14px 30px', backgroundColor: !pacienteSeleccionado || !medicamentos.trim() ? '#ccc' : '#00875E', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: !pacienteSeleccionado || !medicamentos.trim() ? 'not-allowed' : 'pointer' }}
                  >
                    {cargando ? 'Enviando...' : 'Enviar Receta'}
                  </button>
                )}
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RecetasMedico;
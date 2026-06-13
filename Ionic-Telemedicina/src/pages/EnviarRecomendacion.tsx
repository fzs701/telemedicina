import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, checkmarkCircleOutline, sendOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const EnviarRecomendacion: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId') || 'b147b1d6-76a6-40b8-9701-583220347841';

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [indicacion, setIndicacion] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Si viene desde FichaPaciente, preseleccionar paciente
  useEffect(() => {
    const guardado = localStorage.getItem('pacienteSeleccionado');
    if (guardado) {
      const p = JSON.parse(guardado);
      setPacienteSeleccionado(p.id);
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/mensajes/medico/${medicoId}`)
      .then(res => res.json())
      .then(data => { if (data.ok) setPacientes(data.pacientes); })
      .catch(() => {});
  }, [medicoId]);

  const enviar = async () => {
    if (!pacienteSeleccionado || !indicacion.trim()) return;
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/api/seguimiento/medico/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: pacienteSeleccionado, indicacion })
      });
      const data = await res.json();
      if (data.ok) {
        setEnviado(true);
        setIndicacion('');
        setPacienteSeleccionado('');
        localStorage.removeItem('pacienteSeleccionado');
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

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Enviar Recomendación</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>La indicación llegará directamente al paciente</p>

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

                {/* Indicación */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px', fontSize: '14px' }}>
                    Recomendación / Indicación
                  </label>
                  <textarea
                    value={indicacion}
                    onChange={e => setIndicacion(e.target.value)}
                    placeholder="Ej: Evitar consumo de sal estricto. Reposo relativo 24 horas. Monitorear presión cada 4 horas."
                    rows={6}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Botón */}
                {enviado ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00875E', fontWeight: 'bold', fontSize: '15px' }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '22px' }} />
                    Recomendación enviada con éxito
                  </div>
                ) : (
                  <button
                    onClick={enviar}
                    disabled={cargando || !pacienteSeleccionado || !indicacion.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 30px', backgroundColor: !pacienteSeleccionado || !indicacion.trim() ? '#ccc' : '#1976D2', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: !pacienteSeleccionado || !indicacion.trim() ? 'not-allowed' : 'pointer' }}
                  >
                    <IonIcon icon={sendOutline} />
                    {cargando ? 'Enviando...' : 'Enviar Recomendación'}
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

export default EnviarRecomendacion;
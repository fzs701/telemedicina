import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, pulseOutline, thermometerOutline, heartOutline, bodyOutline, alertCircleOutline, calendarOutline, personOutline, chatbubbleOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const FichaPaciente: React.FC = () => {
  const history = useHistory();
  const [registros, setRegistros] = useState<any[]>([]);
  const [ultimo, setUltimo] = useState<any>(null);
  const [infoPaciente, setInfoPaciente] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const paciente = JSON.parse(localStorage.getItem('pacienteSeleccionado') || '{}');

  useEffect(() => {
    if (!paciente.id) return;

    // Cargar registros clínicos
    fetch(`http://localhost:3000/api/registro-salud/${paciente.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setRegistros(data.historial || []);
          setUltimo(data.ultimo || null);
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false));

    // Cargar info completa del usuario 
    fetch(`http://localhost:3000/api/usuario/${paciente.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setInfoPaciente(data.usuario);
      })
      .catch(() => {});
  }, [paciente.id]);

  const colorEstado = (estado: string) => estado === 'Crítico' ? '#e53935' : '#43A047';
  const bgEstado = (estado: string) => estado === 'Crítico' ? '#ffebee' : '#e8f5e9';

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f9f9f9' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />
            <IonCol size="9" style={{ padding: '40px', overflowY: 'auto' }}>

              <div onClick={() => history.push('/buscar-pacientes')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver a Pacientes
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                Ficha: {paciente.nombre}
              </h2>

              {/* CABECERA CON INFO PERSONAL */}
              <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                
                {/* Avatar */}
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IonIcon icon={personOutline} style={{ fontSize: '30px', color: '#00875E' }} />
                </div>

                {/* Datos personales */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                  <p style={{ margin: 0 }}><strong>Nombre:</strong> {paciente.nombre}</p>
                  <p style={{ margin: 0 }}><strong>RUT:</strong> {paciente.rut}</p>
                  <p style={{ margin: 0 }}><strong>Correo:</strong> {infoPaciente?.correo || 'No registrado'}</p>
                  <p style={{ margin: 0 }}><strong>Región:</strong> {infoPaciente?.region || 'No registrada'}</p>
                  <p style={{ margin: 0 }}><strong>Comuna:</strong> {infoPaciente?.comuna || 'No registrada'}</p>
                  <p style={{ margin: 0 }}><strong>Último registro:</strong> {ultimo ? new Date(ultimo.fechaCreacion).toLocaleDateString('es-ES') : 'Sin registros'}</p>
                </div>

                {/* Badge estado */}
                <span style={{ padding: '8px 20px', borderRadius: '25px', fontWeight: 'bold', fontSize: '14px', color: colorEstado(paciente.estado), backgroundColor: bgEstado(paciente.estado), flexShrink: 0 }}>
                  {paciente.estado}
                </span>
              </div>

              {cargando ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Cargando ficha clínica...</p>
              ) : !ultimo ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Este paciente no tiene registros clínicos aún.</p>
              ) : (
                <>
                  {/* ALERTA CRÍTICO */}
                  {paciente.estado === 'Crítico' && (
                    <div style={{ backgroundColor: '#ffebee', border: '1px solid #e53935', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IonIcon icon={alertCircleOutline} style={{ color: '#e53935', fontSize: '22px' }} />
                      <p style={{ margin: 0, color: '#e53935', fontWeight: 'bold', fontSize: '14px' }}>
                        Estado Crítico: {ultimo.sintomas}
                      </p>
                    </div>
                  )}

                  {/* SIGNOS VITALES */}
                  <h3 style={{ fontWeight: 'bold', color: '#00875E', marginBottom: '15px' }}>Último Registro Clínico</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: '4px solid #1976D2' }}>
                      <IonIcon icon={heartOutline} style={{ fontSize: '28px', color: '#1976D2', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Presión Arterial</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{ultimo.presionArterial}</p>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: '4px solid #e53935' }}>
                      <IonIcon icon={pulseOutline} style={{ fontSize: '28px', color: '#e53935', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Pulso</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{ultimo.pulso} bpm</p>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: '4px solid #FFA000' }}>
                      <IonIcon icon={thermometerOutline} style={{ fontSize: '28px', color: '#FFA000', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Temperatura</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{ultimo.temperatura}°C</p>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: '4px solid #9C27B0' }}>
                      <IonIcon icon={bodyOutline} style={{ fontSize: '28px', color: '#9C27B0', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Nivel Dolor</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{ultimo.nivelDolor}/10</p>
                    </div>
                  </div>

                  {/* SÍNTOMAS Y OBSERVACIONES */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <IonIcon icon={alertCircleOutline} style={{ color: '#e53935', fontSize: '20px' }} />
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Síntomas</p>
                      </div>
                      <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.5' }}>{ultimo.sintomas}</p>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <IonIcon icon={calendarOutline} style={{ color: '#00875E', fontSize: '20px' }} />
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Observaciones</p>
                      </div>
                      <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.5' }}>{ultimo.observaciones || 'Sin observaciones.'}</p>
                      <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#aaa' }}>
                        {new Date(ultimo.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* HISTORIAL */}
                  {registros.length > 1 && (
                    <>
                      <h3 style={{ fontWeight: 'bold', color: '#555', marginBottom: '15px' }}>Historial Histórico</h3>
                      {registros.slice(1).map((r) => (
                        <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '15px 20px', marginBottom: '10px', boxShadow: '0 1px 5px rgba(0,0,0,0.04)', borderLeft: `4px solid ${colorEstado(r.estado)}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#333' }}>{r.sintomas}</p>
                              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#aaa' }}>
                                {new Date(r.fechaCreacion).toLocaleDateString('es-ES')} — Pulso: {r.pulso} bpm · Temp: {r.temperatura}°C · Dolor: {r.nivelDolor}/10
                              </p>
                            </div>
                            <IonBadge color={r.estado === 'Crítico' ? 'danger' : 'success'}>{r.estado}</IonBadge>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* BOTONES */}
                  <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                     <button onClick={() => { localStorage.setItem('pacienteSeleccionado', JSON.stringify(paciente));
                           history.push('/chat-medico');
                         }}
                        style={{ flex: 1, padding: '14px', backgroundColor: '#00875E', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                             <IonIcon icon={chatbubbleOutline} /> Iniciar Chat
                       </button>
                      <button onClick={() => { localStorage.setItem('pacienteSeleccionado', JSON.stringify(paciente)); history.push('/enviar-recomendacion'); }}
                           style={{ flex: 1, padding: '14px', backgroundColor: '#1976D2', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                             <IonIcon icon={alertCircleOutline} /> Enviar Recomendación
                         </button>
                      </div>
                </>
              )}

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FichaPaciente;
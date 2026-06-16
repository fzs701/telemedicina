import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, statsChartOutline, notificationsOutline, videocamOutline, heartOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const ResumenGeneral: React.FC = () => {
  const history = useHistory();

  // Estados para recuperar la información guardada del paciente
  const [estado, setEstado] = useState('No registrado');
  const [sintomas, setSintomas] = useState('Sin síntomas registrados');
  const [dolor, setDolor] = useState('No registrado');
  const [historialSeguimiento, setHistorialSeguimiento] = useState<any[]>([]);
  const [proximaCita, setProximaCita] = useState('Sin citas próximas');
  const [medicoNombre, setMedicoNombre] = useState('Sin registrar');
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    const est = localStorage.getItem('clinicoEstado');
    const sin = localStorage.getItem('clinicoSintomas');
    const dol = localStorage.getItem('clinicoDolor');
    if (est) setEstado(est);
    if (sin) setSintomas(sin);
    if (dol) setDolor(dol);

    // Agregar fetch de citas futuras
    const user = localStorage.getItem('usuario');
    if (user) {
      const parsedUser = JSON.parse(user);
    
      fetch(`${API_URL}/api/citas/usuario/${parsedUser.id}`)
        .then(res => res.json())
        .then(data => {
        if (data.ok && data.citas) {
          const hoy = new Date();
          const futuras = data.citas.filter((c: any) => {
            const fechaCita = new Date(`${c.fecha}T${c.hora}`);
            return fechaCita >= hoy;
          });
          if (futuras.length > 0) {
            setProximaCita(`${futuras[0].fecha} — ${futuras[0].hora}`);
            setMedicoNombre(futuras[0].medico_nombre || 'Dra. Alejandra Silva');
          } else {
            setProximaCita('Sin citas próximas');
            setMedicoNombre(futuras[0].medico_nombre || 'Sin registrar');
          }
        }
      })
      .catch(() => {});

     const idUsuario = parsedUser.id || localStorage.getItem('usuarioId');const historialLocal = localStorage.getItem(`historial_seguimiento_${idUsuario}`) 
     || localStorage.getItem('historial_seguimiento_global');
    if (historialLocal) setHistorialSeguimiento(JSON.parse(historialLocal));}
  }, []);
  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', height: '100vh' }}>
            <MenuNavegacion />
            
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              
              {/* Botón Volver */}
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '25px' }}>Panel de Resumen General</h2>

              <IonGrid style={{ padding: 0 }}>
                <IonRow>
                  
                  {/* estado salud */}
                  <IonCol size="12" style={{ marginBottom: '15px' }}>
                    <IonCard style={{ margin: 0, borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', borderLeft: '6px solid #ffce00' }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <IonIcon icon={statsChartOutline} style={{ fontSize: '22px', color: '#ffce00' }} />
                          <h3 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '16px' }}>Estado de Salud Reciente</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                          <p style={{ margin: 0 }}><strong>Estado:</strong> <span style={{ color: estado === 'Crítico' ? 'red' : 'green', fontWeight: 'bold' }}>{estado}</span></p>
                          <p style={{ margin: 0 }}><strong>Dolor:</strong> {dolor}</p>
                          <p style={{ margin: 0, gridColumn: 'span 2' }}><strong>Últimos Síntomas:</strong> {sintomas}</p>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  {/* resumen indicaciones */}
                  <IonCol size="6" style={{ paddingRight: '10px' }}>
                    <IonCard style={{ margin: 0, borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                          <IonIcon icon={notificationsOutline} style={{ fontSize: '22px', color: '#00875E' }} />
                          <h3 style={{ margin: 0, fontWeight: 'bold', color: '#00875E', fontSize: '16px' }}>Cumplimiento de Indicaciones</h3>
                        </div>
                        
                        {historialSeguimiento.length === 0 ? (
                          <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px' }}>No registras respuestas de tratamiento hoy.</p>) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{(() => {
                            const ultimo = historialSeguimiento[historialSeguimiento.length - 1];
                            return (
                            <div style={{ backgroundColor: '#f4f5f8', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${ultimo.cumplio === 'SI' ? '#10dc60' : '#f04141'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>Tratamiento Diario</span>
                                <span style={{ 
                                  fontWeight: 'bold', fontSize: '12px', padding: '3px 8px', borderRadius: '10px',
                                  backgroundColor: ultimo.cumplio === 'SI' ? '#e6f9ed' : '#fdeded',
                                  color: ultimo.cumplio === 'SI' ? '#10dc60' : '#f04141'
                                }}>
                                {ultimo.cumplio === 'SI' ? 'CUMPLIÓ' : 'NO CUMPLIÓ'}
                                </span>
                              </div>
                              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888' }}>
                                  📅 {new Date(ultimo.fechaRegistro).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(ultimo.fechaRegistro).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                              {ultimo.indicacion && ultimo.indicacion.includes('Comentario:') && (
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#555', fontStyle: 'italic' }}>
                                  💬 {ultimo.indicacion.split('Comentario:')[1]?.replace(')', '').trim()}
                                </p>
                              )}
                             </div>
                            );
                          })()}
                        </div>
                      )}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  {/* resumen videollamdas */}
                  {/* TARJETA 3: CITAS - solo mostrar si hay cita futura */}
                  <IonCol size="6" style={{ paddingLeft: '10px' }}>
                    <IonCard style={{ margin: 0, borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                          <IonIcon icon={videocamOutline} style={{ fontSize: '22px', color: '#00875E' }} />
                          <h3 style={{ margin: 0, fontWeight: 'bold', color: '#00875E', fontSize: '16px' }}>Citas Médicas Virtuales</h3>
                        </div>
                        {proximaCita === 'Sin citas próximas' ? (
                          <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px' }}>No tienes citas próximas agendadas.</p>
                        ) : (
                        <div style={{ borderLeft: '3px solid #10dc60', paddingLeft: '10px' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>Próxima Teleconsulta</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Fecha: {proximaCita}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Médico: {medicoNombre}</p>
                        </div>
                        )}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                </IonRow>
              </IonGrid>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ResumenGeneral;
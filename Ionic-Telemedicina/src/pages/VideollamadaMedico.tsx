import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, videocamOutline, callOutline, micOffOutline, videocamOffOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const VideollamadaMedico: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId') || 'b147b1d6-76a6-40b8-9701-583220347841';
  const [citas, setCitas] = useState<any[]>([]);
  const [citaActiva, setCitaActiva] = useState<any>(null);
  const [enLlamada, setEnLlamada] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
  
fetch(`${API_URL}/api/citas/medico/${medicoId}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        const hoy = new Date();
        const futuras = (data.citas || []).filter((c: any) => {
          const fechaCita = new Date(`${c.fecha}T${c.hora}`);
          return fechaCita >= hoy;
        });
        setCitas(futuras);
      }
    })
    .catch(() => {});
}, [medicoId]);

  const iniciarLlamada = (cita: any) => {
    setCitaActiva(cita);
    setEnLlamada(true);
  };

  const colgarLlamada = () => {
    setEnLlamada(false);
    setCitaActiva(null);
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />
            <IonCol size="9" style={{ display: 'flex', padding: 0, height: '100vh' }}>

              {/* CITAS */}
              <div style={{ width: '280px', borderRight: '1px solid #eee', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <div onClick={() => history.push('/medico-dashboard')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '10px', fontSize: '13px' }}>
                    <IonIcon icon={arrowBackOutline} /> Volver al Inicio
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Videollamadas</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>Citas programadas</p>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {citas.length === 0 ? (
                    <p style={{ padding: '20px', color: '#aaa', fontSize: '13px', fontStyle: 'italic' }}>Sin citas programadas.</p>
                  ) : (
                    citas.map((c: any, i: number) => (
                      <div key={i} onClick={() => setCitaActiva(c)}
                        style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', backgroundColor: citaActiva?.id === c.id ? '#f0faf5' : 'white', borderLeft: citaActiva?.id === c.id ? '3px solid #00875E' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#00875E', flexShrink: 0, fontSize: '16px' }}>
                            {(c.paciente_nombre || 'P').charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{c.paciente_nombre || 'Paciente'}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#00875E', fontWeight: '600' }}>{c.fecha} — {c.hora}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#aaa' }}>{c.estado}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ÁREA VIDEOLLAMADA */}
              {!citaActiva ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px', color: '#aaa' }}>
                  <IonIcon icon={videocamOutline} style={{ fontSize: '60px', color: '#ddd' }} />
                  <p style={{ fontSize: '16px' }}>Selecciona una cita para iniciar</p>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                  {/* Cabecera */}
                  <div style={{ backgroundColor: '#00875E', padding: '15px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                        {(citaActiva.paciente_nombre || 'P').charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '15px' }}>
                          Videollamada: {citaActiva.paciente_nombre || 'Paciente'}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                          {citaActiva.fecha} a las {citaActiva.hora}
                        </p>
                      </div>
                    </div>
                    <span style={{ backgroundColor: enLlamada ? '#e8f5e9' : '#fff3e0', color: enLlamada ? '#00875E' : '#FFA000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      {enLlamada ? '● En llamada' : 'Programada'}
                    </span>
                  </div>

                  {/* Área de video */}
                  <div style={{ flex: 1, backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    
                    {!enLlamada ? (
                      <div style={{ textAlign: 'center', color: 'white' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#00875E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '36px', fontWeight: 'bold' }}>
                          {(citaActiva.paciente_nombre || 'P').charAt(0)}
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{citaActiva.paciente_nombre}</p>
                        <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 30px 0' }}>Cita: {citaActiva.fecha} a las {citaActiva.hora}</p>
                        <button
                          onClick={() => iniciarLlamada(citaActiva)}
                          style={{ backgroundColor: '#00875E', color: 'white', border: 'none', borderRadius: '50px', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
                          <IonIcon icon={videocamOutline} /> Iniciar Videollamada
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Video principal - paciente */}
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#2d2d44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ textAlign: 'center', color: 'white' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#00875E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '44px', fontWeight: 'bold' }}>
                              {(citaActiva.paciente_nombre || 'P').charAt(0)}
                            </div>
                            <p style={{ fontSize: '18px', margin: 0 }}>{citaActiva.paciente_nombre}</p>
                          </div>
                        </div>

                        {/* Mini video  */}
                        <div style={{ position: 'absolute', bottom: '90px', right: '20px', width: '150px', height: '100px', backgroundColor: '#444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00875E' }}>
                          <div style={{ textAlign: 'center', color: 'white', fontSize: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#666', margin: '0 auto 5px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              👩‍⚕️
                            </div>
                            Tú
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Controles */}
                  {enLlamada && (
                    <div style={{ backgroundColor: '#111', padding: '20px', display: 'flex', justifyContent: 'center', gap: '30px', alignItems: 'center' }}>
                      <button style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#e53935', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={micOffOutline} style={{ color: 'white', fontSize: '22px' }} />
                      </button>
                      <button style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#e53935', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={videocamOffOutline} style={{ color: 'white', fontSize: '22px' }} />
                      </button>
                      <button onClick={colgarLlamada} style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#e53935', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={callOutline} style={{ color: 'white', fontSize: '28px', transform: 'rotate(135deg)' }} />
                      </button>
                    </div>
                  )}
                </div>
              )}

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default VideollamadaMedico;
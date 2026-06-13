import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, videocamOutline, callOutline, micOffOutline, videocamOffOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const VideollamadaPaciente: React.FC = () => {
  const history = useHistory();
  const usuarioId = localStorage.getItem('usuarioId');
  const [citas, setCitas] = useState<any[]>([]);
  const [citaActiva, setCitaActiva] = useState<any>(null);
  const [enLlamada, setEnLlamada] = useState(false);

  useEffect(() => {
    if (!usuarioId) return;
    fetch(`http://localhost:3000/api/citas/usuario/${usuarioId}`)
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
  }, [usuarioId]);

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
            <MenuNavegacion />
            <IonCol size="9" style={{ display: 'flex', padding: 0, height: '100vh' }}>

              {/* LISTA CITAS */}
              <div style={{ width: '280px', borderRight: '1px solid #eee', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <div onClick={() => history.push('/home')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '10px', fontSize: '13px' }}>
                    <IonIcon icon={arrowBackOutline} /> Volver al Inicio
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Mis Citas</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>Videollamadas programadas</p>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {citas.length === 0 ? (
                    <p style={{ padding: '20px', color: '#aaa', fontSize: '13px', fontStyle: 'italic' }}>Sin citas programadas.</p>
                  ) : (
                    citas.map((c: any, i: number) => (
                      <div key={i} onClick={() => setCitaActiva(c)}
                        style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', backgroundColor: citaActiva?.id === c.id ? '#f0faf5' : 'white', borderLeft: citaActiva?.id === c.id ? '3px solid #00875E' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#00875E', flexShrink: 0 }}>
                            👩‍⚕️
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{c.medico_nombre || 'Dra. Especialista'}</p>
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
                  <p style={{ fontSize: '16px' }}>Selecciona una cita para unirte</p>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ backgroundColor: '#00875E', padding: '15px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
                        👩‍⚕️
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '15px' }}>
                          {citaActiva.medico_nombre || 'Dra. Especialista'}
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

                  <div style={{ flex: 1, backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!enLlamada ? (
                      <div style={{ textAlign: 'center', color: 'white' }}>
                        <div style={{ fontSize: '60px', marginBottom: '15px' }}>👩‍⚕️</div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{citaActiva.medico_nombre || 'Dra. Especialista'}</p>
                        <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 30px 0' }}>Cita: {citaActiva.fecha} a las {citaActiva.hora}</p>
                        <button onClick={() => setEnLlamada(true)}
                          style={{ backgroundColor: '#00875E', color: 'white', border: 'none', borderRadius: '50px', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
                          <IonIcon icon={videocamOutline} /> Unirse a la llamada
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#2d2d44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ textAlign: 'center', color: 'white' }}>
                            <div style={{ fontSize: '80px', marginBottom: '15px' }}>👩‍⚕️</div>
                            <p style={{ fontSize: '18px', margin: 0 }}>{citaActiva.medico_nombre || 'Dra. Especialista'}</p>
                          </div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '90px', right: '20px', width: '150px', height: '100px', backgroundColor: '#444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00875E' }}>
                          <div style={{ textAlign: 'center', color: 'white', fontSize: '12px' }}>
                            <div style={{ fontSize: '30px', marginBottom: '5px' }}>🙋</div>
                            Tú
                          </div>
                        </div>
                      </>
                    )}
                  </div>

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

export default VideollamadaPaciente;
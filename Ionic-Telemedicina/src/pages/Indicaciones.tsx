import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, medicalOutline, calendarOutline, personOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const Indicaciones: React.FC = () => {
  const history = useHistory();
  const [seguimientos, setSeguimientos] = useState<any[]>([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.id) return;
    fetch(`http://localhost:3000/api/seguimiento/usuario/${usuario.id}`)
      .then(res => res.json())
      .then(data => { if (data.ok) setSeguimientos(data.historial || []); })
      .catch(() => {});
  }, []);

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f9f9f9' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <MenuNavegacion />
            <IonCol size="9" style={{ padding: '40px', overflowY: 'auto' }}>

              <div onClick={() => history.push('/home')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Mis Indicaciones Médicas</h2>

              {seguimientos.length === 0 ? (
                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <IonIcon icon={medicalOutline} style={{ fontSize: '60px', color: '#ccc', marginBottom: '15px' }} />
                  <h4 style={{ color: '#666', margin: 0 }}>No tienes indicaciones registradas aún.</h4>
                  <p style={{ color: '#999', fontSize: '13px', marginTop: '5px' }}>Tu médico enviará indicaciones desde su panel.</p>
                </div>
              ) : (
                seguimientos.map((s, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 25px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #00875E' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={medicalOutline} style={{ color: '#00875E', fontSize: '20px' }} />
                        <strong style={{ color: '#333', fontSize: '15px' }}>Indicación médica</strong>
                      </div>
                      <span style={{ fontSize: '12px', color: '#aaa' }}>
                        {new Date(s.fechaRegistro).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.6' }}>{s.indicacion}</p>
                  </div>
                ))
              )}

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Indicaciones;
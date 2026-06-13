import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, timeOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const Horarios: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', height: '100vh' }}>
            <MenuNavegacion />
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Horarios de Atención Médica</h2>

              <IonCard style={{ padding: '25px', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #00875E', paddingBottom: '10px', marginBottom: '15px' }}>
                  <IonIcon icon={timeOutline} style={{ fontSize: '24px', color: '#00875E' }} />
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#00875E' }}>Disponibilidad del Centro Santo Domingo</h3>
                </div>
                
                <p style={{ fontSize: '14px', color: '#444' }}>A continuación, puedes revisar los bloques disponibles para agendamiento de teleconsultas:</p>
                
                <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#00875E', color: 'white', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>Días</th>
                      <th style={{ padding: '10px' }}>Horario de Consultas</th>
                      <th style={{ padding: '10px' }}>Atención Remota Urgencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Lunes a Viernes</td>
                      <td style={{ padding: '12px' }}>08:00 hrs - 18:30 hrs</td>
                      <td style={{ padding: '12px', color: '#10dc60', fontWeight: 'bold' }}>Disponible</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Sábados</td>
                      <td style={{ padding: '12px' }}>09:00 hrs - 13:00 hrs</td>
                      <td style={{ padding: '12px', color: '#10dc60', fontWeight: 'bold' }}>Disponible</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', fontWeight: '500' }}>Domingos y Festivos</td>
                      <td style={{ padding: '12px', color: '#999' }}>Cerrado</td>
                      <td style={{ padding: '12px', color: '#f04141', fontWeight: 'bold' }}>Solo Guardia Crítica</td>
                    </tr>
                  </tbody>
                </table>
              </IonCard>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Horarios;
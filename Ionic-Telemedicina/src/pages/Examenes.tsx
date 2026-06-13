import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, documentTextOutline, calendarOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import API from '../api';

const Examenes: React.FC = () => {
  const history = useHistory();
  const [examenes, setExamenes] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuarioId(JSON.parse(user).id);
  }, []);

  useEffect(() => {
    if (usuarioId) {
      API.get(`/examenes/usuario/${usuarioId}`)
        .then(res => { if (res.data.ok) setExamenes(res.data.examenes); })
        .catch(err => console.error(err));
    }
  }, [usuarioId]);

  return (
    <IonPage>
      <BarraVerde />
      <IonContent>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', height: '100vh' }}>
            <MenuNavegacion />
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>
              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Mis Resultados de Exámenes</h2>

              {examenes.length === 0 ? (
                <IonCard style={{ padding: '30px', textAlign: 'center', borderRadius: '15px' }}>
                  <IonIcon icon={documentTextOutline} style={{ fontSize: '60px', color: '#ccc' }} />
                  <h4 style={{ color: '#666' }}>No tienes exámenes cargados en el sistema.</h4>
                </IonCard>
              ) : (
                examenes.map((ex) => (
                  <IonCard key={ex.id} style={{ borderRadius: '12px', marginBottom: '20px' }}>
                    <IonCardHeader style={{ borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IonCardTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>{ex.tipoExamen}</IonCardTitle>
                        <span style={{ fontSize: '12px', color: '#666' }}><IonIcon icon={calendarOutline} /> {new Date(ex.fechaCreacion).toLocaleDateString()}</span>
                      </div>
                      <IonCardSubtitle><IonIcon icon={personOutline} /> Subido por: {ex.medicoNombre}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent style={{ paddingTop: '15px' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}><IonIcon icon={shieldCheckmarkOutline} color="success" /><strong>Resultado clínico:</strong></div>
                      <p style={{ padding: '12px', backgroundColor: '#f4f5f8', borderRadius: '6px', color: '#333' }}>{ex.resultado}</p>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Examenes;
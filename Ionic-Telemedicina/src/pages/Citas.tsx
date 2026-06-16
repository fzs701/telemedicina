import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, timeOutline, personOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const Citas: React.FC = () => {
  const history = useHistory();
  const [citas, setCitas] = useState<any[]>([]);
  const usuarioId = localStorage.getItem('usuarioId');
  const [citasPacientes, setCitasPacientes] = useState<any[]>([]); 
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  
  const rol = localStorage.getItem('usuarioRol'); // "medico" o "paciente"

  useEffect(() => {
    if (usuarioId) {
      // Cargar citas personales 
      fetch(`${API_URL}/api/citas/usuario/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok || Array.isArray(data)) {
            setCitas(data.citas || data);
          }
        })
        .catch(err => console.error("Error al traer citas personales:", err));

      // Buscamos qué pacientes agendaron con SU id médico
      if (rol === 'medico') {
        fetch(`${API_URL}/api/citas/usuario/${usuarioId}`)
          .then(res => res.json())
          .then(data => {
            if (data.ok && data.citas && data.citas.length > 0) {
              setCitasPacientes(data.citas);
            } else {
              console.log("No hay citas en MySQL. Cargando datos simulados para la demo...");
              setCitasPacientes([
                {
                  id: 'm1',
                  usuarioId: 'Marta Pérez (RUT: 12.345.678-9)',
                  fecha: '2026-06-18',
                  hora: '02:00',
                  estado: 'programada'
                },
                {
                  id: 'm2',
                  usuarioId: 'Pedro Flores (RUT: 44.444.444-4)',
                  fecha: '2026-06-27',
                  hora: '05:36',
                  estado: 'programada'
                }
              ]);
            }
          })
          .catch(err => {
            console.error("Error en servidor, usando respaldo local:", err);
            setCitasPacientes([
              { id: 'm1', usuarioId: 'Marta Pérez', fecha: '2026-06-18', hora: '02:00', estado: 'programada' },
              { id: 'm2', usuarioId: 'Pedro Flores', fecha: '2026-06-27', hora: '05:36', estado: 'programada' }
            ]);
          });
      }
    }
  }, [usuarioId, rol]);

  // Separamos las citas dinámicamente según su fecha o estado
  const hoy = new Date().toISOString().split('T')[0];
  const citasFuturas = citas.filter(c => c.fecha >= hoy && c.estado !== 'realizada');
  const citasPasadas = citas.filter(c => c.fecha < hoy || c.estado === 'realizada');

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <MenuNavegacion />
            
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '25px' }}>Mis Citas Médicas</h2>

              {citas.length === 0 ? (
                /* CASO SIN CITAS */
                <IonCard style={{ padding: '40px', textAlign: 'center', borderRadius: '15px' }}>
                  <IonIcon icon={calendarOutline} style={{ fontSize: '50px', color: '#ccc', marginBottom: '10px' }} />
                  <h4 style={{ color: '#777', margin: 0, fontWeight: '500' }}>No tienes citas registradas en el sistema.</h4>
                </IonCard>
              ) : (
                /* CASO CON CITAS */
                <div>
                  {/* Sección Próximas Citas */}
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#00875E', marginBottom: '15px' }}>Próximas Atenciones</h3>
                  {citasFuturas.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#888', marginLeft: '10px' }}>No hay teleconsultas pendientes agendadas.</p>
                  ) : (
                    citasFuturas.map((cita) => (
                      <IonCard key={cita.id} style={{ padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', borderLeft: '5px solid #00875E' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>
                              <IonIcon icon={personOutline} style={{ marginRight: '5px' }} /> {cita.medico_nombre || cita.medico?.nombre || 'Especialista'}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                              <IonIcon icon={calendarOutline} style={{ marginRight: '5px' }} /> {cita.fecha}
                              <IonIcon icon={timeOutline} style={{ marginLeft: '15px', marginRight: '5px' }} /> {cita.hora} hrs
                            </p>
                          </div>
                          <IonBadge color="success">Programada</IonBadge>
                        </div>
                      </IonCard>
                    ))
                  )}

                  {/* Sección Historial */}
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#555', marginTop: '30px', marginBottom: '15px' }}>Historial de Citas Pasadas</h3>
                  {citasPasadas.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#888', marginLeft: '10px' }}>No registras consultas previas cerradas.</p>
                  ) : (
                    citasPasadas.map((cita) => (
                      <IonCard key={cita.id} style={{ padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', borderLeft: '5px solid #999', backgroundColor: '#fdfdfd' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                              {cita.medico_nombre || cita.medico?.nombre || 'Especialista'}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#888' }}>
                              {cita.fecha} a las {cita.hora} hrs
                            </p>
                          </div>
                          <IonBadge color="medium">Finalizada</IonBadge>
                        </div>
                      </IonCard>
                    ))
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

export default Citas;
import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, timeOutline, personOutline, medicalOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const CitasMedico: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId');

  const [citasPacientes, setCitasPacientes] = useState<any[]>([]);
  const [citasPropias, setCitasPropias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  // HOY se declara ANTES de los filtros
  const hoy = new Date().toISOString().split('T')[0];

  // Fetch 1: Citas donde la doctora ES el médico asignado (pacientes que la agendaron)
  useEffect(() => {
    if (!medicoId) return;
    fetch(`${API_URL}/api/citas/medico/${medicoId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.citas) setCitasPacientes(data.citas);
        else setCitasPacientes([]);
      })
      .catch(() => setCitasPacientes([]))
      .finally(() => setCargando(false));
  }, [medicoId]);

  // Fetch 2: Citas propias de la doctora (cuando ella misma agendó con alguien)
  useEffect(() => {
    if (!medicoId) return;
    fetch(`${API_URL}/api/citas/usuario/${medicoId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.citas) setCitasPropias(data.citas);
        else setCitasPropias([]);
      })
      .catch(err => {
      setCitasPropias([]);
    });
  }, [medicoId]);

  // Filtros — se calculan DESPUÉS de declarar hoy
  const citasFuturas = citasPacientes.filter(c => String(c.fecha).substring(0, 10) >= hoy && c.estado !== 'realizada');
const citasPasadas = citasPacientes.filter(c => String(c.fecha).substring(0, 10) < hoy || c.estado === 'realizada');
  const citasPropiasFuturas = citasPropias.filter(c => String(c.fecha).substring(0, 10) >= hoy && c.estado !== 'realizada');
const citasPropiasPasadas = citasPropias.filter(c => String(c.fecha).substring(0, 10) < hoy || c.estado === 'realizada');

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />

            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>

              <div onClick={() => history.push('/medico-dashboard')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '25px' }}>Gestión de Agenda Médica</h2>

              {/* SECCIÓN 1: Citas de pacientes que agendaron con la doctora */}
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#00875E', marginBottom: '15px' }}>
                Citas de Pacientes (Consultas por Atender)
              </h3>

              {cargando ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>Cargando agenda...</p>
              ) : citasFuturas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginLeft: '10px' }}>No hay pacientes agendados próximamente.</p>
              ) : (
                citasFuturas.map((cita) => (
                  <IonCard key={cita.id} style={{ padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', borderLeft: '5px solid #00875E' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>
                          <IonIcon icon={medicalOutline} style={{ marginRight: '5px' }} />
                          {cita.paciente_nombre || 'Paciente'}
                          <span style={{ fontWeight: 'normal', color: '#888', fontSize: '13px', marginLeft: '8px' }}>
                            ({cita.paciente_rut || ''})
                          </span>
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

              {/* SECCIÓN 2: Citas personales de la doctora */}
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976D2', marginTop: '30px', marginBottom: '15px' }}>
                Mis Citas Personales
              </h3>

              {citasPropiasFuturas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginLeft: '10px' }}>No tienes citas personales agendadas.</p>
              ) : (
                citasPropiasFuturas.map((cita) => (
                  <IonCard key={cita.id} style={{ padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', borderLeft: '5px solid #1976D2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>
                          <IonIcon icon={personOutline} style={{ marginRight: '5px' }} />
                          {cita.medico_nombre || 'Especialista'}
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                          <IonIcon icon={calendarOutline} style={{ marginRight: '5px' }} /> {cita.fecha}
                          <IonIcon icon={timeOutline} style={{ marginLeft: '15px', marginRight: '5px' }} /> {cita.hora} hrs
                        </p>
                      </div>
                      <IonBadge color="primary">Personal</IonBadge>
                    </div>
                  </IonCard>
                ))
              )}

              {/* SECCIÓN 3: Historial pasado de pacientes */}
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#555', marginTop: '30px', marginBottom: '15px' }}>
                Historial de Citas Pasadas
              </h3>

              {citasPasadas.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888', marginLeft: '10px' }}>No hay consultas previas registradas.</p>
              ) : (
                citasPasadas.map((cita) => (
                  <IonCard key={cita.id} style={{ padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', borderLeft: '5px solid #999', backgroundColor: '#fdfdfd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                          {cita.paciente_nombre || 'Paciente'}
                          <span style={{ fontWeight: 'normal', color: '#999', fontSize: '12px', marginLeft: '8px' }}>
                            ({cita.paciente_rut || ''})
                          </span>
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

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CitasMedico;
import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const ResumenPacientes: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId');
  const [pacientes, setPacientes] = useState<any[]>([]);

  useEffect(() => {
    if (!medicoId) return;
    fetch(`http://localhost:3000/api/medico/${medicoId}/dashboard`)
      .then(res => res.json())
      .then(data => { if (data.ok) setPacientes(data.pacientes); });
  }, [medicoId]);

  const colorEstado = (estado: string) => {
    if (estado === 'Crítico') return '#e53935';
    if (estado === 'Moderado') return '#FFA000';
    return '#43A047';
  };

  const bgEstado = (estado: string) => {
    if (estado === 'Crítico') return '#ffebee';
    if (estado === 'Moderado') return '#fff8e1';
    return '#e8f5e9';
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

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Pacientes</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>
                {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} asignado{pacientes.length !== 1 ? 's' : ''}
              </p>

              {pacientes.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No tienes pacientes asignados.</p>
              ) : (
                pacientes.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      localStorage.setItem('pacienteSeleccionado', JSON.stringify(p));
                      history.push('/ficha-paciente');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '15px',
                      backgroundColor: 'white', border: '1px solid #eee',
                      borderRadius: '12px', padding: '18px 20px', marginBottom: '12px',
                      cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Círculo color estado */}
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      backgroundColor: colorEstado(p.estado), flexShrink: 0
                    }} />

                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{p.nombre}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>{p.rut}</p>
                    </div>

                    <span style={{
                      fontSize: '12px', fontWeight: 'bold', padding: '4px 14px',
                      borderRadius: '20px', color: colorEstado(p.estado),
                      backgroundColor: bgEstado(p.estado)
                    }}>
                      {p.estado}
                    </span>
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

export default ResumenPacientes;
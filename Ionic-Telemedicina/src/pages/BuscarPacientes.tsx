import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const BuscarPacientes: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    if (!medicoId) return;
    fetch(`${API_URL}/api/medico/${medicoId}/dashboard`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPacientes(data.pacientes);
      });
  }, [medicoId]);

  const filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.rut.includes(busqueda)
  );

  const colorEstado = (estado: string) => {
    if (estado === 'Crítico') return '#e53935';
    if (estado === 'Moderado') return '#FFA000';
    return '#43A047';
  };

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

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '25px' }}>Pacientes Asignados</h2>

              {/* uscador */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '10px', padding: '8px 15px', marginBottom: '25px' }}>
                <IonIcon icon={searchOutline} style={{ color: '#aaa', fontSize: '18px' }} />
                <IonInput
                  placeholder="Buscar paciente por RUT o nombre..."
                  value={busqueda}
                  onIonInput={e => setBusqueda(e.detail.value!)}
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* lista pacientes */}
              {filtrados.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No se encontraron pacientes.</p>
              ) : (
                filtrados.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSeleccionado(p);
                      localStorage.setItem('pacienteSeleccionado', JSON.stringify(p));
                      history.push('/ficha-paciente');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '15px',
                      backgroundColor: seleccionado?.id === p.id ? '#f0faf5' : 'white',
                      border: seleccionado?.id === p.id ? '2px solid #00875E' : '1px solid #eee',
                      borderRadius: '12px', padding: '15px 20px', marginBottom: '12px',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {/* Círculo de color estado */}
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      backgroundColor: colorEstado(p.estado), flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{p.nombre}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>{p.rut}</p>
                    </div>
                    <span style={{
                      fontSize: '12px', fontWeight: 'bold', padding: '4px 12px',
                      borderRadius: '20px', color: colorEstado(p.estado),
                      backgroundColor: p.estado === 'Crítico' ? '#ffebee' : p.estado === 'Moderado' ? '#fff8e1' : '#e8f5e9'
                    }}>{p.estado}</span>
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

export default BuscarPacientes;
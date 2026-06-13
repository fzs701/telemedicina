import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, medicalOutline, documentTextOutline, calendarOutline, personOutline, pulseOutline, trashOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import Nav from '../components/Nav';
import API from '../api';

const RecetasMedicas: React.FC = () => {
  const history = useHistory();
  const [recetas, setRecetas] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const rol = localStorage.getItem('usuarioRol');

  // Para vista médico — crear receta
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const medicoNombre = localStorage.getItem('usuarioNombre') || 'Médico';

  useEffect(() => {
    const id = localStorage.getItem('usuarioId');
    setUsuarioId(id);

    // Si es médico, cargar sus pacientes para el selector
    if (rol === 'medico' && id) {
      fetch(`http://localhost:3000/api/medico/${id}/dashboard`)
        .then(res => res.json())
        .then(data => { if (data.ok) setPacientes(data.pacientes); });
    }
  }, []);

  const cargarRecetas = () => {
    if (!usuarioId) return;
    const endpoint = rol === 'medico'
      ? `/recetas/medico/${usuarioId}` // recetas que emitió la doctora
      : `/recetas/usuario/${usuarioId}`;

    API.get(endpoint)
      .then(response => {
        if (response.data?.ok) setRecetas(response.data.recetas);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (usuarioId) cargarRecetas();
  }, [usuarioId]);

  const eliminarReceta = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta receta?')) return;
    try {
      await API.delete(`/recetas/${id}`);
      setRecetas(prev => prev.filter(r => r.id !== id));
      alert('Receta eliminada correctamente.');
    } catch {
      alert('Error al eliminar la receta.');
    }
  };

  const crearReceta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !medicamentos.trim()) {
      alert('Selecciona un paciente y escribe los medicamentos.');
      return;
    }
    setGuardando(true);
    try {
      const response = await API.post('/recetas', {
        usuarioId: pacienteId,
        medicoNombre,
        medicamentos: medicamentos.trim(),
        observaciones: observaciones.trim()
      });
      if (response.data?.ok) {
        alert('¡Receta creada con éxito!');
        setMedicamentos('');
        setObservaciones('');
        setPacienteId('');
        cargarRecetas();
      }
    } catch {
      alert('Error al crear la receta.');
    }
    setGuardando(false);
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>

            {rol === 'medico' ? <Nav /> : <MenuNavegacion />}

            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>

              <div onClick={() => history.push(rol === 'medico' ? '/medico-dashboard' : '/home')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                {rol === 'medico' ? 'Gestión de Recetas Médicas' : 'Mis Recetas Médicas'}
              </h2>

              {/* form medico */}
              {rol === 'medico' && (
                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#00875E', marginBottom: '20px', fontSize: '16px' }}>
                    Nueva Receta
                  </h3>
                  <form onSubmit={crearReceta}>

                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '500' }}>Paciente:</p>
                      <select
                        value={pacienteId}
                        onChange={e => setPacienteId(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                      >
                        <option value="">Selecciona un paciente...</option>
                        {pacientes.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre} ({p.rut})</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '500' }}>Medicamentos:</p>
                      <textarea
                        value={medicamentos}
                        onChange={e => setMedicamentos(e.target.value)}
                        placeholder="Ej: Paracetamol 500mg cada 8 horas por 5 días"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '500' }}>Indicaciones extra (opcional):</p>
                      <textarea
                        value={observaciones}
                        onChange={e => setObservaciones(e.target.value)}
                        placeholder="Ej: Tomar con comida, evitar alcohol..."
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={guardando}
                      style={{ backgroundColor: '#00875E', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 30px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                    >
                      {guardando ? 'Guardando...' : 'Crear Receta'}
                    </button>
                  </form>
                </div>
              )}

              {/*recetas */}
              <h3 style={{ fontWeight: 'bold', color: '#555', marginBottom: '15px', fontSize: '16px' }}>
                {rol === 'medico' ? 'Recetas Emitidas' : 'Mis Recetas'}
              </h3>

              {recetas.length === 0 ? (
                <IonCard style={{ borderRadius: '15px', padding: '25px', backgroundColor: 'white' }}>
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <IonIcon icon={documentTextOutline} style={{ fontSize: '60px', color: '#ccc', marginBottom: '15px' }} />
                    <h4 style={{ color: '#666', margin: 0, fontWeight: '500' }}>No hay recetas registradas.</h4>
                  </div>
                </IonCard>
              ) : (
                recetas.map((receta) => (
                  <IonCard key={receta.id} style={{ borderRadius: '12px', margin: '0 0 20px 0', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <IonCardHeader style={{ paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IonIcon icon={personOutline} color="primary" style={{ fontSize: '20px' }} />
                          <div>
                            <IonCardSubtitle style={{ textTransform: 'none', margin: 0 }}>
                              {rol === 'medico' ? 'Paciente ID' : 'Médico Emisor'}
                            </IonCardSubtitle>
                            <IonCardTitle style={{ fontSize: '16px', fontWeight: 'bold', color: '#222' }}>
                              {rol === 'medico' ? receta.usuarioId : receta.medicoNombre}
                            </IonCardTitle>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
                            <IonIcon icon={calendarOutline} />
                            <span>{new Date(receta.fechaCreacion).toLocaleDateString()}</span>
                          </div>
                          {/* eliminar */}
                          <div
                            onClick={() => eliminarReceta(receta.id)}
                            style={{ cursor: 'pointer', color: '#e53935', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                          >
                            <IonIcon icon={trashOutline} style={{ fontSize: '18px' }} />
                          </div>
                        </div>
                      </div>
                    </IonCardHeader>

                    <IonCardContent style={{ paddingTop: '15px' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <IonIcon icon={medicalOutline} color="success" />
                          <strong style={{ color: '#222', fontSize: '14px' }}>Medicamentos:</strong>
                        </div>
                        <p style={{ margin: 0, padding: '12px', backgroundColor: '#f4f5f8', borderRadius: '6px', color: '#333', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                          {receta.medicamentos}
                        </p>
                      </div>
                      {receta.observaciones && (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <IonIcon icon={pulseOutline} color="warning" />
                            <strong style={{ color: '#222', fontSize: '14px' }}>Indicaciones extra:</strong>
                          </div>
                          <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>{receta.observaciones}</p>
                        </div>
                      )}
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

export default RecetasMedicas;
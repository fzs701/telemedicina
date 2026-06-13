import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, pulseOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const SeguimientoIndicaciones: React.FC = () => {
  const history = useHistory();
  const [historial, setHistorial] = useState<any[]>([]);
  const [comentario, setComentario] = useState<string>('');

  //Cargar el historial local 
  const cargarHistorialLocal = (id: string) => {
    const llaveHistorial = `historial_seguimiento_${id}`;
    const historialLocal = localStorage.getItem(llaveHistorial);
    if (historialLocal) {
      try {
        setHistorial(JSON.parse(historialLocal));
      } catch (e) {
        setHistorial([]);
      }
    }
  };

  const [usuarioId, setUsuarioId] = useState<string>("");

  useEffect(() => {
     const user = localStorage.getItem('usuario');
    let idActual = localStorage.getItem('usuarioId') || "";
    if (user) {
       const parsed = JSON.parse(user);
       idActual = parsed.id || idActual;
    }
    setUsuarioId(idActual);
    if (idActual) cargarHistorialLocal(idActual);
  }, []);

  // Guardar directo en LocalStorage 
  const responderSeguimiento = (respuesta: 'SI' | 'NO') => {
    const textoComentario = comentario.trim() ? ` (Comentario: ${comentario.trim()})` : '';
    const textoIndicacion = `Seguimiento indicación${textoComentario}`;
    
    const nuevoRegistro = {
      id: Date.now(),
      indicacion: textoIndicacion,
      cumplio: respuesta,
      fechaRegistro: new Date().toISOString()
    };

    const llaveHistorial = `historial_seguimiento_${usuarioId}`;
    const historialExistente = localStorage.getItem(llaveHistorial);
    let listaActualizada = [];

    if (historialExistente) {
      try {
        listaActualizada = JSON.parse(historialExistente);
        if (!Array.isArray(listaActualizada)) listaActualizada = [];
      } catch (e) {
        listaActualizada = [];
      }
    }

    listaActualizada.push(nuevoRegistro);
    localStorage.setItem('historial_seguimiento_global', JSON.stringify(listaActualizada));

    // ALERTA
    alert('¡OK enviado!');

    // Limpiamos y actualizamos la interfaz altiro
    setComentario('');
    setHistorial(listaActualizada);
  };

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

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Seguimiento de Indicaciones</h2>

              <IonCard style={{ padding: '25px', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #00875E', paddingBottom: '10px', marginBottom: '15px' }}>
                  <IonIcon icon={pulseOutline} style={{ fontSize: '24px', color: '#00875E' }} />
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#00875E' }}>¿Cumpliste con tu tratamiento hoy?</h3>
                </div>
                
                {/* CUADRO DE COMENTARIOS */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px' }}>
                    <IonIcon icon={chatbubbleEllipsesOutline} color="primary" />
                    Escribir comentarios / observaciones:
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe un comentario opcional sobre tu estado..."
                    style={{
                      width: '100%',
                      height: '70px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      resize: 'none',
                      backgroundColor: '#fdfdfd'
                    }}
                  />
                </div>
                
                {/* BOTONES*/}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <IonButton color="success" onClick={() => responderSeguimiento('SI')} style={{ flex: 1, fontWeight: 'bold' }}>
                    <IonIcon slot="start" icon={checkmarkCircleOutline} /> SÍ, LO CUMPLÍ
                  </IonButton>
                  <IonButton color="danger" onClick={() => responderSeguimiento('NO')} style={{ flex: 1, fontWeight: 'bold' }}>
                    <IonIcon slot="start" icon={closeCircleOutline} /> NO LO CUMPLÍ
                  </IonButton>
                </div>
              </IonCard>

              <h3 style={{ fontWeight: 'bold', color: '#444', marginBottom: '15px' }}>Historial de Cumplimiento Médico</h3>
              
              {historial.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No hay registros de seguimiento previos.</p>
              ) : (
                historial.slice().reverse().map((h) => (
                  <div key={h.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px',
                    borderLeft: h.cumplio === 'SI' ? '6px solid #10dc60' : '6px solid #f04141',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IonIcon icon={timeOutline} /> {new Date(h.fechaRegistro).toLocaleString()}
                      </span>
                      <p style={{ margin: '4px 0 0 0', color: '#333', fontWeight: '500', fontSize: '14px' }}>{h.indicacion}</p>
                    </div>
                    <span style={{
                      fontWeight: 'bold', fontSize: '13px', padding: '4px 12px', borderRadius: '20px',
                      backgroundColor: h.cumplio === 'SI' ? '#e6f9ed' : '#fdeded',
                      color: h.cumplio === 'SI' ? '#10dc60' : '#f04141'
                    }}>{h.cumplio}</span>
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

export default SeguimientoIndicaciones;
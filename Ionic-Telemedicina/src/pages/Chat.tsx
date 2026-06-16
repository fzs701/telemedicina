import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import MenuNavegacion from '../components/MenuNavegacion';
import BarraVerde from '../components/BarraVerde';

interface Mensaje {
  id?: string;
  remitente_tipo: 'medico' | 'paciente';
  texto: string;
  fecha?: string;
}

const Chat: React.FC = () => {
  const history = useHistory();
  const usuarioId = localStorage.getItem('usuarioId');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [nombreDoctora, setNombreDoctora] = useState('Especialista');
  const bottomRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

  const cargarMensajes = () => {
    if (!usuarioId) return;
    fetch(`${API_URL}/api/mensajes/usuario/${usuarioId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setMensajes(data.mensajes || []);
          if (data.medicoNombre) setNombreDoctora(data.medicoNombre);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 10000); 
    return () => clearInterval(intervalo);
  }, [usuarioId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !usuarioId) return;
    const texto = nuevoMensaje.trim();
    setMensajes(prev => [...prev, { remitente_tipo: 'paciente', texto }]);
    setNuevoMensaje('');
    try {
      await fetch(`${API_URL}/api/mensajes/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, remitente_tipo: 'paciente', texto })
      });
    } catch {}
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <MenuNavegacion />
            <IonCol size="9" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>

              {/* cebecera */}
              <div style={{ backgroundColor: '#00875E', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div onClick={() => history.goBack()} style={{ cursor: 'pointer', color: 'white' }}>
                  <IonIcon icon={arrowBackOutline} style={{ fontSize: '20px' }} />
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                  {nombreDoctora.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '15px' }}>{nombreDoctora}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Médico Especialista</p>
                </div>
              </div>

              {/* mensajes */}
             <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#B6E6EB' }}>
                {mensajes.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', marginTop: '40px' }}>No hay mensajes aún. ¡Escribe el primero!</p>
                ) : (
                  mensajes.map((msg, i) => (
                    <div key={i} style={{
                      alignSelf: msg.remitente_tipo === 'paciente' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.remitente_tipo === 'paciente' ? '#00875E' : 'white',
                      color: msg.remitente_tipo === 'paciente' ? 'white' : '#333',
                      padding: '10px 15px', borderRadius: msg.remitente_tipo === 'paciente' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      maxWidth: '65%', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: msg.remitente_tipo === 'medico' ? '1px solid #eee' : 'none'
                    }}>
                      {msg.remitente_tipo === 'medico' && (
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#00875E' }}>{nombreDoctora}</p>
                      )}
                      {msg.texto}
                      {msg.fecha && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: 0.6, textAlign: 'right' }}>
                          {new Date(msg.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* input */}
              <form onSubmit={enviar} style={{ padding: '12px 20px', backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  value={nuevoMensaje}
                  onChange={e => setNuevoMensaje(e.target.value)}
                  placeholder="Escribir un mensaje..."
                  style={{ flex: 1, border: '1px solid #ddd', borderRadius: '25px', padding: '10px 18px', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9' }}
                />
                <button type="submit" style={{ backgroundColor: '#B6E6EB', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IonIcon icon={sendOutline} style={{ color: 'white', fontSize: '18px' }} />
                </button>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
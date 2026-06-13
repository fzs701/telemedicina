import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import Nav from '../components/Nav';
import BarraVerde from '../components/BarraVerde';

const ChatMedico: React.FC = () => {
  const history = useHistory();
  const medicoId = localStorage.getItem('usuarioId');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteActivo, setPacienteActivo] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const cargarPacientes = () => {
  fetch(`http://localhost:3000/api/mensajes/medico/${medicoId}`)
    .then(res => res.json())
    .then(data => { if (data.ok) setPacientes(data.pacientes); })
    .catch(() => {});
};

  const cargarMensajes = (pacienteId: string) => {
    fetch(`http://localhost:3000/api/mensajes/usuario/${pacienteId}`)
      .then(res => res.json())
      .then(data => { if (data.ok) setMensajes(data.mensajes || []); })
      .catch(() => {});
  };

  useEffect(() => {
    cargarPacientes();
    const intervalo = setInterval(cargarPacientes, 15000);
    return () => clearInterval(intervalo);
  }, [medicoId]);

  // Preseleccionar paciente si viene desde FichaPaciente
  useEffect(() => {
    if (pacientes.length === 0) return;
    const guardado = localStorage.getItem('pacienteSeleccionado');
    if (!guardado) return;
    const p = JSON.parse(guardado);
    const encontrado = pacientes.find((pac: any) => pac.id === p.id);
    if (encontrado) {
      setPacienteActivo(encontrado);
      localStorage.removeItem('pacienteSeleccionado');
    }
  }, [pacientes]);

  useEffect(() => {
    if (!pacienteActivo) return;
    cargarMensajes(pacienteActivo.id);
    const intervalo = setInterval(() => cargarMensajes(pacienteActivo.id), 10000);
    return () => clearInterval(intervalo);
  }, [pacienteActivo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !pacienteActivo) return;
    const texto = nuevoMensaje.trim();
    setMensajes(prev => [...prev, { remitente_tipo: 'medico', texto }]);
    setNuevoMensaje('');
    try {
      await fetch('http://localhost:3000/api/mensajes/medico/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: pacienteActivo.id, texto })
      });
    } catch {}
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />
            <IonCol size="9" style={{ display: 'flex', padding: 0, height: '100vh' }}>

              {/* LISTA PACIENTES */}
              <div style={{ width: '280px', borderRight: '1px solid #eee', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <div onClick={() => history.push('/medico-dashboard')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '10px', fontSize: '13px' }}>
                    <IonIcon icon={arrowBackOutline} /> Volver al Inicio
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Mensajes</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>Pacientes asignados</p>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {pacientes.length === 0 ? (
                    <p style={{ padding: '20px', color: '#aaa', fontSize: '13px', fontStyle: 'italic' }}>Sin pacientes.</p>
                  ) : (
                    pacientes.map(p => (
                      <div key={p.id} onClick={() => setPacienteActivo(p)}
                        style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', backgroundColor: pacienteActivo?.id === p.id ? '#f0faf5' : 'white', borderLeft: pacienteActivo?.id === p.id ? '3px solid #00875E' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#00875E', flexShrink: 0 }}>
                            {p.nombre.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{p.nombre}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.ultimoMensaje || 'Sin mensajes aún'}
                            </p>
                          </div>
                          {p.remitente === 'paciente' && p.ultimoMensaje && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00875E', flexShrink: 0 }} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ÁREA DE CHAT */}
{!pacienteActivo ? (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', color: '#aaa' }}>
    <p style={{ fontSize: '16px' }}>Selecciona un paciente para chatear</p>
  </div>
) : (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    
    {/* Cabecera verde */}
    <div style={{ backgroundColor: '#00875E', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
        {pacienteActivo.nombre.charAt(0)}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '15px' }}>{pacienteActivo.nombre}</p>
        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{pacienteActivo.rut}</p>
      </div>
    </div>

    {/* Área mensajes celeste */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#B6E6EB' }}>
      
      {/* Fecha centrada */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#555', margin: '5px 0 10px 0' }}>
        {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {mensajes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', marginTop: '40px' }}>Sin mensajes aún.</p>
      ) : (
        mensajes.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.remitente_tipo === 'medico' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.remitente_tipo === 'medico' ? '#00875E' : 'white',
            color: msg.remitente_tipo === 'medico' ? 'white' : '#333',
            padding: '10px 15px',
            borderRadius: msg.remitente_tipo === 'medico' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            maxWidth: '60%', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: msg.remitente_tipo === 'paciente' ? '1px solid #eee' : 'none'
          }}>
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

    {/* Input mensaje */}
    <form onSubmit={enviar} style={{ padding: '12px 20px', backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        value={nuevoMensaje}
        onChange={e => setNuevoMensaje(e.target.value)}
        placeholder={`Mensaje a ${pacienteActivo.nombre}...`}
        style={{ flex: 1, border: '1px solid #ddd', borderRadius: '25px', padding: '10px 18px', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9' }}
      />
      <button type="submit" style={{ backgroundColor: '#00875E', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IonIcon icon={sendOutline} style={{ color: 'white', fontSize: '18px' }} />
      </button>
    </form>
  </div>
)}

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ChatMedico;
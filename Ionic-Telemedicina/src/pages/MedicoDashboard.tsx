import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useIonRouter, IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';
import { videocamOutline, notificationsOutline } from 'ionicons/icons';
import UserAvatar from '../components/UserAvatar';
import './Home.css';
import { authService } from '../services/authService';

const MedicoDashboard: React.FC = () => {
    const router = useIonRouter();
    const autenticado = authService.isAuthenticated();
    const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Médico';
    const medicoId = localStorage.getItem('usuarioId');

    const [pacientes, setPacientes] = useState<any[]>([]);
    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    
    // Estado para la próxima videollamada real de la Doctora
    const [proximaCita, setProximaCita] = useState<string>('Sin registrar');
    const [detalleCita, setDetalleCita] = useState<string>('No hay pacientes agendados para hoy.');

    const mensajeMedico = localStorage.getItem('clinicoMensaje') && localStorage.getItem('clinicoMensaje') !== 'undefined'
        ? localStorage.getItem('clinicoMensaje')
        : 'No tienes mensajes nuevos.';

    useEffect(() => {
        if (medicoId) {
            // Cargar pacientes críticos de la BD 
            fetch(`${API_URL}/api/medico/${medicoId}/dashboard`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setPacientes(data.pacientes); 
                }
            })
            .catch(err => console.error("Error al cargar la BD de pacientes:", err));

            // Buscamos la agenda de la doctora en MySQL
            fetch(`${API_URL}/api/citas/medico/${medicoId}`)
            .then(res => res.json())
            .then(data => {
             if (data.ok && data.citas && data.citas.length > 0) {
            // Filtrar solo citas futuras
               const hoy = new Date();
               const citasFuturas = (data.citas as any[]).filter((c: any) => {
               const fechaCita = new Date(`${c.fecha}T${c.hora}`);
               return fechaCita >= hoy;
            });
            if (citasFuturas.length > 0) {
               const cita = citasFuturas[0];
               setProximaCita(`${cita.fecha} a las ${cita.hora} hrs`);
               setDetalleCita(`Paciente: ${cita.paciente_nombre || 'Sin nombre'} · ${cita.paciente_rut || ''}`);
               } else {
                   setProximaCita('Sin citas próximas');
                   setDetalleCita('No hay pacientes agendados.');
                }
            }
        })
        .catch(() => {
            setProximaCita('Sin registrar');
            setDetalleCita('No hay pacientes agendados para hoy.');
        });
        }
    }, [medicoId]);
    const [mensajeReal, setMensajeReal] = useState(mensajeMedico);

    useEffect(() => {
        if (!medicoId) return;
        fetch(`${API_URL}/api/mensajes/medico/${medicoId}`)
        .then(res => res.json())
        .then(data => {
        if (data.ok && data.pacientes && data.pacientes.length > 0) {
        // Buscar el paciente con mensaje más reciente
           const conMensaje = data.pacientes.filter((p: any) => p.ultimoMensaje);
            if (conMensaje.length > 0) {
              const ultimo = conMensaje[conMensaje.length - 1];
               setMensajeReal(`${ultimo.nombre}: ${ultimo.ultimoMensaje}`);
            }
        }
    })
    .catch(() => {});
    }, [medicoId]);

    return (
        <IonPage>
            <BarraVerde />

            <IonContent style={{ '--background': '#ffffff' }}>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
                    <IonRow className="fila-principal">
                        
                        <Nav />

                        <IonCol size="9" className="columna-contenido">
                                 
                            {/* Mensaje bienvenida */}
                            <h2 className="cabecera-bienvenida">
                                <UserAvatar size="45px" /> 
                                ¡Hola! {nombreUsuario}
                            </h2>

                            {/* Resumen estado */}
                            <div className="tarjeta-resumen-salud">
                                <div className="cabecera-amarilla" onClick={() => router.push('/resumen-pacientes')} style={{ cursor: 'pointer' }}>
                                    <span>⭐</span> Resumen Pacientes
                                </div>

                                
                                <div style={{ display: 'flex', flexDirection: 'row', padding: '15px', backgroundColor: '#ffffff', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '14px', color: '#ff4d4d', width: '45%', fontWeight: 'bold' }}>
                                        <span style={{ color: '#333' }}>Pacientes </span>Estado Crítico {pacientes ? pacientes.length : 0}:
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '55%' }}>
                                        {pacientes && pacientes.length > 0 ? (pacientes.map((paciente: any) => (
                                            <div key={paciente.id} style={{ display: 'flex', fontSize: '14px' }}>
                                                <span style={{ color: '#555', marginRight: '25px', display: 'inline-block', minWidth: '100px' }}>{paciente.rut} </span>
                                                <span style={{ color: '#000', fontWeight: 'bold' }}>{paciente.nombre}</span>
                                            </div>
                                            ))
                                        ) : (
                                        <p style={{ fontSize: '14px', color: '#888', fontStyle: 'italic', margin: 0 }}>No hay pacientes críticos.</p>
                                         )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Cuadro de videollamadas  */}
                            <div className="tarjeta-videollamada" style={{ cursor: 'pointer' ,borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', backgroundColor: '#FFFFF', margin: '15px 0' }}
                            onClick={() => router.push('/videollamada-medico')}>
                                <div className="cabecera-verde-video" style={{ backgroundColor: '#00875E', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                                    <IonIcon icon={videocamOutline} /> Videollamada
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', padding: '20px 25px', backgroundColor: '#FFFDE6', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ fontSize: '14px', color: '#333' }}>
                                        {/* Imprime el estado dinámico sincronizado */}
                                        <strong>Próxima cita:</strong> <span style={{ color: '#00875E', fontWeight: 'bold' }}>{proximaCita}</span>
                                    </div>

                                    <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', fontWeight: '500' }}>
                                        {/* Muestra el paciente asociado a esa hora */}
                                       {detalleCita}
                                        </div>
                                 </div>
                            </div>

                            {/* Cuadro de chat y mensajes */}
                            <div className="seccion-inferior">
                                <div className="contenedor-icono-chat" onClick={() => router.push('/chat-medico')}>
                                    <div className="caja-borde-chat">
                                        <IonIcon icon={notificationsOutline} style={{ fontSize: '22px' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>Chat</span>
                                </div>

                                <div className="tarjeta-mensaje-enfermera" onClick={() => router.push('/chat-medico')} style={{ cursor: 'pointer' }}>
                                    <div className="cabecera-celeste-mensaje">
                                        <UserAvatar size="18px" /> 
                                        <span>Mensaje</span>
                                    </div>
                                    <div style={{ padding: '12px 20px' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.3' }}>
                                            {mensajeReal}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default MedicoDashboard;
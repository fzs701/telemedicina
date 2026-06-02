import React, { useState, useEffect } from 'react';
import { useIonRouter, IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import { videocamOutline, notificationsOutline } from 'ionicons/icons';
import UserAvatar from '../components/UserAvatar';
import './Home.css';
import { authService } from '../services/authService';

const Home: React.FC = () => {
    const router = useIonRouter();
    const autenticado = authService.isAuthenticated();
    const usuarioId = localStorage.getItem('usuarioId');

    const estadoInicial = localStorage.getItem('clinicoEstado') || 'No registrado';
    const sintomasIniciales = localStorage.getItem('clinicoSintomas') || 'Sin síntomas registrados';

    const [dolorReal, setDolorReal] = useState(localStorage.getItem('clinicoDolor') || 'No registrado');
    const [estadoReal, setEstadoReal] = useState(estadoInicial);
    const [sintomasReales, setSintomasReales] = useState(sintomasIniciales);

    useEffect(() => {
        if (usuarioId) {
            fetch(`http://localhost:3000/api/registro-salud/${usuarioId}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok && data.ultimo) {
                    setEstadoReal(data.ultimo.estado || 'No registrado');
                    setSintomasReales(data.ultimo.sintomas || 'Sin síntomas registrados')
                    if (data.ultimo.nivelDolor !== undefined && data.ultimo.nivelDolor !== null) {
                        setDolorReal(`Nivel ${data.ultimo.nivelDolor}`);
                    } else {
                        setDolorReal('No registrado');
                    }
                }
            })
            
            .catch(err => console.error("Error al actualizar datos desde la BD:", err));
        }
    }, [usuarioId]);
    
    
    const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Paciente';
    const estadoSalud = localStorage.getItem('clinicoEstado') && localStorage.getItem('clinicoEstado') !== 'undefined' 
       ? localStorage.getItem('clinicoEstado') 
       : 'No registrado';
    
    const sintomas = localStorage.getItem('clinicoSintomas') && localStorage.getItem('clinicoSintomas') !== 'undefined'
        ? localStorage.getItem('clinicoSintomas')
        : 'Sin síntomas registrados';

    const dolor = localStorage.getItem('clinicoDolor') && localStorage.getItem('clinicoDolor') !== 'undefined'
        ? localStorage.getItem('clinicoDolor')
        : 'No registrado';

    const ultimaCita = localStorage.getItem('clinicoCita') && localStorage.getItem('clinicoCita') !== 'undefined'
        ? localStorage.getItem('clinicoCita')
        : 'Sin registrar';

    const mensajeMedico = localStorage.getItem('clinicoMensaje') && localStorage.getItem('clinicoMensaje') !== 'undefined'
        ? localStorage.getItem('clinicoMensaje')
        : 'No tienes mensajes nuevos.';
    

    return (
        <IonPage>

            <BarraVerde /> {/*componente barra verde*/}

            <IonContent style={{ '--background': '#ffffff' }}>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
                    <IonRow className="fila-principal">
                        
                        
                        
                        <MenuNavegacion />

                        <IonCol size="9" className="columna-contenido">
                             
                            {/*mensaje bienvenida*/}
                            <h2 className="cabecera-bienvenida">
                                <UserAvatar size="45px" /> 
                                ¡Hola! {nombreUsuario}
                            </h2>

                            {/*resumen estado*/}
                            <div className="tarjeta-resumen-salud">
                                <div className="cabecera-amarilla">
                                    <span>⭐</span> Resumen estado de salud
                                </div>
                                <div className="cuerpo-resumen">
                                    <div className="texto-resumen">
                                        <p><strong>Último registro:</strong> {estadoReal === 'No registrado' ? 'Nunca' : 'Reciente'}</p>
                                        <p><strong>Estado:</strong> <span style={{ color: estadoReal === 'Crítico' ? '#D32F2F' : '#388E3C' }}>{estadoReal}</span></p>
                                        <p><strong>Síntomas:</strong> {sintomasReales}</p>
                                    </div>
                                    <div className="texto-resumen">
                                        <p><strong>Dolor:</strong> {dolorReal}</p>
                                        <p><strong>Estado reciente:</strong> <span style={{ color: estadoReal === 'Crítico' ? '#D32F2F' : '#388E3C' }}>{estadoReal}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/*cuadro de como se siente y registrar estado salud*/}
                            <div className="grilla-acciones">
                                <div className="cuadro-accion-blanco">
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
                                        ¿Cómo te sientes hoy? 😊
                                    </p>
                                    <IonButton 
                                        className="boton-verde-ionic"
                                        onClick={() => router.push('/registro-estado')}
                                    >
                                        Registrar estado de salud
                                    </IonButton>
                                </div>

                                {/*cuadro de videollamdas recientes*/}
                                <div className="tarjeta-videollamada">
                                    <div className="cabecera-verde-video">
                                        <IonIcon icon={videocamOutline} /> Videollamada
                                    </div>
                                    <div style={{ padding: '15px 10px', textAlign: 'center' }}>
                                        <p style={{ margin: '3px 0', fontSize: '12px', color: '#333' }}>
                                           <strong>Última cita:</strong> {ultimaCita}
                                        </p>
                                        <p style={{ margin: '3px 0', fontSize: '12px', color: '#333' }}>
                                            <strong>Próxima cita:</strong> Sin registrar
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/*cuadro de chat y mensajes*/}
                            <div className="seccion-inferior">
                                <div className="contenedor-icono-chat" onClick={() => router.push('/chat')}>
                                    <div className="caja-borde-chat">
                                        <IonIcon icon={notificationsOutline} style={{ fontSize: '22px' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>Chat</span>
                                </div>

                                <div className="tarjeta-mensaje-enfermera">
                                    <div className="cabecera-celeste-mensaje">
                                        <UserAvatar size="18px" /> 
                                        <span>Mensaje</span>
                                    </div>
                                    <div style={{ padding: '12px 20px' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.3' }}>
                                           {mensajeMedico}
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

export default Home;
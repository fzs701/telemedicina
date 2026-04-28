import React from 'react';
import { useIonRouter, IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import { videocamOutline, notificationsOutline } from 'ionicons/icons';
import UserAvatar from '../components/UserAvatar';
import './Home.css';

const Home: React.FC = () => {
    const router = useIonRouter();

    return (
        <IonPage>

            <BarraVerde /> {/*componente barra verde*/}

            <IonContent style={{ '--background': '#ffffff' }}>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
                    <IonRow className="fila-principal">
                        
                        <MenuNavegacion /> {/*componente menu izquierda*/}

                        <IonCol size="9" className="columna-contenido">
                             
                            {/*mensaje bienvenida*/}
                            <h2 className="cabecera-bienvenida">
                                <UserAvatar size="45px" /> 
                                ¡Hola! Marta Pérez Ramírez
                            </h2>

                            {/*resumen estado*/}
                            <div className="tarjeta-resumen-salud">
                                <div className="cabecera-amarilla">
                                    <span>⭐</span> Resumen estado de salud
                                </div>
                                <div className="cuerpo-resumen">
                                    <div className="texto-resumen">
                                        <p><strong>Último registro:</strong> Hace 4 horas</p>
                                        <p><strong>Estado:</strong> <span style={{ color: '#D32F2F' }}>Crítico</span></p>
                                        <p><strong>Síntomas:</strong> Migraña, presión 120/80</p>
                                    </div>
                                    <div className="texto-resumen">
                                        <p><strong>Dolor:</strong> Presión muy alta</p>
                                        <p><strong>Estado reciente:</strong> <span style={{ color: '#388E3C' }}>Estable</span></p>
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
                                            <strong>Ultima cita:</strong> viernes 1 marzo, 2026
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
                                            Marta, recuerda registrar tu presión cada 4 horas y evitar la sal hoy.
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
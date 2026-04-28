import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, addOutline } from 'ionicons/icons';
import MenuNavegacion from '../components/MenuNavegacion';
import BarraVerde from '../components/BarraVerde';

// Importamos el CSS
import './Chat.css';

const Chat: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <BarraVerde /> {/*componente barra verde*/}

            <IonContent>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0 }}>
                    <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh', backgroundColor: '#FFFFFF' }}>
                        
                        <MenuNavegacion />{/*componente menu izquierda*/}

                        <IonCol size="9" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                            
                            {/* Botón Atrás */}
                            <div onClick={() => history.goBack()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px' }}>
                                <IonIcon icon={arrowBackOutline} /> Atrás
                            </div>

                            {/*titulo chat*/}
                            <div className="contenedor-principal-chat">
                                
                                <div className="cabecera-chat">
                                    <h3>Chat: Dra. Emilia Tapia</h3>
                                    <p>13 de Marzo, 2026</p>
                                </div>

                                {/*mensajes */}
                                <div className="area-mensajes">
                                     {/*mensaje recibido  */}
                                    <div className="burbuja-recibida">
                                        Marta, recuerda registrar tu presión cada 4 horas y evitar la sal hoy.
                                    </div>

                                    {/*mensaje enviado  */}
                                    <div className="burbuja-enviada">
                                        Super doctora, gracias.
                                    </div>
                                </div>

                                 {/*barra de Entrada */}
                                <div className="barra-entrada-contenedor">
                                    <div className="caja-entrada-blanca">
                                        <IonIcon icon={addOutline} className="icono-adjuntar" />
                                        <IonInput placeholder="Escribir un mensaje..." className="input-mensaje" />
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

export default Chat;
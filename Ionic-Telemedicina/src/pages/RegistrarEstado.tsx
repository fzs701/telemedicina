import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon, IonInput, IonButton, IonSelect, IonSelectOption, IonTextarea, IonCard } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import MenuNavegacion from '../components/MenuNavegacion';
import BarraVerde from '../components/BarraVerde';

const RegistroEstado: React.FC = () => {
    const history = useHistory();

    //fecha de dia actual
    const fechaHoy = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <IonPage>
            <BarraVerde /> {/*componente barra verde*/}

            <IonContent style={{ '--background': '#FFFFFF' }}>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
                    <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
                        
                        <MenuNavegacion />  {/*componente menu izquierda*/}

                        <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
                            
                            {/* Boton Atras */}
                            <div onClick={() => history.goBack()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px' }}>
                                <IonIcon icon={arrowBackOutline} /> Atrás
                            </div>

                            {/*tarjeta central blanca */}
                            <IonCard style={{ 
                                maxWidth: '800px', 
                                margin: '0 auto', 
                                borderRadius: '20px', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                padding: '30px',
                                backgroundColor: 'white'
                            }}>
                                {/*titulo y fecha fija*/}
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <h2 style={{ fontWeight: 'bold', margin: 0 }}>Registro Estado Diario</h2>
                                    <p style={{ fontSize: '11px', color: '#888' }}>{fechaHoy}</p>
                                </div>

                                <IonGrid>
                                    <IonRow>
                                        {/*campo de dolor */}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Dolor:</p>
                                            <IonSelect placeholder="seleccionar" interface="popover" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '5px' }}>
                                                <IonSelectOption value="ninguno">Ninguno</IonSelectOption>
                                                <IonSelectOption value="leve">Leve</IonSelectOption>
                                                <IonSelectOption value="fuerte">Fuerte</IonSelectOption>
                                            </IonSelect>
                                        </IonCol>

                                        {/*campo de dolor */}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Síntomas:</p>
                                            <IonSelect placeholder="seleccionar" interface="popover" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '5px' }}>
                                                <IonSelectOption value="mareos">Mareos</IonSelectOption>
                                                <IonSelectOption value="migraña">Migraña</IonSelectOption>
                                                <IonSelectOption value="vomito">Vomito</IonSelectOption>
                                                <IonSelectOption value="desmayo">Desmayo</IonSelectOption>
                                                <IonSelectOption value="otros">Otros</IonSelectOption>
                                            </IonSelect>
                                        </IonCol>

                                        {/*campo presion arterial */}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Presión Arterial:</p>
                                            <IonInput placeholder="ej: 120/80" fill="outline" style={{ '--border-radius': '8px' }} />
                                        </IonCol>

                                        {/*campo pulso */}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Pulso:</p>
                                            <IonInput placeholder="(bpm)" fill="outline" style={{ '--border-radius': '8px' }} />
                                        </IonCol>

                                        {/* campo escribir alguna molestia */}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>¿Alguna molestia?</p>
                                            <IonInput placeholder="Desmayo cada 2 hrs" fill="outline" style={{ '--border-radius': '8px' }} />
                                        </IonCol>

                                        {/*campo temperatura*/}
                                        <IonCol size="6">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Temperatura:</p>
                                            <IonInput placeholder="(°C)" fill="outline" style={{ '--border-radius': '8px' }} />
                                        </IonCol>

                                        {/*campo observaciones*/}
                                        <IonCol size="12">
                                            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Observaciones:</p>
                                            <IonTextarea 
                                                placeholder="Escribe aquí cómo te sientes o si tienes alguna observación para tu médico..." 
                                                fill="outline" 
                                                style={{ '--border-radius': '8px', minHeight: '100px' }} 
                                            />
                                        </IonCol>
                                    </IonRow>

                                    {/*boton de enviar reporte */}
                                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                        <IonButton 
                                            onClick={() => history.push('/home')}
                                            style={{ '--background': '#00875E', width: '300px', height: '45px', fontWeight: 'bold' }}
                                        >
                                            Enviar Reporte
                                        </IonButton>
                                    </div>

                                </IonGrid>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default RegistroEstado;
import React, { useState } from 'react';
import { IonCol, IonIcon } from '@ionic/react';
import { homeOutline, calendarOutline, addOutline, medicalOutline, documentTextOutline, clipboardOutline, notificationsOutline, settingsOutline, chevronDownOutline, chevronForwardOutline, colorPaletteOutline, documentLockOutline, timeOutline } from 'ionicons/icons';
import UserAvatar from './UserAvatar';
import './MenuNavegacion.css';

const MenuNavegacion: React.FC = () => {
    // controlar despliegue de configuración
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const [mostrarCuenta, setMostrarCuenta] = useState(false);

    

    return (
        <IonCol size="3" className="columna-menu">

            {/*scroll interno */}
            <div className="contenedor-scroll">
                
                {/*titulo*/}
                <div className="boton-registrar-salud">
                    Registrar estado de salud
                </div>
                
                {/*icono inicio*/}
                <div className="lista-navegacion">
                    <div className="item-inicio">
                        <IonIcon icon={homeOutline} /> Inicio
                    </div>

                    {/*icono cita*/}
                    <div className="item-menu-normal">
                        <IonIcon icon={calendarOutline} /> Citas
                    </div>

                    {/*icono agendar*/}
                    <div className="item-menu-normal">
                        <IonIcon icon={addOutline} /> Agendar
                    </div>

                    {/*despliegue servicios*/}
                    <p className="titulo-seccion">Servicios</p>

                    {/*icono indicacion*/}
                    <div className="item-servicio">
                        <IonIcon icon={medicalOutline} /> Indicación
                    </div>

                    {/*icono recetas medicas*/}
                    <div className="item-servicio">
                        <IonIcon icon={documentTextOutline} /> Recetas médicas
                    </div>

                    {/*icono examenes*/}
                    <div className="item-servicio">
                        <IonIcon icon={clipboardOutline} /> Exámenes
                    </div>

                    {/*icono seguimiento*/}
                    <div className="item-servicio">
                        <IonIcon icon={notificationsOutline} /> Seguimiento indicaciones
                    </div>

                    {/*despliegue configuracion*/}

                    <p className="titulo-seccion">Configuración</p>
                    
                    <div 
                        onClick={() => setMostrarCuenta(!mostrarCuenta)} 
                        className="item-cuenta-expandible"
                    >
                        <div className="contenedor-cuenta-label">
                            <IonIcon icon={settingsOutline} /> 
                            <span>Cuenta</span>
                        </div>
                        <IonIcon icon={mostrarCuenta ? chevronDownOutline : chevronForwardOutline} />
                    </div>

                    {mostrarCuenta && (
                        <div className="sub-menu-cuenta">
                            <div className="sub-item-cuenta">
                                <IonIcon icon={colorPaletteOutline} /> Cambiar Color
                            </div>
                            <div className="sub-item-cuenta">
                                <IonIcon icon={documentLockOutline} /> Términos y Cond.
                            </div>
                            <div className="sub-item-cuenta">
                                <IonIcon icon={timeOutline} /> Horarios
                            </div>
                        </div>
                    )}
                </div> 
            </div>

            <div style={{ padding: '15px 25px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' }}>
                
                {/*menu */}
                <div className="boton-menu-figma">
                    <UserAvatar size="20px" /> 
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Menú</span>
                </div>

                {/*perfil de Marta Pérez */}
                <div className="perfil-marta-contenedor">
                    <UserAvatar size="40px" />
                    <div className="info-texto-perfil">
                        <span className="nombre-usuario">Marta Pérez</span>
                        <span className="link-ver-perfil">Ver perfil</span>
                    </div>
                </div>
            </div>
            

        </IonCol>
    );
};

export default MenuNavegacion;
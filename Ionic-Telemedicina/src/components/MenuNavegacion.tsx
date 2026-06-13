import React, { useState } from 'react';
import { IonCol, IonIcon } from '@ionic/react';
import {personOutline, shieldCheckmarkOutline, homeOutline, calendarOutline, addOutline, medicalOutline, documentTextOutline, clipboardOutline, notificationsOutline, settingsOutline, chevronDownOutline, chevronForwardOutline, colorPaletteOutline, documentLockOutline, timeOutline } from 'ionicons/icons';
import UserAvatar from './UserAvatar';
import { authService } from '../services/authService';
import { useHistory } from 'react-router-dom';
import './MenuNavegacion.css';

const MenuNavegacion: React.FC = () => {
    // controlar despliegue de configuración
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const [mostrarCuenta, setMostrarCuenta] = useState(false);
    const history = useHistory(); 
    const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Paciente';

    //funcion de cerrar sesion
    const cerrarSesion = () => {
        authService.logout();
        window.location.assign('/login'); 
    };

    return (
        <IonCol size="3" className="columna-menu">

            {/*scroll interno */}
            <div className="contenedor-scroll">
                
                {/*titulo*/}
                <div className="boton-registrar-salud" onClick={() => history.push('/registro-estado')} // Redirige a tu formulario diario
                     style={{ cursor: 'pointer' }}>
                      Registrar estado de salud
                </div>

                {/*icono inicio*/}
                <div className="lista-navegacion">
                    <div className="item-inicio" onClick={() => { const rol = localStorage.getItem('usuarioRol');
                        history.push(rol === 'medico' ? '/medico-dashboard' : '/home'); }}
                        style={{ cursor: 'pointer' }}>
                          <IonIcon icon={homeOutline} /> Inicio
                    </div>
                    
                    <div className="item-menu-normal" onClick={() => history.push('/citas')} style={{ cursor: 'pointer' }}>
                        <IonIcon icon={calendarOutline} /> Citas
                    </div>
                    
                    <div className="item-menu-normal" onClick={() => history.push('/agendar-cita')} style={{ cursor: 'pointer' }}>
                        <IonIcon icon={addOutline} /> Agendar
                    </div>

                    <p className="titulo-seccion">Servicios</p>

                    <div className="item-servicio" onClick={() => history.push('/indicaciones')} style={{ cursor: 'pointer' }}>
                        <IonIcon icon={medicalOutline} /> Indicación
                    </div>

                    <div className="item-servicio" onClick={() => history.push('/recetas')} style={{ cursor: 'pointer' }}>
                        <IonIcon icon={documentTextOutline} /> Recetas médicas
                    </div>

                    <div className="item-servicio" onClick={() => history.push('/examenes')} style={{ cursor: 'pointer' }}>
                         <IonIcon icon={clipboardOutline} /> Exámenes
                    </div>

                    {/* boton seguimiento */}
                    <div className="item-servicio" onClick={() => history.push('/seguimiento')} style={{ cursor: 'pointer' }}>
                        <IonIcon icon={notificationsOutline} /> Seguimiento indicaciones
                    </div>

                    {/*despliegue configuracion*/}

                    <p className="titulo-seccion">Configuración</p>
                    
                    <div 
                        onClick={() => setMostrarCuenta(!mostrarCuenta)} 
                        className="item-cuenta-expandible">
                        <div className="contenedor-cuenta-label">
                            <IonIcon icon={settingsOutline} /> 
                            <span>Cuenta</span>
                        </div>
                        <IonIcon icon={mostrarCuenta ? chevronDownOutline : chevronForwardOutline} />
                    </div>

                    {mostrarCuenta && (
                        <div className="sub-menu-cuenta">
                          <div onClick={() => history.push('/terminos')} style={{ cursor: 'pointer' }}>
                              <IonIcon icon={shieldCheckmarkOutline} /> Términos y Cond.
                          </div>

                          <div onClick={() => history.push('/horarios')} style={{ cursor: 'pointer' }}>
                              <IonIcon icon={timeOutline} /> Horarios
                          </div>
                        </div>
                    )}
                </div> 
            </div>

            <div style={{ padding: '15px 25px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' }}>
            {/* menu */}
                <div style={{ padding: '10px 0', marginBottom: '10px' }}>
                  <div onClick={() => history.push('/resumen-general')} 
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px'}}>
                      <IonIcon icon={personOutline} style={{ fontSize: '22px', color: '#333' }} />
                          <span style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>Menú</span>
                  </div>
                </div>

            {/* perfil dinámico */}
            <div className="perfil-marta-contenedor" onClick={cerrarSesion} style={{ cursor: 'pointer' }}>
              <UserAvatar size="40px" />
                  <div className="info-texto-perfil">
                    <span className="nombre-usuario">{nombreUsuario}</span>
                    <span className="link-ver-perfil" style={{ color: 'red' }}>Cerrar Sesión</span>
                  </div>
            </div>
          </div>
            

        </IonCol>
    );
};

export default MenuNavegacion;
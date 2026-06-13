import React, { useState } from 'react';
import { IonCol, IonIcon } from '@ionic/react';
import { homeOutline, calendarOutline, addOutline, medicalOutline, documentTextOutline, clipboardOutline, notificationsOutline, settingsOutline, chevronDownOutline, chevronForwardOutline, documentLockOutline, timeOutline } from 'ionicons/icons';
import UserAvatar from './UserAvatar';
import { authService } from '../services/authService';
import { useHistory } from 'react-router-dom';
import { useIonRouter } from '@ionic/react';

import './Nav.css';

const Nav: React.FC = () => {
  // controlar despliegue de configuración
  const router = useIonRouter();
  const [mostrarCuenta, setMostrarCuenta] = useState(false);
  const history = useHistory();
  const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Paciente';

  // funcion de cerrar sesion
  const cerrarSesion = () => {
    authService.logout();
    window.location.assign('/login');
  };

  return (
    <IonCol size="3" className="columna-menu">
      {/*scroll interno */}
      <div className="contenedor-scroll">

        {/*titulo*/}
        <div className="boton-registrar-salud" onClick={() => router.push('/buscar-pacientes')} style={{ cursor: 'pointer' }}>
          Buscar Pacientes
        </div>

        <div className="lista-navegacion">

          {/*icono inicio*/}
          <div
            className="item-inicio"
            onClick={() => {
              const rol = localStorage.getItem('usuarioRol');
              history.push(rol === 'medico' ? '/medico-dashboard' : '/home');
            }}
            style={{ cursor: 'pointer' }}
          >
            <IonIcon icon={homeOutline} /> Inicio
          </div>

          {/*icono cita*/}
          <div className="item-menu-normal" onClick={() => router.push('/citas-medico')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={calendarOutline} />
            <span>Citas</span>
          </div>

          {/*icono agendar*/}
          <div className="item-menu-normal" onClick={() => history.push('/agendar-cita')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={addOutline} /> Agendar
          </div>

          {/*despliegue servicios*/}
          <p className="titulo-seccion">Servicios</p>

          {/*icono indicacion*/}
          <div className="item-servicio" onClick={() => router.push('/resumen-pacientes')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={medicalOutline} /> Resumen Pacientes
          </div>

          {/*icono recetas medicas*/}
          <div className="item-servicio" onClick={() => router.push('/recetas')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={documentTextOutline} /> Recetas médicas
          </div>

          {/*icono examenes*/}
          <div className="item-servicio" onClick={() => router.push('/documentos-medico')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={clipboardOutline} /> Documentos
          </div>

          {/*icono seguimiento*/}
          <div className="item-servicio" onClick={() => router.push('/enviar-recomendacion')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={notificationsOutline} /> Escribir Recomendación
          </div>

          {/*despliegue configuracion*/}
          <p className="titulo-seccion">Configuración</p>

          <div className="item-cuenta-expandible" onClick={() => setMostrarCuenta(!mostrarCuenta)}>
            <div className="contenedor-cuenta-label">
              <IonIcon icon={settingsOutline} />
              <span>Cuenta</span>
            </div>
            <IonIcon icon={mostrarCuenta ? chevronDownOutline : chevronForwardOutline} />
          </div>

          {mostrarCuenta && (
            <div className="sub-menu-cuenta">
              <div className="sub-item-cuenta" onClick={() => router.push('/terminos')} style={{ cursor: 'pointer' }}>
                <IonIcon icon={documentLockOutline} /> Términos y Cond.
              </div>

              <div className="sub-item-cuenta" onClick={() => router.push('/horarios')} style={{ cursor: 'pointer' }}>
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

        {/*perfil  */}
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

export default Nav;
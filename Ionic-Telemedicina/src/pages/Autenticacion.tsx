import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import { loginUsuarioApi, registrarUsuarioApi } from '../api';

const Autenticacion: React.FC = () => {
  const [present] = useIonToast();
  const [isLogin, setIsLogin] = useState(true); 

  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('paciente');

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!correo || !contrasena || (!isLogin && (!rut || !nombre))) {
      present({ message: 'Por favor, rellena todos los campos.', duration: 2000, color: 'danger' });
      return;
    }

    try {
      if (isLogin) {
        const respuesta = await loginUsuarioApi({ correo, contrasena });
        present({ message: `¡Bienvenido/a, ${respuesta.usuario.nombre}!`, duration: 2000, color: 'success' });
        
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuarioRol', respuesta.usuario.rol);
        localStorage.setItem('usuarioNombre', respuesta.usuario.nombre);
        localStorage.setItem('usuarioId', respuesta.usuario.id);
        
        localStorage.setItem('clinicoEstado', respuesta.clinicoEstado || 'No registrado');
        localStorage.setItem('clinicoSintomas', respuesta.clinicoSintomas || 'Sin síntomas registrados');
        localStorage.setItem('clinicoDolor', respuesta.clinicoDolor || 'No registrado');
        localStorage.setItem('clinicoCita', respuesta.clinicoCita || 'Sin registrar');
        localStorage.setItem('clinicoMensaje', respuesta.clinicoMensaje || 'No tienes mensajes nuevos.');

        if (respuesta.usuario.rol === 'medico') {
          window.location.href = '/medico-dashboard'; 
        } else {
          window.location.href = '/home';
        }
      } else {
        await registrarUsuarioApi({ rut, nombre, correo, contrasena, rol });
        present({ message: 'Usuario registrado con éxito. Ahora inicia sesión.', duration: 2000, color: 'success' });
        setIsLogin(true); 
      }
    } catch (error: any) {
      present({ message: error.mensaje || 'Ocurrió un error en el proceso', duration: 3000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{isLogin ? 'Iniciar Sesión - Telemedicina' : 'Registro de Usuario'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={manejarEnvio}>
          {!isLogin && (
            <>
              <IonItem>
                <IonLabel position="floating">RUT</IonLabel>
                <IonInput value={rut} onIonInput={e => setRut(e.detail.value!)} type="text" placeholder="12.345.678-9" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Nombre Completo</IonLabel>
                <IonInput value={nombre} onIonInput={e => setNombre(e.detail.value!)} type="text" />
              </IonItem>
              <IonItem>
                <IonLabel>Rol de Usuario</IonLabel>
                <IonSelect value={rol} onIonChange={e => setRol(e.detail.value)}>
                  <IonSelectOption value="paciente">Paciente (Marta Pérez)</IonSelectOption>
                  <IonSelectOption value="medico">Médico Especialista</IonSelectOption>
                </IonSelect>
              </IonItem>
            </>
          )}

          <IonItem>
            <IonLabel position="floating">Correo Electrónico</IonLabel>
            <IonInput value={correo} onIonInput={e => setCorreo(e.detail.value!)} type="email" />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput value={contrasena} onIonInput={e => setContrasena(e.detail.value!)} type="password" />
          </IonItem>

          <div className="ion-margin-top">
            <IonButton expand="block" type="submit" color="success">
              {isLogin ? 'Entrar' : 'Registrarse'}
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Autenticacion;
import { IonContent, IonIcon, IonPage, IonButton, IonInput, IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LogoPrincipal from '../components/LogoPrincipal';
import BarraVerde from '../components/BarraVerde';
import { loginUsuarioApi } from '../api';

const Login: React.FC = () => {
  const history = useHistory();
  const [rut, setRut] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [errorRut, setErrorRut] = React.useState(false);
  const [errorPass, setErrorPass] = React.useState(false);

  const manejarIngreso = async () => {
    const r = rut.trim() === '';
    const p = pass.trim() === '';

    setErrorRut(r);
    setErrorPass(p);

    if (!r && !p) {
      try {
        const respuesta = await loginUsuarioApi({ rut: rut, contrasena: pass });
        
        if (respuesta && respuesta.ok) {
          const rolReal = respuesta.usuario.rol;       // "medico"
          const nombreReal = respuesta.usuario.nombre; 
          const idReal = respuesta.usuario.id;         

          // Guardamos primero los datos del perfil
          localStorage.setItem('usuarioRol', rolReal);
          localStorage.setItem('usuarioNombre', nombreReal);
          localStorage.setItem('usuarioId', idReal);
          localStorage.setItem('usuario', JSON.stringify({ id: idReal, nombre: nombreReal, rol: rolReal }));

          // Datos clínicos de la respuesta
          localStorage.setItem('clinicoEstado', respuesta.clinicoEstado || 'No registrado');
          localStorage.setItem('clinicoSintomas', respuesta.clinicoSintomas || 'Sin síntomas registrados');
          localStorage.setItem('clinicoDolor', respuesta.clinicoDolor || 'No registrado');
          localStorage.setItem('clinicoCita', respuesta.clinicoCita || 'Sin registrar');
          localStorage.setItem('clinicoMensaje', respuesta.clinicoMensaje || 'No tienes mensajes nuevos.');

          
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('user_authenticated', 'true');

          // Usamos de forma estricta las rutas
          if (rolReal === 'medico') {
            // Limpia el historial para que no intente volver atrás al /login o /home
            history.push('/medico-dashboard');
            console.log('ID guardado:', localStorage.getItem('usuarioId'));
          } else {
            history.push('/home'); 
          }
        }
      } catch (err: any) {
        alert(err.mensaje || 'Credenciales incorrectas o error de conexión con MySQL.');
      }
    }
  };

  return (
    <IonPage> 
      <BarraVerde />
      <IonContent className='ion-padding' style={{ '--background': '#f5f5f5' }}>
        <IonGrid style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <IonRow className="ion-align-items-center" style={{ width: '100%' }}>
            <LogoPrincipal />
            <IonCol size="12" sizeMd="6">
              <IonCard style={{ maxWidth: '450px', margin: 'auto', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <IonCardContent className="ion-padding">
                  <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '35px', marginBottom: '30px', color: '#000' }}>
                    Iniciar sesión
                  </h2>
                  
                  {/* Campo RUT */}
                  <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 4px', color: 'black', fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>
                      Rut
                    </p>
                    <IonInput type="text" fill="outline" onIonInput={(e: any) => setRut(e.target.value)}
                      style={{'--border-color': errorRut ? 'red' : '#ccc', '--border-radius': '8px', backgroundColor: 'white' }}></IonInput>
                    {errorRut && (
                      <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 4px', fontWeight: 'bold' }}>Dato Requerido</p>
                    )}
                  </div>
                  
                  {/* Campo Contraseña */}
                  <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 4px', color: 'black', fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>
                      Contraseña
                    </p>
                    <IonInput fill="outline" type="password" onIonInput={(e: any) => setPass(e.target.value)}
                      style={{'--border-color': errorPass ? 'red' : '#ccc', '--border-radius': '8px', backgroundColor: 'white' }}></IonInput>
                    {errorPass && (
                      <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 4px', fontWeight: 'bold' }}>Dato Requerido</p>
                    )}
                  </div>

                  <p style={{ textAlign: 'right', color: 'black', marginBottom: '24px', cursor: 'pointer' }}>
                    Olvidé mi contraseña
                  </p>

                  <IonButton expand='block' onClick={manejarIngreso} style={{ '--background': '#00875E', height: '50px', fontWeight: 'bold' }}>
                    Iniciar sesión
                  </IonButton>

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p onClick={() => history.push('/registro')} style={{ color: '#00875E', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                      Crear cuenta
                    </p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <div style={{ backgroundColor: '#B7F0DF', height: '40px', width: '100%' }}></div>
    </IonPage>
  );
};

export default Login;


import { IonContent, IonIcon, IonPage, IonButton, IonItem, IonLabel, IonInput, IonCard, IonCardContent, IonGrid, IonRow, IonCol} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LogoPrincipal from '../components/LogoPrincipal';
import BarraVerde from '../components/BarraVerde';
import { authService } from '../services/authService';

const Login: React.FC = () => {
    const history = useHistory();
    const [rut, setRut] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [errorRut, setErrorRut] = React.useState(false);
    const [errorPass, setErrorPass] = React.useState(false);

    {/*constantes para hacer que usario escriba en cada campo antes de iniciar sesion*/}
    const manejarIngreso = () => {
        const r = rut.trim() === '';
        const p = pass.trim() === '';
    
        setErrorRut(r);
        setErrorPass(p);

        // Si no hay errores, llamamos al servicio
        if (!r && !p) {
            const exito = authService.login(rut, pass);
            if (exito) {
                history.push('/home');
            }
        }
    }

    return (
        <IonPage> 
            <BarraVerde /> {/*barra verde de arriba*/}



            <IonContent className='ion-padding' style={{ '--background': '#f5f5f5' }}>
            <IonGrid style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <IonRow className="ion-align-items-center" style={{ width: '100%' }}>
                    <LogoPrincipal />
        
                

                {/*cuadro de iniciar seccion */}
                <IonCol size="12" sizeMd="6">
                    <IonCard style={{ 
                        maxWidth: '450px', 
                        margin: 'auto', 
                        borderRadius: '15px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }}>
                    <IonCardContent className="ion-padding">
                        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '35px', marginBottom: '30px', color: '#000' }}>
                            Iniciar sesión
                        </h2>
                        
                        {/* campo rut */}
                        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 8px 4px', color: 'black', fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>
                                Rut
                            </p>

                            <IonInput type="text" fill="outline" onIonInput={(e: any) => setRut(e.target.value)}
                            style={{'--border-color': errorRut ? 'red' : '#ccc', '--border-radius': '8px',backgroundColor: 'white' }}></IonInput>
                        
                            {errorRut && (
                                
                            <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 4px', fontWeight: 'bold' }}>
                                Dato Requerido
                            </p>
                        )}

                        </div>
                        
                        {/* campo contraseña */}
                        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 8px 4px', color: 'black', fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>
                                Contraseña
                            </p>

                            <IonInput fill="outline" type="password"
                            onIonInput={(e: any) => setPass(e.target.value)}
                            style={{'--border-color': errorPass ? 'red' : '#ccc', '--border-radius': '8px',backgroundColor: 'white' }}></IonInput>
                        
                            {errorPass && (
                            <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 4px', fontWeight: 'bold' }}>
                                Dato Requerido
                            </p>
                        )}
                        </div>

                        

                        {/* comentario si olvida contraseña */}
                        <p style={{ textAlign: 'right', color: 'black', marginBottom: '24px', cursor: 'pointer' }}>
                            Olvidé mi contraseña
                        </p>
 
                        {/*boton para incipar sesion con datos contra y rut, y no puede saltarse un campo*/}
                        <IonButton expand='block' onClick={manejarIngreso} 
                            style={{ '--background': '#00875E', height: '50px', fontWeight: 'bold' }}
                        >
                            Iniciar sesión
                        </IonButton>
                        
                        {/*boton para registrar e ir a la pagina que sigue y registrarse*/}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p onClick={() => history.push('/registro')} 
                               style={{ 
                                color: '#00875E', 
                                fontWeight: '600', 
                                cursor: 'pointer', 
                                textDecoration: 'underline' }}>
                                    
                                Crear cuenta </p>
                        </div>

                    </IonCardContent>
                    </IonCard>

                </IonCol>

                </IonRow>

            </IonGrid>
            </IonContent>
  
  
            <div style={{ backgroundColor: '#B7F0DF', height: '40px', width: '100%' }}></div> {/*Barra de abajo */}


        </IonPage>
    );
}
export default Login;


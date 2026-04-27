import { IonContent, IonIcon, IonPage, IonButton, IonItem, IonLabel, IonInput, IonCard, IonCardContent, IonGrid, IonRow, IonCol} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { personCircleOutline } from 'ionicons/icons';

const Login: React.FC = () => {
    const history = useHistory();
    const [rut, setRut] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [errorRut, setErrorRut] = React.useState(false);
    const [errorPass, setErrorPass] = React.useState(false);

    const manejarIngreso = () => {
        const r = rut.trim() === '';
        const p = pass.trim() === '';
        
        setErrorRut(r);
        setErrorPass(p);

        if (!r && !p) {
            history.push('/tab1'); 
        }
    }
    return (
        <IonPage> {/*barra verde*/}
            <div style={{ 
                backgroundColor: '#B7F0DF',
                height: '60px', 
                width: '100%'  ,
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                paddingRight: '20px',
                gap: '20px',
                color: '#333',
                fontWeight: '500'
            }}>

                <span>Contacto</span>
                <span>Ayuda</span>
                <IonIcon icon={personCircleOutline} style={{ fontSize: '32px', color: 'black', cursor: 'pointer' }} />
                           
            </div>



            <IonContent className='ion-padding' style={{ '--background': '#f5f5f5' }}>
            <IonGrid style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <IonRow className="ion-align-items-center" style={{ width: '100%' }}>
        
                {/*logi y titulo */}
                <IonCol size="12" sizeMd="6" style={{ textAlign: 'center' }}>
                    <div style={{ 
                        backgroundColor: '#00875E', 
                        borderRadius: '50%', 
                        width: '220px', 
                        height: '220px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '20px'
                    }}>
                        <span style={{ color: 'white', fontSize: '320px', fontWeight: 'normal', lineHeight: '1' }}>+</span>
                    </div>
                    <h1 style={{ fontStyle: 'italic', fontWeight: '900', fontSize: '45px', color: '#333' }}>
                        Telemedicina
                    </h1>
                </IonCol>

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
              
                        <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 8px 4px', color: 'black', fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>
                                Rut
                            </p>
                            <IonInput fill="outline" 
                            onIonInput={(e: any) => setRut(e.target.value)}
                            style={{'--border-color': errorRut ? 'red' : '#ccc', '--border-radius': '8px',backgroundColor: 'white' }}></IonInput>
                        
                            {errorRut && (
                                
                            <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 4px', fontWeight: 'bold' }}>
                                Dato Requerido
                            </p>
                        )}
                        </div>

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

                        


                        <p style={{ textAlign: 'right', color: 'black', marginBottom: '24px', cursor: 'pointer' }}>
                            Olvidé mi contraseña
                        </p>

                        <IonButton expand='block' onClick={manejarIngreso} 
                            style={{ '--background': '#00875E', height: '50px', fontWeight: 'bold' }}
                        >
                            Iniciar sesión
                        </IonButton>
                        
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p style={{ color: '#00875E' , fontWeight: '600' }}>
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
}
export default Login;
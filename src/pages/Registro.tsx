import React, { useState } from 'react';
import {IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonInput, IonButton, IonCheckbox, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';

const Registro: React.FC = () => {
    const history = useHistory();

    //estados para datos formulario 
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [correo, setCorreo] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [intentóEnviar, setIntentóEnviar] = useState(false);

    //constantes para hacer que usario escriba en cada campo antes de registrar
    const manejarRegistro = () => {
        setIntentóEnviar(true);

        const todoCompleto = 
            nombre.trim() !== '' && 
            rut.trim() !== '' && 
            correo.trim() !== '' && 
            region.trim() !== '' && 
            comuna.trim() !== '' && 
            pass.trim() !== '' && 
            confirmPass.trim() !== '' && 
            aceptaTerminos === true;

        if (todoCompleto) {
            console.log("Registro exitoso");
            history.push('/home'); // nos manda al dashboard
        }
    };

    // estilo de los inputs si falta dato
    const estiloInput = (valor: string) => ({
        '--border-color': intentóEnviar && valor.trim() === '' ? 'red' : '#ccc',
        '--border-radius': '8px',
        backgroundColor: 'white',
        marginTop: '4px'
    });

    return (
        <IonPage>
            <BarraVerde /> {/* llamamos al componente barra verde*/}
            <IonContent style={{ '--background': '#f5f5f5' }} className="ion-padding">
                
                {/* Botón Atrás */}
                <div 
                    onClick={() => history.push('/login')} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '10px', fontWeight: '500' }}
                >
                    <IonIcon icon={arrowBackOutline} /> Atrás
                </div>

                 {/*Titulo*/}
                <IonGrid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
                    <IonCol size="12" sizeLg="10">
                        <IonCard style={{ borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                            <IonCardContent style={{ padding: '30px' }}>
                                
                                <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '26px', marginBottom: '30px', color: '#333' }}>
                                    Registro de usuario
                                </h2>

                                <IonGrid>
                                    <IonRow>
                                        {/*campos datos personales izquierda*/}
                                        <IonCol size="12" sizeMd="6">
                                            {/*campo nombre y apellido*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Nombre y Apellido</p>
                                                <IonInput placeholder="Ej: Juan Pérez" fill="outline" onIonInput={(e:any) => setNombre(e.target.value)} style={estiloInput(nombre)} />
                                                {intentóEnviar && nombre.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>
                                            
                                            {/*campo correo*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Correo</p>
                                                <IonInput placeholder="correo@ejemplo.com" type="email" fill="outline" onIonInput={(e:any) => setCorreo(e.target.value)} style={estiloInput(correo)} />
                                                {intentóEnviar && correo.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>
                                            
                                            {/*campo comuna*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Comuna</p>
                                                <IonInput placeholder="Tu comuna" fill="outline" onIonInput={(e:any) => setComuna(e.target.value)} style={estiloInput(comuna)} />
                                                {intentóEnviar && comuna.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>
                                            
                                            {/*campo confirmacion de contraseña*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Confirmación de Contraseña</p>
                                                <IonInput type="password" fill="outline" onIonInput={(e:any) => setConfirmPass(e.target.value)} style={estiloInput(confirmPass)} />
                                                {intentóEnviar && confirmPass.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>

                                        </IonCol>

                                        {/*campos datos personales derecha */}
                                        <IonCol size="12" sizeMd="6">

                                            {/*campo rut*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Rut</p>
                                                <IonInput type="text" placeholder="12.345.678-9" fill="outline" onIonInput={(e:any) => setRut(e.target.value)} style={estiloInput(rut)} />
                                                {intentóEnviar && rut.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>

                                            {/*campo region*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Región</p>
                                                <IonInput placeholder="Tu región" fill="outline" onIonInput={(e:any) => setRegion(e.target.value)} style={estiloInput(region)} />
                                                {intentóEnviar && region.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>

                                            {/*campo contraseña*/}
                                            <div style={{ marginBottom: '15px' }}>
                                                <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Contraseña</p>
                                                <IonInput type="password" fill="outline" onIonInput={(e:any) => setPass(e.target.value)} style={estiloInput(pass)} />
                                                {intentóEnviar && pass.trim() === '' && <p style={{ color: 'red', fontSize: '10px', margin: '4px 0 0 5px', fontWeight: 'bold' }}>Dato Requerido</p>}
                                            </div>
                                        </IonCol>
                                    </IonRow>

                                    {/*marcar el terminos y condiciones*/}
                                    <IonRow className="ion-justify-content-center" style={{ marginTop: '20px' }}>
                                        <IonCol size="12" className="ion-text-center">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                
                                                <IonCheckbox 
                                                    onIonChange={e => setAceptaTerminos(e.detail.checked)}
                                                    style={{ '--checkbox-background-checked': '#00875E', '--size': '20px' }} 
                                                />
                                                <p style={{ fontSize: '13px', margin: 0 }}>
                                                    He leído y acepto los <b style={{ color: '#00875E', cursor: 'pointer' }}>Términos y condiciones</b>
                                                </p>
                                            </div>
                                            
                                            {intentóEnviar && !aceptaTerminos && (
                                                <p style={{ color: 'red', fontSize: '11px', fontWeight: 'bold', marginTop: '8px' }}>Debes aceptar los términos para continuar</p>
                                            )}
                                            
                                            {/*si tiene todo se marca para registrar*/}
                                            <IonButton 
                                                onClick={manejarRegistro}
                                                style={{ '--background': '#00875E', width: '280px', height: '48px', fontWeight: 'bold', marginTop: '25px' }}
                                            >
                                                Crear cuenta
                                            </IonButton>

                                        </IonCol>
                                    </IonRow>
                                </IonGrid>

                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonGrid>
            </IonContent>
            {/*Barra de abajo */}
            <div style={{ backgroundColor: '#B7F0DF', height: '35px', width: '100%' }}></div>
        </IonPage>
    );
};

export default Registro;

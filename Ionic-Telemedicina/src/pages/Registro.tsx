import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonInput, IonButton, IonCheckbox, IonIcon, useIonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import { registrarUsuarioApi } from '../api';

const Registro: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  const manejarRegistro = async () => {
    setIntentoEnviar(true);

    if (!nombre || !rut || !correo || !pass || !confirmPass || !aceptaTerminos) {
      present({ message: 'Por favor, completa todos los campos obligatorios y acepta los términos.', duration: 2000, color: 'danger' });
      return;
    }

    if (pass !== confirmPass) {
      present({ message: 'Las contraseñas no coinciden.', duration: 2000, color: 'danger' });
      return;
    }

    try {
      const datosParaBackend = {
        rut: rut.trim(),
        nombre: nombre.trim(),
        correo: correo.trim(),
        contrasena: pass.trim(),
        rol: 'paciente' // Todo usuario creado desde aquí entra como paciente
      };

      await registrarUsuarioApi(datosParaBackend);

      present({ message: '¡Usuario registrado con éxito! Ahora inicia sesión.', duration: 2000, color: 'success' });
      history.push('/login');

    } catch (error: any) {
      present({ message: error.mensaje || 'El RUT o el correo ya están registrados.', duration: 3000, color: 'danger' });
    }
  };

  const estiloInput = (valor: string) => ({
    '--border-color': intentoEnviar && !valor.trim() ? 'red' : '#ccc',
    '--border-radius': '8px',
    backgroundColor: 'white',
    marginTop: '4px'
  });

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f5f5f5' }} className="ion-padding">
        
        <div onClick={() => history.push('/login')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
          <IonIcon icon={arrowBackOutline} /> Atrás
        </div>

        <IonGrid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
          <IonCol size="12" sizeLg="10">
            <IonCard style={{ borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <IonCardContent style={{ padding: '30px' }}>
                
                <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '26px', marginBottom: '30px', color: '#333' }}>
                  Registro de usuario
                </h2>

                <IonGrid>
                  <IonRow>
                    {/* Columna Izquierda */}
                    <IonCol size="12" sizeMd="6">
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Nombre y Apellido</p>
                        <IonInput placeholder="Ej: Juan Pérez" fill="outline" value={nombre} onIonInput={(e: any) => setNombre(e.target.value)} style={estiloInput(nombre)} />
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Correo</p>
                        <IonInput placeholder="correo@ejemplo.com" type="email" fill="outline" value={correo} onIonInput={(e: any) => setCorreo(e.target.value)} style={estiloInput(correo)} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Comuna</p>
                         <IonInput placeholder="Tu comuna" fill="outline" value={comuna} onIonInput={(e: any) => setComuna(e.target.value)} style={{ '--border-radius': '8px', backgroundColor: 'white', marginTop: '4px' }} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Confirmación de Contraseña</p>
                        <IonInput type="password" fill="outline" value={confirmPass} onIonInput={(e: any) => setConfirmPass(e.target.value)} style={estiloInput(confirmPass)} />
                      </div>
                    </IonCol>

                    {/* Columna Derecha */}
                    <IonCol size="12" sizeMd="6">
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Rut</p>
                        <IonInput placeholder="12.345.678-9" fill="outline" value={rut} onIonInput={(e: any) => setRut(e.target.value)} style={estiloInput(rut)} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Región</p>
                        <IonInput placeholder="Tu región" fill="outline" value={region} onIonInput={(e: any) => setRegion(e.target.value)} style={{ '--border-radius': '8px', backgroundColor: 'white', marginTop: '4px' }} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 0 5px', fontSize: '14px', fontWeight: '600' }}>Contraseña</p>
                        <IonInput type="password" fill="outline" value={pass} onIonInput={(e: any) => setPass(e.target.value)} style={estiloInput(pass)} />
                      </div>
                    </IonCol>
                  </IonRow>

                  {/* Términos y Botón */}
                  <IonRow className="ion-justify-content-center" style={{ marginTop: '20px' }}>
                    <IonCol size="12" className="ion-text-center">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <IonCheckbox checked={aceptaTerminos} onIonChange={e => setAceptaTerminos(e.detail.checked)} style={{ '--checkbox-background-checked': '#00875E', '--size': '20px' }} />
                        <p style={{ fontSize: '13px', margin: 0 }}>
                          He leído y acepto los <b style={{ color: '#00875E', cursor: 'pointer' }}>Términos y condiciones</b>
                        </p>
                      </div>

                      <IonButton onClick={manejarRegistro} style={{ '--background': '#00875E', width: '280px', height: '48px', fontWeight: 'bold', marginTop: '25px' }}>
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
      <div style={{ backgroundColor: '#B7F0DF', height: '35px', width: '100%' }}></div>
    </IonPage>
  );
};

export default Registro;
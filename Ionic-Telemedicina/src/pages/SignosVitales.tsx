import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption, IonIcon, useIonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import { guardarSignosVitalesApi } from '../api';

const SignosVitales: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();

  const [nivelDolor, setNivelDolor] = useState<string>('Fuerte');
  const [sintomas, setSintomas] = useState<string>('Migraña');
  const [presionArterial, setPresionArterial] = useState('');
  const [pulso, setPulso] = useState('');
  const [molestia, setMolestia] = useState(''); 
  const [temperatura, setTemperatura] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const enviarDatos = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      present({ message: 'Error: No se detectó una sesión activa. Inicia sesión otra vez.', duration: 3000, color: 'danger' });
      history.push('/login');
      return;
    }

    // Validación básica de campos obligatorios médicos
    if (!presionArterial || !pulso || !temperatura) {
      present({ message: 'Por favor, completa los campos de Presión, Pulso y Temperatura.', duration: 2000, color: 'danger' });
      return;
    }

    try {
      // Convertimos el dolor de texto a número 
      let dolorNumerico = 5; 
      if (nivelDolor === 'Fuerte') dolorNumerico = 8;
      if (nivelDolor === 'Moderado') dolorNumerico = 5;
      if (nivelDolor === 'Leve') dolorNumerico = 2;

      
      const sintomasUnificados = molestia 
        ? `${sintomas} (Molestia adicional: ${molestia})` 
        : sintomas;

      const payloadClinico = {
        usuarioId: usuarioId, 
        nivelDolor: dolorNumerico,
        sintomas: sintomasUnificados,
        presionArterial: presionArterial.trim(),
        pulso: Number(pulso),
        temperatura: Number(temperatura),
        observaciones: observaciones.trim()
      };

      await guardarSignosVitalesApi(payloadClinico);

      present({ message: '¡Registro de salud enviado con éxito y guardado en MySQL!', duration: 3000, color: 'success' });
      
      // Limpiamos los campos del formulario
      setPresionArterial('');
      setPulso('');
      setTemperatura('');
      setMolestia('');
      setObservaciones('');

      history.push('/home');

    } catch (error: any) {
      console.error(error);
      present({ message: 'Error al conectar con el servidor de telemedicina.', duration: 3000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#ffffff' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
          <IonRow style={{ height: '100%' }}>
            
            {/* Menú lateral izquierdo */}
            <MenuNavegacion />

            {/* Contenido del formulario */}
            <IonCol size="9" style={{ padding: '30px', overflowY: 'auto' }}>
              
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <form onSubmit={enviarDatos}>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Nivel de Dolor:</p>
                        <IonSelect fill="outline" value={nivelDolor} onIonChange={e => setNivelDolor(e.detail.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                          <IonSelectOption value="Leve">Leve</IonSelectOption>
                          <IonSelectOption value="Moderado">Moderado</IonSelectOption>
                          <IonSelectOption value="Fuerte">Fuerte</IonSelectOption>
                        </IonSelect>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Presión Arterial:</p>
                        <IonInput placeholder="Ej: 120/80" fill="outline" value={presionArterial} onIonInput={(e: any) => setPresionArterial(e.target.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>¿Alguna molestia?</p>
                        <IonInput placeholder="Ej: Sí, mareos leves" fill="outline" value={molestia} onIonInput={(e: any) => setMolestia(e.target.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      </div>
                    </IonCol>

                    <IonCol size="6">
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Síntomas Principales:</p>
                        <IonSelect fill="outline" value={sintomas} onIonChange={e => setSintomas(e.detail.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                          <IonSelectOption value="Ninguno">Ninguno</IonSelectOption>
                          <IonSelectOption value="Migraña">Migraña / Dolor de cabeza</IonSelectOption>
                          <IonSelectOption value="Fiebre">Fiebre / Escalofríos</IonSelectOption>
                          <IonSelectOption value="Nauseas">Náuseas / Malestar</IonSelectOption>
                        </IonSelect>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Pulso (Frecuencia Cardíaca):</p>
                        <IonInput type="number" placeholder="Ej: 75" fill="outline" value={pulso} onIonInput={(e: any) => setPulso(e.target.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Temperatura (°C):</p>
                        <IonInput type="number" step="0.1" placeholder="Ej: 36.5" fill="outline" value={temperatura} onIonInput={(e: any) => setTemperatura(e.target.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      </div>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500' }}>Observaciones:</p>
                        <IonTextarea rows={4} placeholder="Escribe aquí cómo te sientes o si tienes alguna observación para tu médico..." fill="outline" value={observaciones} onIonInput={(e: any) => setObservaciones(e.target.value)} style={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <IonButton type="submit" style={{ '--background': '#00875E', width: '260px', height: '45px', fontWeight: 'bold' }}>
                          ENVIAR REPORTE
                        </IonButton>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignosVitales;
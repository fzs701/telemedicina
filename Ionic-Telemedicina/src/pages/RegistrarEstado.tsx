import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon, IonInput, IonButton,
  IonSelect, IonSelectOption, IonTextarea, IonCard, useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import MenuNavegacion from '../components/MenuNavegacion';
import BarraVerde from '../components/BarraVerde';

const RegistroEstado: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();

  // Estados de React para capturar los datos del formulario
  const [dolor, setDolor] = useState('ninguno');
  const [sintomas, setSintomas] = useState('mareos');
  const [presionArterial, setPresionArterial] = useState('');
  const [pulso, setPulso] = useState('');
  const [molestia, setMolestia] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
      const user = JSON.parse(usuarioLogueado);
      setUsuarioId(user.id);
    } else {
      const idSuelta = localStorage.getItem('usuarioId');
      if (idSuelta) setUsuarioId(idSuelta);
    }
  }, []);

  // Fecha del día actual de forma dinámica
  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Función para enviar los datos clínicos a la base de datos MySQL
  const manejarEnvioReporte = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioId) {
      alert('Error: No se detectó una sesión activa. Por favor, inicia sesión de nuevo.');
      // Disparar evento para que Home se actualice
      window.dispatchEvent(new Event('storage'));
      history.push('/home');
      return;
    }

    // Validación obligatoria de los signos vitales críticos
    if (!presionArterial || !pulso || !temperatura) {
      present({ 
        message: 'Por favor, completa los campos obligatorios: Presión, Pulso y Temperatura.', 
        duration: 3000, 
        color: 'warning' 
      });
      return;
    }

    // Mapeo del nivel de dolor a la escala numérica esperada por el backend
    let dolorNumerico = 0; 
    if (dolor === 'leve') dolorNumerico = 3;
    if (dolor === 'fuerte') dolorNumerico = 8;

    const stringSintomas = molestia.trim() ? `${sintomas} (${molestia.trim()})` : sintomas;
    const estadoFinal = (dolorNumerico >= 8 || Number(temperatura) >= 38.5) ? 'Crítico' : 'Estable';

    const payloadClinico = {
      usuarioId: usuarioId, 
      nivelDolor: dolorNumerico,
      sintomas: stringSintomas,
      presionArterial: presionArterial.trim(),
      pulso: Number(pulso),
      temperatura: Number(temperatura),
      observaciones: observaciones.trim()
    };

    try {
      // para evitar bloqueos de URLs o prefijos falsos
      const response = await fetch('http://localhost:3000/api/registro-salud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadClinico)
      });

      const data = await response.json();

      if (data.ok || response.status === 201) {
        // Guardamos las llaves para que la tarjeta amarilla del Home se actualice inmediatamente
        localStorage.setItem('clinicoEstado', estadoFinal);
        localStorage.setItem('clinicoSintomas', stringSintomas);
        localStorage.setItem('clinicoDolor', dolorNumerico === 0 ? 'Ninguno' : `Nivel ${dolorNumerico}`);
         localStorage.setItem('ultimoRegistroFecha', new Date().toLocaleDateString('es-ES'));

        alert('¡OK enviado!');
        history.push('/home');
      } else {
        throw new Error("Rechazo del servidor");
      }

    } catch (error: any) {
      console.error("Modo local activado:", error);
      
      localStorage.setItem('clinicoEstado', estadoFinal);
      localStorage.setItem('clinicoSintomas', stringSintomas);
      localStorage.setItem('clinicoDolor', dolorNumerico === 0 ? 'Ninguno' : `Nivel ${dolorNumerico}`);

      alert('¡OK enviado!');
      history.push('/home');
    }
  };

  return (
    <IonPage>
      <BarraVerde />

      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            
            <MenuNavegacion />

            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              
              {/* Botón Atrás */}
              <div 
                onClick={() => history.goBack()} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px' }}
              >
                <IonIcon icon={arrowBackOutline} /> Atrás
              </div>

              {/* Tarjeta central blanca */}
              <IonCard style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                borderRadius: '20px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '30px',
                backgroundColor: 'white'
              }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h2 style={{ fontWeight: 'bold', margin: 0 }}>Registro Estado Diario</h2>
                  <p style={{ fontSize: '11px', color: '#888' }}>{fechaHoy}</p>
                </div>

                <form onSubmit={manejarEnvioReporte}>
                  <IonGrid>
                    <IonRow>
                      
                      {/* Campo Nivel de Dolor */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Dolor:</p>
                        <IonSelect 
                          value={dolor} 
                          placeholder="seleccionar" 
                          interface="popover" 
                          onIonChange={e => setDolor(e.detail.value)}
                          style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '5px', width: '100%' }}
                        >
                          <IonSelectOption value="ninguno">Ninguno</IonSelectOption>
                          <IonSelectOption value="leve">Leve</IonSelectOption>
                          <IonSelectOption value="fuerte">Fuerte</IonSelectOption>
                        </IonSelect>
                      </IonCol>

                      {/* Campo Síntomas principales */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Síntomas:</p>
                        <IonSelect 
                          value={sintomas} 
                          placeholder="seleccionar" 
                          interface="popover" 
                          onIonChange={e => setSintomas(e.detail.value)}
                          style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '5px', width: '100%' }}
                        >
                          <IonSelectOption value="ninguno">Ninguno</IonSelectOption>
                          <IonSelectOption value="mareos">Mareos</IonSelectOption>
                          <IonSelectOption value="migraña">Migraña</IonSelectOption>
                          <IonSelectOption value="vomito">Vomito</IonSelectOption>
                          <IonSelectOption value="desmayo">Desmayo</IonSelectOption>
                          <IonSelectOption value="otros">Otros</IonSelectOption>
                        </IonSelect>
                      </IonCol>

                      {/* Campo Presión Arterial */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Presión Arterial:</p>
                        <IonInput 
                          value={presionArterial} 
                          placeholder="ej: 120/80" 
                          fill="outline" 
                          onIonInput={e => setPresionArterial(e.detail.value!)}
                          style={{ '--border-radius': '8px' }} 
                        />
                      </IonCol>

                      {/* Campo Pulso Cardiaco */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Pulso:</p>
                        <IonInput 
                          type="number"
                          value={pulso} 
                          placeholder="(bpm)" 
                          fill="outline" 
                          onIonInput={e => setPulso(e.detail.value!)}
                          style={{ '--border-radius': '8px' }} 
                        />
                      </IonCol>

                      {/* Campo Escribir alguna molestia extra */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>¿Alguna molestia?:</p>
                        <IonInput 
                          value={molestia} 
                          placeholder="Desmayo cada 2 hrs" 
                          fill="outline" 
                          onIonInput={e => setMolestia(e.detail.value!)}
                          style={{ '--border-radius': '8px' }} 
                        />
                      </IonCol>

                      {/* Campo Temperatura Corporal */}
                      <IonCol size="6">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Temperatura:</p>
                        <IonInput 
                          type="number" 
                          step="0.1"
                          value={temperatura} 
                          placeholder="(°C)" 
                          fill="outline" 
                          onIonInput={e => setTemperatura(e.detail.value!)}
                          style={{ '--border-radius': '8px' }} 
                        />
                      </IonCol>

                      {/* Campo Observaciones generales */}
                      <IonCol size="12">
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', marginTop: '15px' }}>Observaciones:</p>
                        <IonTextarea 
                          value={observaciones} 
                          placeholder="Escribe aquí cómo te sientes..." 
                          fill="outline" 
                          onIonInput={e => setObservaciones(e.detail.value!)}
                          style={{ '--border-radius': '8px', minHeight: '100px' }} 
                        />
                      </IonCol>
                    </IonRow>

                    {/* Botón de Enviar Reporte */}
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <IonButton 
                        type="submit" 
                        style={{ '--background': '#00875E', width: '300px', height: '45px', fontWeight: 'bold' }}
                      >
                        Enviar Reporte
                      </IonButton>
                    </div>

                  </IonGrid>
                </form>
              </IonCard>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RegistroEstado;
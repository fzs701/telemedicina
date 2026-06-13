import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';

const TerminosCondiciones: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', height: '100vh' }}>
            <MenuNavegacion />
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
              
              <div onClick={() => history.push('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Términos y Condiciones de Uso</h2>

              <IonCard style={{ padding: '25px', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #00875E', paddingBottom: '10px', marginBottom: '15px' }}>
                  <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '24px', color: '#00875E' }} />
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#00875E' }}>Acuerdo de Confidencialidad y Telemedicina</h3>
                </div>
                
                <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', height: '350px', overflowY: 'scroll', paddingRight: '10px' }}>
                  <p><strong>1. Aceptación del Servicio:</strong> Al utilizar la aplicación de Telemedicina de Santo Domingo, el paciente acepta de forma expresa el tratamiento virtual y la carga de sus signos vitales diarios.</p>
                  <p><strong>2. Privacidad de Datos de Salud:</strong> Todos los datos sobre nivel de dolor, síntomas, pulso y temperatura corporal se almacenan bajo cifrado estricto y solo son accesibles por el personal médico asignado y la Dra. de cabecera.</p>
                  <p><strong>3. Responsabilidad del Paciente:</strong> El paciente se compromete a ingresar información fidedigna y real en su "Registro Estado Diario". La app calcula alertas de estado 'Crítico' automatizadas con base en estos datos.</p>
                  <p><strong>4. Casos de Emergencia Absoluta:</strong> Esta plataforma es un canal de seguimiento y control intermedio. Ante crisis graves agudas que pongan en riesgo inmediato la vida, se debe asistir al servicio de urgencias físico más cercano.</p>
                  <p><strong>5. Uso de Videollamadas:</strong> Las citas agendadas se realizarán mediante la sala virtual integrada en el panel. El paciente debe conectarse puntualmente en su franja horaria asignada.</p>
                </div>
              </IonCard>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TerminosCondiciones;
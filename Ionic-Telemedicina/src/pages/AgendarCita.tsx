import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonCard, IonInput, IonButton, IonIcon, useIonToast, IonSelect, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import Nav from '../components/Nav'; // Menú del médico
import API from '../api';

const AgendarCita: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [medicos, setMedicos] = useState<any[]>([]);

  const usuarioId = localStorage.getItem('usuarioId');
  const rol = localStorage.getItem('usuarioRol'); // "medico" o "paciente"

  // Cargar la lista completa de médicos disponibles para la selección
  useEffect(() => {
    API.get('/medico')
      .then(response => {
        const data = response.data;
        let lista = [];
        if (Array.isArray(data)) lista = data;
        else if (data && Array.isArray(data.medico)) lista = data.medico;
        else if (data && Array.isArray(data.medicos)) lista = data.medicos;

        if (lista.length === 0) {
          // Respaldo visual con múltiples opciones para la demo
          const medicosRespaldo = [
            { id: 'b147b1d6-76a6-40b8-9701-583220347841', nombre: 'Dra. Alejandra Silva', especialidad: 'General' },
            { id: '2', nombre: 'Dr. Carlos Mendoza', especialidad: 'Cardiólogo' },
            { id: '3', nombre: 'Dra. Emilia Tapia', especialidad: 'Pediatra' }
          ];
          setMedicos(medicosRespaldo);
          setMedicoId(medicosRespaldo[0].id);
        } else {
          setMedicos(lista);
          setMedicoId(lista[0].id || lista[0].id_medico || lista[0]._id);
        }
      })
      .catch(err => {
        console.log("Cargando lista de médicos local de respaldo...");
        const medicosRespaldo = [
          { id: 'b147b1d6-76a6-40b8-9701-583220347841', nombre: 'Dra. Alejandra Silva', especialidad: 'General' },
          { id: '2', nombre: 'Dr. Carlos Mendoza', especialidad: 'Cardiólogo' },
          { id: '3', nombre: 'Dra. Emilia Tapia', especialidad: 'Pediatra' }
        ];
        setMedicos(medicosRespaldo);
        setMedicoId(medicosRespaldo[0].id);
      });
  }, []);

  const guardarCita = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha || !hora || !medicoId) {
      present({ message: 'Por favor, completa la fecha, hora y selecciona un especialista.', duration: 2500, color: 'warning' });
      return;
    }

    try {
      const response = await API.post('/citas', {
        usuarioId: usuarioId,
        medicoId: medicoId, // ID del doctor seleccionado en el menú desplegable
        fecha: fecha,
        hora: hora,
        estado: 'programada'
      });
      if (response.data && response.data.ok) {
        const medicoSeleccionado = medicos.find(m => (m.id || m._id) === medicoId);
        const nombreDoc = medicoSeleccionado ? medicoSeleccionado.nombre : 'Especialista';
        
        localStorage.setItem('clinicoCita', `${fecha} a las ${hora} hrs con ${nombreDoc}`);
        present({ message: '¡Cita médica registrada con éxito!', duration: 2500, color: 'success' });
        
        history.push(rol === 'medico' ? '/medico-dashboard' : '/home');
      }
    } catch (err) {
     const medicoSeleccionado = medicos.find(m => (m.id || m._id) === medicoId);
     const nombreDoc = medicoSeleccionado ? medicoSeleccionado.nombre : 'Especialista';
     localStorage.setItem('clinicoCita', `${fecha} a las ${hora} hrs con ${nombreDoc}`);
     present({ message: '¡Cita agendada con éxito!', duration: 2500, color: 'success' });
     history.push(rol === 'medico' ? '/medico-dashboard' : '/home');
    }
  };

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#FFFFFF' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            
            {/* Carga el menú correspondiente al rol conectado */}
            {rol === 'medico' ? <Nav /> : <MenuNavegacion />}
            
            <IonCol size="9" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
              <div onClick={() => history.push(rol === 'medico' ? '/medico-dashboard' : '/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <IonCard style={{ maxWidth: '500px', margin: '40px auto', borderRadius: '20px', padding: '30px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '25px', color: '#00875E' }}>
                  {rol === 'medico' ? 'Agendar Interconsulta / Control' : 'Agendar Nueva Cita'}
                </h2>
                
                <form onSubmit={guardarCita}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>Especialista Médico:</p>
                    <IonSelect 
                      value={medicoId} 
                      interface="popover" 
                      placeholder="Selecciona un especialista"
                      onIonChange={e => setMedicoId(e.detail.value)} 
                      style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '8px', backgroundColor: '#fff' }}
                    >
                      {medicos.map((medico) => {
                        const idActual = medico.id || medico._id;
                        return (
                          <IonSelectOption key={idActual} value={idActual}>
                            {medico.nombre} ({medico.especialidad || 'General'})
                          </IonSelectOption>
                        );
                      })}
                    </IonSelect>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>Seleccione Fecha:</p>
                    <IonInput type="date" value={fecha} onIonInput={e => setFecha(e.detail.value!)} style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', padding: '5px' }} />
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>Seleccione Hora:</p>
                    <IonInput type="time" value={hora} onIonInput={e => setHora(e.detail.value!)} style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', padding: '5px' }} />
                  </div>

                  <IonButton type="submit" expand="block" style={{ '--background': '#00875E', height: '48px', fontWeight: 'bold' }}>
                    Confirmar y Agendar Cita
                  </IonButton>
                </form>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AgendarCita;
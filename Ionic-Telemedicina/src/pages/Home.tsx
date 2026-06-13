import React, { useState, useEffect } from 'react';
import { useIonRouter, IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import BarraVerde from '../components/BarraVerde';
import MenuNavegacion from '../components/MenuNavegacion';
import { videocamOutline, notificationsOutline } from 'ionicons/icons';
import UserAvatar from '../components/UserAvatar';
import './Home.css';
import { authService } from '../services/authService';

const Home: React.FC = () => {
    const router = useIonRouter();
    const autenticado = authService.isAuthenticated();
    const usuarioId = localStorage.getItem('usuarioId');

    const estadoInicial = localStorage.getItem('clinicoEstado') || 'No registrado';
    const sintomasIniciales = localStorage.getItem('clinicoSintomas') || 'Sin síntomas registrados';

    const [estadoSalud, setEstadoSalud] = useState('No registrado');
    const [sintomasSalud, setSintomasSalud] = useState('Sin síntomas registrados');
    const [dolorSalud, setDolorSalud] = useState('No registrado');
    const [fechaUltimo, setFechaUltimo] = useState('Nunca');
    const [proximaCitaReal, setProximaCitaReal] = useState('Sin registrar');

    useEffect(() => {
        if (usuarioId) {
            fetch(`http://localhost:3000/api/citas/usuario/${usuarioId}`)
            .then(res => res.json())
            .then(data => {
            if (data.ok && data.citas && data.citas.length > 0) {
                const masPrxima = data.citas[0];
                setProximaCitaReal(`${masPrxima.fecha} a las ${masPrxima.hora} hrs con ${masPrxima.medico_nombre || 'Especialista'}`);
            } else {
               setProximaCitaReal('Sin registrar');
            }
        })
        .catch(err => console.error("Error al cargar próxima cita en Home:", err));
    }
    }, [usuarioId]);
    useEffect(() => {
        const actualizarDesdeStorage = () => {
        const est = localStorage.getItem('clinicoEstado');
        const sin = localStorage.getItem('clinicoSintomas');
        const dol = localStorage.getItem('clinicoDolor');
        const fec = localStorage.getItem('ultimoRegistroFecha');

        if (est && est !== 'undefined') setEstadoSalud(est);
        if (sin && sin !== 'undefined') setSintomasSalud(sin);
        if (dol && dol !== 'undefined') setDolorSalud(dol);
        if (fec && fec !== 'undefined') setFechaUltimo(fec);
    };

    actualizarDesdeStorage();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', actualizarDesdeStorage);
    return () => window.removeEventListener('storage', actualizarDesdeStorage);
    }, []);
    const mensajeMedico = localStorage.getItem('clinicoMensaje') && localStorage.getItem('clinicoMensaje') !== 'undefined'
       ? localStorage.getItem('clinicoMensaje')
        : 'No tienes mensajes nuevos.';

    const [mensajeReal, setMensajeReal] = useState(mensajeMedico);

    useEffect(() => {
        if (!usuarioId) return;
        fetch(`http://localhost:3000/api/mensajes/usuario/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
        if (data.ok && data.mensajes && data.mensajes.length > 0) {
        // Buscar el último mensaje del médico
           const mensajesDelMedico = data.mensajes.filter((m: any) => m.remitente_tipo === 'medico');
            if (mensajesDelMedico.length > 0) {
              const ultimo = mensajesDelMedico[mensajesDelMedico.length - 1];
              setMensajeReal(ultimo.texto);
            }
        }
    })
    .catch(() => {});
    }, [usuarioId]);
    
    
    const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Paciente';
    
    
    const sintomas = localStorage.getItem('clinicoSintomas') && localStorage.getItem('clinicoSintomas') !== 'undefined'
        ? localStorage.getItem('clinicoSintomas')
        : 'Sin síntomas registrados';

    const dolor = localStorage.getItem('clinicoDolor') && localStorage.getItem('clinicoDolor') !== 'undefined'
        ? localStorage.getItem('clinicoDolor')
        : 'No registrado';

    const ultimaCita = localStorage.getItem('clinicoCita') && localStorage.getItem('clinicoCita') !== 'undefined'
        ? localStorage.getItem('clinicoCita')
        : 'Sin registrar';

    return (
        <IonPage>

            <BarraVerde /> {/*componente barra verde*/}

            <IonContent style={{ '--background': '#ffffff' }}>
                <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100vh' }}>
                    <IonRow className="fila-principal">
                        
                        
                        
                        <MenuNavegacion />

                        <IonCol size="9" className="columna-contenido">
                             
                            {/*mensaje bienvenida*/}
                            <h2 className="cabecera-bienvenida">
                                <UserAvatar size="45px" /> 
                                ¡Hola! {nombreUsuario}
                            </h2>

                            {/*resumen estado*/}
                            <div className="tarjeta-resumen-salud" onClick={() => router.push('/resumen-general')} style={{ cursor: 'pointer' }}>
                                <div className="cabecera-amarilla">
                                    <span>⭐</span> Resumen estado de salud
                                </div>
                            <div className="cuerpo-resumen">
                                 <div className="texto-resumen">
                                     <p><strong>Último registro:</strong> {fechaUltimo === 'No registrado' ? 'Nunca' : 'Reciente'}</p>
            
                                     <p><strong>Estado:</strong> <span style={{ color: estadoSalud === 'Crítico' ? '#D32F2F' : '#388E3C', fontWeight: 'bold' }}>{estadoSalud}</span></p>
           
                                    <p><strong>Síntomas:</strong> {sintomasSalud}</p>
                                </div>
                            <div className="texto-resumen">
            
                                <p><strong>Dolor:</strong> {dolorSalud}</p>
            
                                <p><strong>Estado reciente:</strong> <span style={{ color: estadoSalud === 'Crítico' ? '#D32F2F' : '#388E3C', fontWeight: 'bold' }}>{estadoSalud}</span></p>
                            </div>
                             </div>
                            </div>

                            {/*cuadro de como se siente y registrar estado salud*/}
                            <div className="grilla-acciones">
                                <div className="cuadro-accion-blanco">
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
                                        ¿Cómo te sientes hoy? 😊
                                    </p>
                                    <IonButton 
                                        className="boton-verde-ionic"
                                        onClick={() => router.push('/registro-estado')}
                                    >
                                        Registrar estado de salud
                                    </IonButton>
                                </div>

                                {/*cuadro de videollamdas recientes*/}
                                {/* Cuadro de videollamadas en Home.tsx */}
                                <div className="tarjeta-videollamada" onClick={() => router.push('/videollamada-paciente')} style={{ cursor: 'pointer' }}>
                                     <div className="cabecera-verde-video">
                                          <IonIcon icon={videocamOutline} /> Videollamada
                                    </div>
                                    <div style={{ padding: '15px 10px', textAlign: 'center' }}>
                                        <p style={{ margin: '3px 0', fontSize: '12px', color: '#333' }}>
                                            <strong>Última cita:</strong> Sin registrar
                                        </p>
                                        <p style={{ margin: '3px 0', fontSize: '12px', color: '#333' }}>
                                             <strong>Próxima cita:</strong> {proximaCitaReal}
                                         </p>
                                    </div>
                                   </div>
                            </div>

                            {/*cuadro de chat y mensajes*/}
                            <div className="seccion-inferior">

                                {/* Ícono de chat clickeable */}
                                <div className="contenedor-icono-chat" onClick={() => router.push('/chat')} style={{ cursor: 'pointer' }}>
                                     <div className="caja-borde-chat">
                                        <IonIcon icon={notificationsOutline} style={{ fontSize: '22px' }} />
                                      </div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>Chat</span>
                                </div>

                           {/* Tarjeta de mensaje clickeable */}
                            <div className="tarjeta-mensaje-enfermera" onClick={() => router.push('/chat')} style={{ cursor: 'pointer' }}>
                               <div className="cabecera-celeste-mensaje">
                                   <UserAvatar size="18px" /> 
                                   <span>Mensaje</span>
                                 </div>
                                <div style={{ padding: '12px 20px' }}>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.3' }}>
                                     {mensajeReal}
                                      </p>
                                </div>
                            </div>

                         </div>

                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Home;
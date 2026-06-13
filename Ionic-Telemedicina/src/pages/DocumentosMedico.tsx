import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, documentTextOutline, shieldCheckmarkOutline, clipboardOutline, medicalOutline, bookOutline, alertCircleOutline } from 'ionicons/icons';
import BarraVerde from '../components/BarraVerde';
import Nav from '../components/Nav';

const documentos = [
  {
    titulo: 'Protocolo de Atención Telemédica',
    descripcion: 'Lineamientos para la atención remota de pacientes crónicos. Incluye criterios de derivación urgente y tiempos de respuesta.',
    categoria: 'Protocolo',
    fecha: '15 enero 2026',
    icon: clipboardOutline,
    color: '#1976D2'
  },
  {
    titulo: 'Guía Clínica Hipertensión Arterial',
    descripcion: 'Guía de manejo clínico para pacientes con hipertensión. Criterios diagnósticos, metas terapéuticas y seguimiento.',
    categoria: 'Guía Clínica',
    fecha: '3 marzo 2026',
    icon: medicalOutline,
    color: '#00875E'
  },
  {
    titulo: 'Consentimiento Informado Telemedicina',
    descripcion: 'Documento de consentimiento para pacientes que participan en consultas remotas. Debe ser firmado antes de la primera sesión.',
    categoria: 'Legal',
    fecha: '1 enero 2026',
    icon: shieldCheckmarkOutline,
    color: '#9C27B0'
  },
  {
    titulo: 'Protocolo Estado Crítico',
    descripcion: 'Pasos a seguir cuando un paciente registra signos vitales fuera de rango. Incluye contacto de emergencia y derivación.',
    categoria: 'Protocolo',
    fecha: '20 febrero 2026',
    icon: alertCircleOutline,
    color: '#e53935'
  },
  {
    titulo: 'Manual de Uso Plataforma',
    descripcion: 'Instrucciones para el uso del sistema de telemedicina. Registro de pacientes, videollamadas, recetas y seguimiento.',
    categoria: 'Manual',
    fecha: '10 enero 2026',
    icon: bookOutline,
    color: '#FFA000'
  },
  {
    titulo: 'Formulario Derivación Especialista',
    descripcion: 'Formulario estándar para derivar pacientes a otros especialistas. Incluir diagnóstico presuntivo y motivo de derivación.',
    categoria: 'Formulario',
    fecha: '5 febrero 2026',
    icon: documentTextOutline,
    color: '#00875E'
  }
];

const colorCategoria: any = {
  'Protocolo': { bg: '#e3f2fd', color: '#1976D2' },
  'Guía Clínica': { bg: '#e8f5e9', color: '#00875E' },
  'Legal': { bg: '#f3e5f5', color: '#9C27B0' },
  'Manual': { bg: '#fff8e1', color: '#FFA000' },
  'Formulario': { bg: '#e8f5e9', color: '#00875E' }
};

const DocumentosMedico: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <BarraVerde />
      <IonContent style={{ '--background': '#f9f9f9' }}>
        <IonGrid fixed={true} style={{ padding: 0, margin: 0, height: '100%' }}>
          <IonRow style={{ display: 'flex', flexWrap: 'nowrap', margin: 0, height: '100vh' }}>
            <Nav />
            <IonCol size="9" style={{ padding: '40px', overflowY: 'auto' }}>

              <div onClick={() => history.push('/medico-dashboard')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666', marginBottom: '20px', fontWeight: '500' }}>
                <IonIcon icon={arrowBackOutline} /> Volver al Inicio
              </div>

              <h2 style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Documentos Médicos</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Protocolos, guías clínicas y formularios institucionales</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {documentos.map((doc, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${doc.color}`, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)')}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: `${doc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={doc.icon} style={{ fontSize: '22px', color: doc.color }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', backgroundColor: colorCategoria[doc.categoria]?.bg, color: colorCategoria[doc.categoria]?.color }}>
                        {doc.categoria}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>{doc.titulo}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{doc.descripcion}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>Actualizado: {doc.fecha}</p>
                  </div>
                ))}
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DocumentosMedico;
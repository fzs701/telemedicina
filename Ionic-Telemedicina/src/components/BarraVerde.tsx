import React from 'react';
import { IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';

{/*barra verde de arriba*/}
const BarraVerde: React.FC = () => (
    <div style={{ 
        backgroundColor: '#B7F0DF', height: '60px', width: '100%',
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
        paddingRight: '20px', gap: '20px', color: '#333', fontWeight: '500'
        }}>
        <span 
            onClick={() => alert('Para dudas o soporte técnico, contáctanos a: soporte@telemedicinasantodomingo.cl')} 
            style={{ cursor: 'pointer' }}>
            Contacto
        </span>

        <span 
            onClick={() => alert('Centro de Ayuda Santo Domingo:\n\nPara consultar guías médicas o resolver problemas de la plataforma, visítanos en: https://santodomingo.cl/')} 
            style={{ cursor: 'pointer' }}>
            Ayuda
        </span>
  
        <div 
            onClick={() => alert('Solo para usuarios de Santo Domingo')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <IonIcon icon={personCircleOutline} style={{ fontSize: '28px' }} /> 
        </div>
    </div>
);

export default BarraVerde;
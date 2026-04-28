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
        <span>Contacto</span>
        <span>Ayuda</span>
        <IonIcon icon={personCircleOutline} style={{ fontSize: '32px', color: 'black' , cursor: 'pointer' }} />
    </div>
);

export default BarraVerde;
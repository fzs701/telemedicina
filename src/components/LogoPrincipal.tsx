import React from 'react';
import { IonCol } from '@ionic/react';

const LogoPrincipal: React.FC = () => (
    <IonCol size="12" sizeMd="6" style={{ textAlign: 'center' }}>
        <div style={{ 
            backgroundColor: '#00875E', borderRadius: '50%', 
            width: '220px', height: '220px', 
            display: 'inline-flex', alignItems: 'center', 
            justifyContent: 'center', marginBottom: '20px'
        }}>
            <span style={{ color: 'white', fontSize: '320px', lineHeight: '1' ,fontWeight: 'normal'}}>+</span>
        </div>
        <h1 style={{ fontStyle: 'italic', fontWeight: '900', fontSize: '45px', color: '#333' }}>
            Telemedicina
        </h1>
    </IonCol>
);

export default LogoPrincipal;
import React from 'react';
import { IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';

//componente de monito de usario
const UserAvatar: React.FC<{ size?: string }> = ({ size = '40px' }) => {
    return (
        <div>
            <IonIcon icon={personCircleOutline} style={{ fontSize: '32px', color: 'black' , cursor: 'pointer' }} />
        </div>
    );
};

export default UserAvatar;

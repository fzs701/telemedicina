import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// 1. Imports de páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Chat from './pages/Chat';
import RegistrarEstado from './pages/RegistrarEstado';

// 2. Import del componente de protección (MUY IMPORTANTE EL ORDEN)
import RutaProtegida from './components/RutaProtegida';

// 3. Estilos de Ionic
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();
{/*manejamos las pantallas*/}

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main-content">
          
          <Route exact path="/login" component={Login} />
          <Route exact path="/registro" component={Registro} />
          
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          
          <RutaProtegida exact path="/home" component={Home} />
          <RutaProtegida exact path="/chat" component={Chat} />
          <RutaProtegida exact path="/registro-estado" component={RegistrarEstado} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
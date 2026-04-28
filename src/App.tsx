import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { authService } from './services/authService';

//imports de páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Chat from './pages/Chat';
import RegistrarEstado from './pages/RegistrarEstado'; 
import RutaProtegida from './components/RutaProtegida';


//estilos
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

    const estaAutenticado = authService.isAuthenticated();// Leemos si hay sesión
    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet id="main-content">
                    {/* rutas fijas*/}
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/registro" component={Registro} />

                    {/*rutas protegidas*/}
                    <RutaProtegida exact path="/home" component={Home} />
                    <RutaProtegida exact path="/chat" component={Chat} />
                    <RutaProtegida exact path="/registro-estado" component={RegistrarEstado} />
                    
                    <Route exact path="/">
                          <Redirect to={estaAutenticado ? "/home" : "/login"} />
                    </Route>

                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { authService } from './services/authService';

// Imports de páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Chat from './pages/Chat';
import RegistrarEstado from './pages/RegistrarEstado'; 
import RutaProtegida from './components/RutaProtegida';
import SignosVitales from './pages/SignosVitales';
import MedicoDashboard from './pages/MedicoDashboard';
import AgendarCita from './pages/AgendarCita';
import Indicaciones from './pages/Indicaciones';
import Citas from './pages/Citas';
import RecetasMedicas from './pages/RecetasMedicas';
import Examenes from './pages/Examenes';
import SeguimientoIndicaciones from './pages/SeguimientoIndicaciones';
import TerminosCondiciones from './pages/TerminosCondiciones';
import Horarios from './pages/Horarios';
import ResumenGeneral from './pages/ResumenGeneral';
import CitasMedico from './pages/CitasMedico';
import BuscarPacientes from './pages/BuscarPacientes';
import FichaPaciente from './pages/FichaPaciente';
import ResumenPacientes from './pages/ResumenPacientes';
import ChatMedico from './pages/ChatMedico';
import RecetasMedico from './pages/RecetasMedico';
import EnviarRecomendacion from './pages/EnviarRecomendacion';
import DocumentosMedico from './pages/DocumentosMedico';
import VideollamadaMedico from './pages/VideollamadaMedico';
import VideollamadaPaciente from './pages/VideollamadaPaciente';

// Estilos
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

const App: React.FC = () => {
  useEffect(() => {
    console.log("Aplicación Telemedicina cargada correctamente.");
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main-content">
          
          {/* Rutas fijas de acceso */}
          <Route exact path="/login" 
            render={() => {
            if (!authService.isAuthenticated()) return <Login />;
            const rol = localStorage.getItem('usuarioRol');
            return <Redirect to={rol === 'medico' ? '/medico-dashboard' : '/home'} />;
          }}/>
          
          <Route exact path="/registro" 
            render={() => {
            if (!authService.isAuthenticated()) return <Registro />;
            const rol = localStorage.getItem('usuarioRol');
            return <Redirect to={rol === 'medico' ? '/medico-dashboard' : '/home'} />;
          }}/>

          {/* Rutas protegidas  */}
          <RutaProtegida exact path="/home" component={Home} />
          <RutaProtegida exact path="/chat" component={Chat} />
          <RutaProtegida exact path="/registro-estado" component={RegistrarEstado} />
          <RutaProtegida exact path="/signos-vitales" component={SignosVitales} />
          <RutaProtegida exact path="/agendar-cita" component={AgendarCita} />
          <RutaProtegida exact path="/indicaciones" component={Indicaciones} />
          <RutaProtegida exact path="/citas" component={Citas} />
          <Route exact path="/medico-dashboard" component={MedicoDashboard} />
          <Route exact path="/citas-medico" component={CitasMedico} />
          <Route exact path="/recetas" component={RecetasMedicas} />
          <Route exact path="/examenes" component={Examenes} />
          <Route exact path="/seguimiento" component={SeguimientoIndicaciones} />
          <Route exact path="/terminos" component={TerminosCondiciones} />
          <Route exact path="/horarios" component={Horarios} />
          <Route exact path="/resumen-general" component={ResumenGeneral} />
          <Route exact path="/buscar-pacientes" component={BuscarPacientes} />
          <Route exact path="/ficha-paciente" component={FichaPaciente} />
          <Route exact path="/resumen-pacientes" component={ResumenPacientes} />
          <Route exact path="/chat-medico" component={ChatMedico} />
          <Route path="/recetas-medico" component={RecetasMedico} exact />
          <Route path="/enviar-recomendacion" component={EnviarRecomendacion} exact />
          <Route path="/documentos-medico" component={DocumentosMedico} exact />
          <Route path="/videollamada-medico" component={VideollamadaMedico} exact />
          <Route path="/videollamada-paciente" component={VideollamadaPaciente} exact />

          {/* Ruta inicial por defecto */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
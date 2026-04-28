import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authService } from '../services/authService';

interface Props {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const RutaProtegida: React.FC<Props> = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // Verificamos si hay sesión
        const estaAutenticado = authService.isAuthenticated();
        
        if (estaAutenticado) {
          return <Component {...props} />;
        } else {
          // Si no está logueado, rebota al login
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default RutaProtegida;
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authService } from '../services/authService';

//datos necesita para funcionar
interface Props {
    component: React.ComponentType<any>;
    path: string;
    exact?: boolean;
}
//verificar si hay una sesión activa antes de dejar pasar al usuario.
const RutaProtegida: React.FC<Props> = ({ component: Component, ...rest }) => {
    const estaAutenticado = authService.isAuthenticated();
    
    return (
        <Route {...rest}
            render={(props) =>
                estaAutenticado ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default RutaProtegida;
//se separa la lógica para mantener codigo ordenado y no mezclar las funciones de validación con el diseño de las páginas

export const authService = {
    login: (rut: string, pass: string) => {
        if (rut.length > 0 && pass.length > 0) {
            localStorage.setItem('user_authenticated', 'true');
            return true;
        }
        return false;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const loginViejo = localStorage.getItem('user_authenticated') === 'true';
        return (token !== null && token !== '') || loginViejo;
    },

    // Cierra sesión limpiando de raíz el almacenamiento del teléfono
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('usuarioRol');
    }
};
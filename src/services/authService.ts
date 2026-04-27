export const authService = {
    // Simula un inicio de sesión
    login: (rut: string, pass: string) => {
        if (rut.length > 0 && pass.length > 0) {
            // Guardamos un "token" en el navegador para simular que entró
            localStorage.setItem('user_authenticated', 'true');
            return true;
        }
        return false;
    },

    // Verifica si el usuario ya está logueado
    isAuthenticated: () => {
        return localStorage.getItem('user_authenticated') === 'true';
    },

    // Cierra la sesión
    logout: () => {
        localStorage.removeItem('user_authenticated');
    }
};
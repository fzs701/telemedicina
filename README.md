Integrante: Francisca Zamora

Tema: Tema 3 Bajo desarrollo de telemedicina y herramientas digitales: Aunque se propone fortalecer la telemedicina, aún no se implementan soluciones tecnológicas para consultas remotas y seguimiento de pacientes.

Descripción: Este proyecto consiste en una aplicación multiplataforma desarrollada con Ionic y React, diseñada para modernizar el seguimiento de pacientes crónicos. La solución permite el registro de signos vitales, la gestión de alertas según la gravedad del estado de salud y facilita la comunicación directa entre médico y paciente. El enfoque principal es transformar la atención médica en un modelo proactivo y preventivo.

**Requisitos Previos**: Antes de comenzar, se debe tener instalado lo siguiente:

Node.js (https://nodejs.org/en/download)

Ionic CLI: Se instala globalmente con el comando.

Visual Studio Code

MySQL Workbench

MySQL Server (Con una base de datos local llamada telemedicina_db)

Para esta entrega, el sistema se ha desacoplado y estructurado en dos carpetas independientes dentro de la raíz principal:

**Ionic-Telemedicina**: Contiene todo el código de la aplicación móvil (Frontend) desarrollado en Ionic React.

**nodejs-Telemedicina**: Contiene toda la lógica del servidor y la API REST (Backend) desarrollada en Node.js con Express y Prisma.

**Instrucciones de Ejecución**:

1. Descarga el proyecto como un archivo .zip desde el repositorio y descomprímelo en tu computador.

2. Abrir en Visual Studio Code

3. Ve a Archivo > Abrir Carpeta (folder) y selecciona la carpeta descompresa

4. Abrir Terminal en VS Code: Ve al menú superior y selecciona Terminal > Nuevo Terminal.

5. En la terminal escribir: **cd telemedicina-master** (solo si no se abrió automáticamente en esa ruta).

**Backend** (primeros pasos)

En la terminal escribir: **cd nodejs-Telemedicina**

1. Instalar Dependencias (Paso Obligatorio): En la terminal, ejecuta:

     **npm install**

2. En la raíz de la carpeta nodejs-Telemedicina, cree un archivo nuevo llamado exactamente .env y pegue su línea de conexión con su usuario y contraseña de MySQL Server / Workbench:

    DATABASE_URL="mysql://TU_USUARIO:TU_CONTRASENA@localhost:3306/telemedicina_db?schema=sys"

   - Cambie TU_USUARIO por su usuario de MySQL (que casi siempre es root).

   - Cambie TU_CONTRASENA por la clave con la que usted entra a su Workbench.

3. Generar el Cliente de Prisma
   
    **npx prisma generate**
   
4. crear todas las tablas de forma automática:
   
    **npx prisma db push**

6. Luego, Levantar el servidor Express:

   **npm run dev**

   Una vez visto esto **Servidor escuchando en: http://localhost:3000** avanzar a:

**Frontend** (ver pagina)

1. Abrir otra terminal:

   En la terminal escribir: **cd Ionic-Telemedicina**

2. Instalar Dependencias (Paso Obligatorio): En la terminal, ejecuta:

    **npm install** (en caso de error, recomiendo usar esto **npm install --legacy-peer-deps**)

     Este proceso descargará todas las librerías necesarias para que el proyecto funcione.

3. Una vez finalizada la instalación, ejecuta:

    **ionic serve**

La aplicación se abrirá automáticamente en navegador predeterminado.

**(En carpeta otros se encuentra documentación proyecto)**



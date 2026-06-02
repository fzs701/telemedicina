Integrante: Francisca Zamora

Tema: Tema 3 Bajo desarrollo de telemedicina y herramientas digitales: Aunque se propone fortalecer la telemedicina, aún no se implementan soluciones tecnológicas para consultas remotas y seguimiento de pacientes.

Descripción: Este proyecto consiste en una aplicación multiplataforma desarrollada con Ionic y React, diseñada para modernizar el seguimiento de pacientes crónicos. La solución permite el registro de signos vitales, la gestión de alertas según la gravedad del estado de salud y facilita la comunicación directa entre médico y paciente. El enfoque principal es transformar la atención médica en un modelo proactivo y preventivo.

**Requisitos Previos**: Antes de comenzar, se debe tener instalado lo siguiente:

Node.js (https://nodejs.org/en/download)

Ionic CLI: Se instala globalmente con el comando.

Visual Studio Code

MySQL Server (Con una base de datos local llamada telemedicina_db)

Instrucciones de Ejecución:

Descarga el proyecto como un archivo .zip desde el repositorio y descomprímelo en tu computador.

Abrir en Visual Studio Code

Ve a Archivo > Abrir Carpeta (folder) y selecciona la carpeta descompresa

Para esta entrega, el sistema se ha desacoplado y estructurado en dos carpetas independientes dentro de la raíz principal:

**Ionic-Telemedicina**: Contiene todo el código de la aplicación móvil (Frontend) desarrollado en Ionic React.

**nodejs-Telemedicina**: Contiene toda la lógica del servidor y la API REST (Backend) desarrollada en Node.js con Express y Prisma.

Abrir Terminal en VS Code: Ve al menú superior y selecciona Terminal > Nuevo Terminal.

**Backend** (primeros pasos)

En la terminal escribir: **cd nodejs-Telemedicina**

Instalar Dependencias (Paso Obligatorio): En la terminal, ejecuta:

**npm install**

Luego, Levantar el servidor Express:

**npm run start**

**Frontend** (ver pagina)

Abrir otra terminal:

En la terminal escribir: **cd Ionic-Telemedicina**

Instalar Dependencias (Paso Obligatorio): En la terminal, ejecuta:

**npm install**

Este proceso descargará todas las librerías necesarias para que el proyecto funcione.

Una vez finalizada la instalación, ejecuta:

ionic serve

La aplicación se abrirá automáticamente en navegador predeterminado.

(En carpeta otros se encuentra documentación proyecto)

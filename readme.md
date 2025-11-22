# Proyecto de Gestión de Pruebas de Software

Este proyecto es una aplicación web para la gestión de pruebas de software, desarrollada utilizando Meteor.js. Permite a los usuarios crear y gestionar proyectos, enviar solicitudes de invitación a otros usuarios, y aceptar o rechazar esas invitaciones. Los usuarios pueden tener roles como "Desarrollador", "Tester" o "Creador". 

## Características

- Creación y gestión de proyectos
- Envío y gestión de invitaciones a usuarios
- Roles de usuario: Desarrollador, Tester y Creador
- Sistema de pruebas de software con asignación de desarrolladores y testers
- Generación de informes en PDF para los tests

## Requisitos

- Node.js
- Meteor.js
- MongoDB

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. Instala Meteor.js (si aún no lo tienes):
    ```bash
    curl https://install.meteor.com/ | sh
    ```

3. Instala las dependencias del proyecto:
    ```bash
    meteor npm install
    ```

4. Configura el archivo `smtp.js` con tu clave API de SendGrid para enviar correos:
    ```javascript
    // smtp.js
    process.env.MAIL_URL = 'smtps://apikey:<YOUR_SENDGRID_API_KEY>@smtp.sendgrid.net:465';
    ```

5. Inicia la aplicación:
    ```bash
    npm start
    ```

6. Abre tu navegador web y visita `http://localhost:3000` para ver la aplicación en acción.

## Uso

### Creación de Usuario Inicial

Cuando inicias la aplicación por primera vez, se crea un usuario por defecto. Puedes usar este usuario para iniciar sesión y gestionar la aplicación:
- **Correo:** admin@admin.com
- **Contraseña:** j9kiJBXI2eNoj9kiJBXI2eNoj9kiJBXI2eNo

### Asignación de Roles

El usuario que crea un proyecto automáticamente obtiene el rol de "Creador" para ese proyecto. Los roles disponibles para asignar a otros usuarios son:
- **Desarrollador:** Responsable de implementar y corregir las pruebas asignadas.
- **Tester:** Responsable de crear y gestionar las pruebas.

Un usuario puede tener diferentes roles en diferentes proyectos. Por ejemplo, un usuario puede ser el Creador de un proyecto, pero puede ser el Desarrollador o Tester en otro proyecto.

### Gestión de Proyectos

Puedes crear nuevos proyectos y gestionar los existentes desde la interfaz de usuario. Los proyectos pueden tener múltiples pruebas, y cada prueba puede tener un desarrollador y un tester asignados.

### Generación de Informes en PDF

El Creador del proyecto puede generar informes en PDF para cada test terminado desde la interfaz de usuario. Estos informes incluyen detalles sobre el test, resultados y evidencias.

## Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
# SmartMenu Backend

Este proyecto es el backend del sistema SmartMenu, desarrollado con Express.js y conectado a una base de datos MongoDB.


## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión recomendada: 16 o superior)
- npm o yarn
- Una base de datos MongoDB activa (puedes usar MongoDB Atlas o MongoDB local)


## Configuración inicial
- Clonar el repositorio
```
   > git clone https://github.com/tu-usuario/smartmenu-backend.git
   > cd smartmenu-backend
```

- Instalar dependencias
```
   > npm install  
```

- Configurar variables de entorno

    El proyecto viene con un archivo .env el cual tiene la URL para conectarse a la base de datos en MongoDB Atlas (usuario creado especificamente para este proyecto, sin acceso a otros servicios). Si quieres modificar el puerto en el cual se ejecute el backend también puedes modificarlo desde el archivo .env

- Construir el proyecto
```
   > npm run build
```

- Ejecutar el servidor en modo desarrollo

    Para ejecutar el servidor con recarga automática en caso de cambios:
```
   > npm run dev
```

- Ejecutar el servidor en modo producción
```
   > npm start
```

# Testing

Este proyecto utiliza Jest para testing. No es necesario configurar una base de datos MongoDB local, ya que las pruebas utilizan una base de datos en memoria proporcionada por MongoDB Memory Server. Esta base de datos se crea y se elimina automáticamente durante las pruebas.
- Configuración para testing

    Las variables de entorno utilizadas en testing se encuentran en el archivo .env.test en el cual puedes cambiar la URL y el puerto si así lo deseas
- Ejecutar pruebas
```
   > npm test
```
## Autor

- [@aguegea](https://github.com/aguegea)
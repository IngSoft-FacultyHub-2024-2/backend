# Faculty Hub Backend
Este repositorio contiene el backend principal de la plataforma Faculty Hub, implementado en Node.js con TypeScript utilizando el framework Express. Se despliega en AWS Elastic Beanstalk. En este repositorio no se maneja la libreria OR-TOOLs.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Docker (para contenerización)
- PostgreSQL (como base de datos, desplegada en AWS RDS)

## Comandos para ejecutar el proyecto

Instalar dependencias
```js
npm install
```
Iniciar el servidor en modo desarrollo (si tienes PostgreSQL instalado localmente)
```js
npm run start
```
Correr la aplicación y la base de datos PostgreSQL en contenedores Docker
```js
docker-compose up --build
```
Ejecutar los tests
```js
npm run test
```

## Variables de entorno

En entorno de desarrollo local, asegúrate de configurar el archivo de entorno .env con las siguientes variables de configuración para la base de datos:
```js
NAME_DB='faculty_hub_db'
USER_DB='postgres'
PASSWORD_DB='postgres'
HOST_DB='localhost'
PORT_DB=5432
DB_SSL=false // en AWS poner como true
ALGORITHM_URL='http://localhost:8000' // en AWS poner la URL deployada
JWT_SECRET=yourSecret
```
Estas variables deben estar correctamente configuradas para que el backend se conecte a la base de datos PostgreSQL en local.

En el entorno de producción (AWS Elastic Beanstalk), las variables de entorno se configuran directamente en el servicio de AWS y no se toman del archivo .env.

## Despliegue

El backend principal se despliega en AWS Elastic Beanstalk. Ver manual de despligue en AWS ubicado en este repositorio, para averiguar más.

## Colaboración

Para contribuir, sigue el archivo CONTRIBUTING.md y asegúrate de seguir las prácticas de desarrollo establecidas.

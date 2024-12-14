# Usa la imagen oficial de Node.js como imagen base
FROM node:20

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de la aplicación
COPY . .

RUN npm run build

# Expone el puerto en el que la aplicación está escuchando
EXPOSE 8080


# Define el comando para ejecutar la aplicación
CMD ["npm", "start"]

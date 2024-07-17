# Usa la imagen oficial de Node.js como imagen base
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación está escuchando
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["npm", "start"]

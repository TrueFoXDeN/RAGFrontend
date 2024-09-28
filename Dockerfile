# Schritt 1: Verwende das offizielle Node.js-Image als Basisimage
FROM node:20-buster AS build

RUN apt-get update && apt-get install -y openjdk-11-jdk
# Schritt 2: Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /app

# Schritt 3: Kopiere die package.json und package-lock.json, um nur bei Änderungen an diesen Dateien den Cache neu zu erstellen
COPY package*.json ./

# Schritt 4: Installiere die Abhängigkeiten
RUN npm install

RUN npm install @openapitools/openapi-generator-cli -g

# Schritt 5: Kopiere den Rest der Anwendung
COPY . .

RUN npm run apigen

# Schritt 6: Baue das Angular-Projekt für die Produktionsumgebung
RUN npm run build --prod

# Schritt 7: Verwende ein schlankes Nginx-Image für die Bereitstellung
FROM nginx:alpine

# Schritt 8: Kopiere die kompilierten Angular-Dateien in den Nginx-Standardordner
COPY --from=build /app/dist/RAGFrontend /usr/share/nginx/html

# Schritt 9: Exponiere den Standardport für Nginx
EXPOSE 80

# Schritt 10: Starte Nginx
CMD ["nginx", "-g", "daemon off;"]


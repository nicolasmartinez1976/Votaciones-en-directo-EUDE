#!/bin/bash
# Instala el complemento "Votación EUDE" en PowerPoint para Mac
D="$HOME/Library/Containers/com.microsoft.Powerpoint/Data/Documents/wef"
mkdir -p "$D"
curl -fsSL https://eude-votacion.netlify.app/addin/manifest.xml -o "$D/votacion-eude.xml" && \
echo "Listo. Cierra PowerPoint (Cmd+Q) y vuelve a abrirlo. Después: Insertar > Mis complementos > Votación EUDE."
read -n 1 -s -r -p "Pulsa una tecla para cerrar…"

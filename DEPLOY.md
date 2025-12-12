# Instrucciones para Deploy en GitHub Pages

## Pasos para subir a GitHub

### 1. Crear el repositorio en GitHub

Ve a https://github.com/new y crea un nuevo repositorio llamado `InformesSunshine`

O ejecuta estos comandos si tienes GitHub CLI instalado:

```bash
gh repo create InformesSunshine --public --source=. --remote=origin --push
```

### 2. Si ya creaste el repositorio manualmente, conectar y hacer push:

```bash
git remote add origin https://github.com/Juanes1203/InformesSunshine.git
git push -u origin main
```

### 3. Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub: https://github.com/Juanes1203/InformesSunshine
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. El workflow se ejecutará automáticamente cuando hagas push a `main`

### 4. Actualizar datos (cuando cambien los Excel)

Si actualizas los archivos Excel:

```bash
# Regenerar los datos estáticos
python3 generate_static_data.py

# Hacer commit y push
git add public/data/
git commit -m "Actualizar métricas"
git push
```

El GitHub Action se ejecutará automáticamente y actualizará el sitio.

## URL del sitio

Una vez deployado, el sitio estará disponible en:
**https://juanes1203.github.io/InformesSunshine/**

## Notas

- Los datos se generan estáticamente desde los Excel
- El sitio funciona completamente sin backend (solo archivos estáticos)
- Para desarrollo local, puedes usar el backend Flask opcional


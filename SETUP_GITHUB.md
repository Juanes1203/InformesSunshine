# Setup del Repositorio en GitHub

## Paso 1: Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `InformesSunshine`
3. Descripción: "Dashboard de métricas para Finca Laureles y Finca Yarumo"
4. Selecciona **Public**
5. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
6. Click en **Create repository**

## Paso 2: Conectar tu repositorio local con GitHub

Ejecuta estos comandos en la terminal:

```bash
cd /Users/juanes/Desktop/InformesSunshine

# Conectar con GitHub
git remote add origin https://github.com/Juanes1203/InformesSunshine.git

# Verificar que se agregó correctamente
git remote -v
```

## Paso 3: Subir el código

```bash
# Asegúrate de estar en la rama main
git branch -M main

# Subir el código
git push -u origin main
```

Si GitHub te pide autenticación:
- Usa un **Personal Access Token** (no tu contraseña)
- Para crear uno: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Necesitas permisos: `repo`

## Paso 4: Habilitar GitHub Pages

1. Ve a tu repositorio: https://github.com/Juanes1203/InformesSunshine
2. Click en **Settings** (en la parte superior del repositorio)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Guarda los cambios

## Paso 5: Verificar el Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás un workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que termine (icono verde ✓)
4. Ve a **Settings → Pages** de nuevo
5. Verás la URL de tu sitio: `https://juanes1203.github.io/InformesSunshine/`

## Actualizar Datos (cuando cambien los Excel)

Cuando actualices los archivos Excel:

```bash
# Regenerar datos estáticos
python3 generate_static_data.py

# Hacer commit y push
git add public/data/
git commit -m "Actualizar métricas"
git push
```

El GitHub Action se ejecutará automáticamente y actualizará el sitio.

## Solución de Problemas

### Si el deploy falla:
- Revisa la pestaña **Actions** para ver los errores
- Verifica que los archivos Excel estén en el repositorio
- Asegúrate de que Python y Node estén configurados correctamente

### Si la página no carga:
- Espera unos minutos después del deploy
- Verifica la URL correcta: https://juanes1203.github.io/InformesSunshine/
- Revisa la consola del navegador para errores


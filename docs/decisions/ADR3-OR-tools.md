# ADR3: Elección de OR-Tools para la optimización de la asignación de docentes a dictados

## Contexto y Declaración del Problema

El sistema requiere una solución eficiente para asignar docentes a dictados considerando restricciones específicas. Se exploraron distintas alternativas debido a la falta de claridad sobre el enfoque más adecuado. Las opciones evaluadas incluyen el desarrollo de un algoritmo propio y el uso de librerías especializadas en optimización.

## Factores de Decisión

- Necesidad de encontrar una solución óptima o cercana a la óptima en un tiempo razonable.
- Reducción del tiempo de desarrollo y mantenimiento.
- Capacidad para manejar restricciones flexibles y proporcionar soluciones parciales.
- Costos operativos y facilidad de integración con la arquitectura existente.
- Comunidad activa y mantenimiento continuo de la librería elegida.

## Opciones Consideradas

- Uso de ChatGPT para resolver el problema de asignación.
- Desarrollo de un algoritmo personalizado con técnicas como backtracking.
- Uso de PuLP para modelar el problema como Integer Linear Programming.
- Uso de Google OR-Tools para la optimización de la asignación.

## Resultado de la Decisión

Opción elegida: "Google OR-Tools", debido a que es una librería de optimización robusta que permite manejar restricciones flexibles y proporciona soluciones parciales cuando no es posible encontrar una asignación óptima completa.

### Consecuencias

- Positivo, porque permite manejar restricciones de forma flexible y obtener soluciones parciales.
- Positivo, porque la librería es de código abierto y mantenida activamente por Google.
- Positivo, porque está bien documentada y cuenta con una comunidad activa.
- Negativo, porque no cuenta con soporte en JavaScript, lo que llevó a la creación de un servicio independiente en Python.

### Confirmación

La implementación de OR-Tools en Python se validará mediante pruebas unitarias en el servicio LectureTeacherAssociator, asegurando que la asignación de docentes cumpla con las restricciones definidas.

## Pros y Contras de las Opciones

### ChatGPT

- **Pros:**

  - Permite generar soluciones sin necesidad de desarrollar código manualmente.

- **Contras:**
  - No está diseñado para problemas de optimización combinatoria.
  - Requiere una API de pago para su uso en producción.

### Desarrollo de Algoritmo Propio

- **Pros:**

  - Ofrece control total sobre la solución.

- **Contras:**
  - El desarrollo desde cero requiere tiempo y esfuerzo significativo.
  - Se estaría "reinventando la rueda" al existir soluciones optimizadas ya disponibles.

### PuLP

- **Pros:**

  - Permite modelar el problema como Integer Linear Programming.

- **Contras:**
  - Solo admite restricciones duras y no proporciona soluciones parciales.
  - En caso de no encontrar una solución óptima, simplemente falla sin ofrecer alternativas parciales.

### Google OR-Tools

- **Pros:**

  - Permite manejar restricciones flexibles y encontrar soluciones parciales.
  - Está activamente mantenido y respaldado por Google.
  - Soporta múltiples lenguajes, aunque no JavaScript.

- **Contras:**
  - Requiere implementar un servicio en Python para integrarse con el sistema principal.

## Más Información

La documentación oficial de OR-Tools se encuentra en: https://developers.google.com/optimization

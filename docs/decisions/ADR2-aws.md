# ADR2: Elección de AWS como proveedor de infraestructura y sus componentes

## Contexto y Declaración del Problema

Para la infraestructura del sistema, se debía seleccionar un proveedor de nube que permitiera el despliegue del frontend, backend y servicios auxiliares, asegurando escalabilidad, confiabilidad y facilidad de integración. Se consideraron opciones como AWS, Google Cloud y Azure.

Adicionalmente, se necesitaba una solución para la persistencia de datos con una base de datos relacional, así como un entorno para alojar un microservicio de asignación de docentes basado en OR-Tools.

## Decisión

Se eligió AWS como proveedor de nube y se utilizaron los siguientes servicios:

1. **Frontend**: Desplegado como una Single Page Application (SPA) en **AWS S3** con CloudFront para distribución de contenido.
2. **Backend**: Implementado en **Node.js con TypeScript**, expuesto como una API REST con **Express**, y desplegado en **AWS Elastic Beanstalk** para facilitar la administración y escalabilidad.
3. **Base de datos**: Se utilizó **AWS RDS con PostgreSQL** como motor de base de datos relacional.
4. **LectureTeacherAssignator**: Microservicio desarrollado en **Python con OR-Tools**, expuesto a través de una **API REST** y alojado en **Elastic Beanstalk**. Se eligió este enfoque en lugar de un background job debido a que los tiempos de ejecución eran rápidos (~1s para un caso promedio y ~4s en escenarios ampliados), lo que permitía responder en tiempo real.

## Justificación

- **Disponibilidad de créditos en AWS Academy**: La institución educativa contaba con créditos en AWS, lo que permitió usar la plataforma sin costos adicionales.
- **Popularidad y adopción en la industria**: AWS es uno de los principales proveedores de nube, por lo que desplegar allí facilitó la adquisición de conocimientos relevantes para la industria.
- **Escalabilidad y facilidad de gestión**: Elastic Beanstalk automatiza el escalado y administración del backend sin necesidad de gestionar servidores manualmente.
- **Integración de servicios**: AWS proporciona una infraestructura unificada donde todos los componentes del sistema pueden interactuar sin complicaciones adicionales.

## Consecuencias

- **Beneficios**:
  - Reducción de costos gracias a los créditos de AWS.
  - Facilidad de despliegue y gestión de infraestructura.
  - Aprendizaje práctico en una plataforma utilizada en el mercado laboral.
- **Desafíos**:
  - Dependencia de AWS: Si en el futuro se migrara a otra plataforma, habría que adaptar algunos servicios.
  - Complejidad de algunos servicios de AWS, lo que requirió tiempo de aprendizaje inicial.

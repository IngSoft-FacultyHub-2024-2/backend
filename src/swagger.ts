import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: '/api', // Adjust this to fit your base path
      },
    ],
  },
  apis: ['./src/routers/*.ts'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };

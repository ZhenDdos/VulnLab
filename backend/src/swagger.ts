import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VulnLab API",
      version: "1.0.0",
      description: "API для учебного проекта VulnLab (Магазин)",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

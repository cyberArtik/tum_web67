export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "funkids API",
    version: "1.0.0",
    description:
      "JWT-protected REST API for the funkids toy catalog (TUM Web Programming, Lab 7).",
  },
  servers: [{ url: "http://localhost:4000", description: "Local dev" }],
  tags: [
    { name: "auth", description: "Token issuance" },
    { name: "products", description: "Product CRUD" },
    { name: "health", description: "Service health" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste a token here without the `Bearer ` prefix. Get one from `POST /token`.",
      },
    },
    schemas: {
      Role: {
        type: "string",
        enum: ["VISITOR", "WRITER", "ADMIN"],
      },
      Permission: {
        type: "string",
        enum: ["READ", "WRITE", "DELETE"],
      },
      TokenResponse: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          token_type: { type: "string", example: "Bearer" },
          expires_in: { type: "integer", example: 60 },
          role: { $ref: "#/components/schemas/Role" },
          permissions: {
            type: "array",
            items: { $ref: "#/components/schemas/Permission" },
          },
        },
      },
      Product: {
        type: "object",
        required: [
          "id", "article_id", "name_ro", "name_ru", "name_en",
          "price", "stock", "category", "image_url", "tags", "rating", "created_at",
        ],
        properties: {
          id: { type: "integer", example: 1 },
          article_id: { type: "string", example: "FK-0001" },
          name_ro: { type: "string" },
          name_ru: { type: "string" },
          name_en: { type: "string" },
          description_ro: { type: "string", nullable: true },
          description_ru: { type: "string", nullable: true },
          description_en: { type: "string", nullable: true },
          price: { type: "number", example: 249 },
          original_price: { type: "number", nullable: true },
          stock: { type: "integer", example: 18 },
          category: { type: "string", example: "plush" },
          brand: { type: "string", nullable: true, example: "FunKids" },
          age_group: {
            type: "string",
            enum: ["0-2", "3-5", "6-8", "9-12", "13+"],
            nullable: true,
          },
          image_url: { type: "string", format: "uri" },
          tags: { type: "array", items: { type: "string" } },
          rating: { type: "number", minimum: 0, maximum: 5, example: 4.8 },
          reviews_count: { type: "integer", nullable: true },
          is_active: { type: "boolean", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      ProductInput: {
        type: "object",
        required: [
          "article_id", "name_ro", "name_ru", "name_en",
          "price", "stock", "category", "image_url",
        ],
        properties: {
          article_id: { type: "string" },
          name_ro: { type: "string" },
          name_ru: { type: "string" },
          name_en: { type: "string" },
          description_ro: { type: "string" },
          description_ru: { type: "string" },
          description_en: { type: "string" },
          price: { type: "number" },
          original_price: { type: "number" },
          stock: { type: "integer" },
          category: { type: "string" },
          brand: { type: "string" },
          age_group: {
            type: "string",
            enum: ["0-2", "3-5", "6-8", "9-12", "13+"],
          },
          image_url: { type: "string", format: "uri" },
          tags: { type: "array", items: { type: "string" } },
          rating: { type: "number" },
          reviews_count: { type: "integer" },
          is_active: { type: "boolean" },
        },
      },
      ProductPage: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Service is up",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    service: { type: "string", example: "funkids-api" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/token": {
      post: {
        tags: ["auth"],
        summary: "Issue JWT (POST body)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role"],
                properties: { role: { $ref: "#/components/schemas/Role" } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token issued (expires in 60s)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
          400: {
            description: "Invalid or missing role",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      get: {
        tags: ["auth"],
        summary: "Issue JWT (query param)",
        parameters: [
          {
            name: "role",
            in: "query",
            required: true,
            schema: { $ref: "#/components/schemas/Role" },
          },
        ],
        responses: {
          200: {
            description: "Token issued",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
          400: {
            description: "Invalid or missing role",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/products": {
      get: {
        tags: ["products"],
        summary: "List products (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", minimum: 0, default: 0 },
          },
        ],
        responses: {
          200: {
            description: "Page of products. `X-Total-Count` header carries the total.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductPage" },
              },
            },
          },
          401: { description: "Missing or invalid token" },
          403: { description: "Token lacks READ permission" },
        },
      },
      post: {
        tags: ["products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            headers: {
              Location: {
                schema: { type: "string" },
                description: "URL of the new resource",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Missing or invalid token" },
          403: { description: "Token lacks WRITE permission" },
        },
      },
    },
    "/products/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      get: {
        tags: ["products"],
        summary: "Get product by id",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Product",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Invalid id" },
          401: { description: "Missing or invalid token" },
          403: { description: "Token lacks READ permission" },
          404: { description: "Not found" },
        },
      },
      patch: {
        tags: ["products"],
        summary: "Update fields on a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Invalid id" },
          401: { description: "Missing or invalid token" },
          403: { description: "Token lacks WRITE permission" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: "Deleted" },
          400: { description: "Invalid id" },
          401: { description: "Missing or invalid token" },
          403: { description: "Token lacks DELETE permission" },
          404: { description: "Not found" },
        },
      },
    },
  },
} as const;

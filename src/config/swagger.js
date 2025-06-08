const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Amorarium API',
      version: '1.0.0',
      description: `
        API REST para o projeto Amorarium - Uma aplicação para casais gerenciarem cápsulas do tempo, sonhos compartilhados, galeria de momentos e diário do relacionamento.
        
        ## Funcionalidades Principais
        - Sistema de autenticação JWT
        - Gerenciamento de casais e convites
        - Cápsulas do tempo com upload de mídia
        - Sonhos e metas compartilhadas
        - Galeria de fotos e vídeos
        - Diário do casal
        - Marcos importantes do relacionamento
        - Lembranças especiais
        - Dashboard com estatísticas
        - Painel administrativo
        
        ## Autenticação
        A API utiliza JWT (JSON Web Token) para autenticação. Inclua o token no header Authorization:
        \`\`\`
        Authorization: Bearer <seu_token_jwt>
        \`\`\`
      `,
      contact: {
        name: 'Amorarium Team',
        email: 'contato@amorarium.com'
      },
      license: {
        name: 'Livre para uso educacional'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.amorarium.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp123abc456def789'
            },
            name: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com'
            },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/exemplo/avatar.jpg'
            },
            bannerUrl: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/exemplo/banner.jpg'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Desenvolvedor apaixonado'
            },
            anniversary: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2020-02-14T00:00:00.000Z'
            },
            coupleId: {
              type: 'string',
              nullable: true,
              example: 'clp456def789ghi012'
            },
            coupleName: {
              type: 'string',
              nullable: true,
              example: 'João & Maria'
            },
            isAdmin: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Couple: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp456def789ghi012'
            },
            name: {
              type: 'string',
              nullable: true,
              example: 'João & Maria'
            },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/exemplo/couple-avatar.jpg'
            },
            bannerUrl: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/exemplo/couple-banner.jpg'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Nossa história de amor começou em 2020...'
            },
            anniversary: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2020-02-14T00:00:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Capsule: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp789ghi012jkl345'
            },
            title: {
              type: 'string',
              example: 'Nossa primeira viagem'
            },
            content: {
              type: 'string',
              nullable: true,
              example: 'Hoje visitamos Paris pela primeira vez juntos...'
            },
            imageUrl: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/exemplo/imagem.jpg'
            },
            musicUrl: {
              type: 'string',
              nullable: true,
              example: 'https://open.spotify.com/track/123'
            },
            location: {
              type: 'string',
              nullable: true,
              example: 'Paris, França'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            userId: {
              type: 'string',
              example: 'clp123abc456def789'
            },
            coupleId: {
              type: 'string',
              nullable: true,
              example: 'clp456def789ghi012'
            }
          }
        },
        Dream: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp012jkl345mno678'
            },
            title: {
              type: 'string',
              example: 'Viajar para o Japão'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T00:00:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            userId: {
              type: 'string',
              example: 'clp123abc456def789'
            },
            coupleId: {
              type: 'string',
              nullable: true,
              example: 'clp456def789ghi012'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        AdminStats: {
          type: 'object',
          properties: {
            totalUsers: {
              type: 'integer',
              example: 150
            },
            totalCapsules: {
              type: 'integer',
              example: 89
            },
            totalDreams: {
              type: 'integer',
              example: 45
            },
            totalCouples: {
              type: 'integer',
              example: 75
            },
            totalGalleryEntries: {
              type: 'integer',
              example: 234
            },
            totalDiaryEntries: {
              type: 'integer',
              example: 156
            },
            totalMilestones: {
              type: 'integer',
              example: 67
            },
            totalMemories: {
              type: 'integer',
              example: 123
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Erro interno do servidor'
            },
            error: {
              type: 'string',
              example: 'Detalhes do erro'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #e91e63 }
    `,
    customSiteTitle: "Amorarium API Documentation"
  })
};
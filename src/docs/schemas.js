/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp123abc456def789"
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@email.com"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/exemplo/avatar.jpg"
 *         bannerUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/exemplo/banner.jpg"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Desenvolvedor apaixonado"
 *         anniversary:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2020-02-14T00:00:00.000Z"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 *         coupleName:
 *           type: string
 *           nullable: true
 *           example: "João & Maria"
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 * 
 *     Couple:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp456def789ghi012"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "João & Maria"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/exemplo/couple-avatar.jpg"
 *         bannerUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/exemplo/couple-banner.jpg"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Nossa história de amor começou em 2020..."
 *         anniversary:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2020-02-14T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 * 
 *     Capsule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp789ghi012jkl345"
 *         title:
 *           type: string
 *           example: "Nossa primeira viagem"
 *         content:
 *           type: string
 *           nullable: true
 *           example: "Hoje visitamos Paris pela primeira vez juntos..."
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/exemplo/imagem.jpg"
 *         musicUrl:
 *           type: string
 *           nullable: true
 *           example: "https://open.spotify.com/track/123"
 *         location:
 *           type: string
 *           nullable: true
 *           example: "Paris, França"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     Dream:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp012jkl345mno678"
 *         title:
 *           type: string
 *           example: "Viajar para o Japão"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     GalleryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp345mno678pqr901"
 *         title:
 *           type: string
 *           example: "Momento especial"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Uma foto linda do nosso passeio"
 *         imageUrl:
 *           type: string
 *           example: "https://res.cloudinary.com/exemplo/gallery-image.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     DiaryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp678pqr901stu234"
 *         title:
 *           type: string
 *           example: "Nosso dia especial"
 *         content:
 *           type: string
 *           example: "Hoje foi um dia incrível..."
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     Milestone:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp901stu234vwx567"
 *         title:
 *           type: string
 *           example: "Primeiro encontro"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "O dia em que nos conhecemos"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2020-02-14T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     Memory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clp234vwx567yza890"
 *         title:
 *           type: string
 *           example: "Lembrança especial"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Uma lembrança que guardamos com carinho"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         userId:
 *           type: string
 *           example: "clp123abc456def789"
 *         coupleId:
 *           type: string
 *           nullable: true
 *           example: "clp456def789ghi012"
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/User'
 * 
 *     AdminStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           example: 150
 *         totalCapsules:
 *           type: integer
 *           example: 89
 *         totalDreams:
 *           type: integer
 *           example: 45
 *         totalCouples:
 *           type: integer
 *           example: 75
 *         totalGalleryEntries:
 *           type: integer
 *           example: 234
 *         totalDiaryEntries:
 *           type: integer
 *           example: 156
 *         totalMilestones:
 *           type: integer
 *           example: 67
 *         totalMemories:
 *           type: integer
 *           example: 123
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Erro interno do servidor"
 *         error:
 *           type: string
 *           example: "Detalhes do erro"
 * 
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example
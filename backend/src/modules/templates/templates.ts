/**
 * Architecture Templates Module
 * Pre-built templates for quick-start architecture generation
 */

export interface ArchitectureTemplate {
    id: string;
    name: string;
    icon: string;
    category: 'web' | 'mobile' | 'enterprise' | 'realtime';
    description: string;
    techStack: string[];
    requirements: string;
    constraints: Record<string, unknown>;
}

export const templates: ArchitectureTemplate[] = [
    {
        id: 'saas-platform',
        name: 'SaaS Platform',
        icon: 'Cloud',
        category: 'web',
        description: 'Multi-tenant web application with authentication, billing, and dashboards.',
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
        requirements: `Build a multi-tenant SaaS platform with the following features:
- User authentication with email/password and OAuth (Google, GitHub)
- Organization/workspace management with role-based access control
- Subscription billing with multiple pricing tiers (Free, Pro, Enterprise)
- Admin dashboard with analytics and user management
- REST API for third-party integrations
- Email notifications for account events`,
        constraints: {
            architecture: 'Monolith with modular structure',
            database: 'PostgreSQL',
            auth: 'JWT with refresh tokens',
        },
    },
    {
        id: 'ecommerce-store',
        name: 'E-commerce Store',
        icon: 'ShoppingCart',
        category: 'web',
        description: 'Full-featured online store with cart, checkout, and payment processing.',
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Elasticsearch'],
        requirements: `Build an e-commerce platform with the following features:
- Product catalog with categories, tags, and search functionality
- Shopping cart with persistent storage
- Checkout flow with multiple payment methods (Card, PayPal)
- Order management and tracking
- User accounts with order history and wishlists
- Admin panel for inventory and order management
- Product reviews and ratings`,
        constraints: {
            architecture: 'Modular Monolith',
            database: 'PostgreSQL',
            search: 'Elasticsearch',
            payments: 'Stripe',
        },
    },
    {
        id: 'realtime-chat',
        name: 'Real-time Chat App',
        icon: 'MessageCircle',
        category: 'realtime',
        description: 'WebSocket-based messaging with presence detection and notifications.',
        techStack: ['React', 'Node.js', 'Socket.io', 'Redis', 'MongoDB'],
        requirements: `Build a real-time chat application with the following features:
- One-on-one and group messaging
- Real-time message delivery with read receipts
- User presence (online/offline/typing indicators)
- Media file sharing (images, documents)
- Push notifications for mobile and web
- Message search and history
- End-to-end encryption for private chats`,
        constraints: {
            architecture: 'Event-Driven with WebSockets',
            database: 'MongoDB',
            cache: 'Redis for presence',
            realtime: 'Socket.io',
        },
    },
    {
        id: 'rest-api-backend',
        name: 'REST API Backend',
        icon: 'Server',
        category: 'enterprise',
        description: 'Scalable microservices API with authentication and CRUD operations.',
        techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
        requirements: `Build a RESTful API backend with the following features:
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, User, Guest)
- CRUD operations for core resources
- Rate limiting and request throttling
- API versioning (v1, v2)
- Request validation and error handling
- Swagger/OpenAPI documentation
- Health checks and monitoring endpoints`,
        constraints: {
            architecture: 'Microservices',
            database: 'PostgreSQL',
            cache: 'Redis',
            containerization: 'Docker',
        },
    },
    {
        id: 'mobile-backend',
        name: 'Mobile App Backend',
        icon: 'Smartphone',
        category: 'mobile',
        description: 'Backend-for-Frontend (BFF) pattern optimized for iOS/Android apps.',
        techStack: ['Node.js', 'GraphQL', 'PostgreSQL', 'Firebase', 'S3'],
        requirements: `Build a mobile app backend with the following features:
- GraphQL API optimized for mobile data fetching
- User authentication with social login (Apple, Google, Facebook)
- Push notification service (FCM for Android, APNS for iOS)
- Image and file upload with CDN delivery
- Offline-first data sync support
- Device registration and session management
- Analytics event tracking`,
        constraints: {
            architecture: 'BFF (Backend for Frontend)',
            api: 'GraphQL',
            database: 'PostgreSQL',
            storage: 'S3',
            notifications: 'Firebase Cloud Messaging',
        },
    },
    {
        id: 'blog-cms',
        name: 'Blog / CMS',
        icon: 'FileText',
        category: 'web',
        description: 'Content management system with admin panel and SEO optimization.',
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Cloudinary', 'Markdown'],
        requirements: `Build a blog/CMS platform with the following features:
- Rich text editor with Markdown support
- Media library with image optimization
- SEO-friendly URLs and meta tags
- Categories, tags, and content scheduling
- Multi-author support with roles (Admin, Editor, Author)
- Comments with moderation
- RSS feed and sitemap generation
- Draft/publish workflow`,
        constraints: {
            architecture: 'Monolith',
            database: 'PostgreSQL',
            rendering: 'SSG with ISR',
            media: 'Cloudinary',
        },
    },
    {
        id: 'iot-dashboard',
        name: 'IoT Dashboard',
        icon: 'Activity',
        category: 'realtime',
        description: 'Device monitoring platform with data collection and alerting.',
        techStack: ['React', 'Node.js', 'TimescaleDB', 'MQTT', 'Grafana'],
        requirements: `Build an IoT monitoring dashboard with the following features:
- Device registration and management
- Real-time telemetry data ingestion (MQTT/HTTP)
- Time-series data storage and visualization
- Threshold-based alerting with notifications
- Historical data charts and analytics
- Device grouping and fleet management
- Firmware update management
- API for external integrations`,
        constraints: {
            architecture: 'Event-Driven Microservices',
            database: 'TimescaleDB (time-series)',
            messaging: 'MQTT',
            visualization: 'Grafana',
        },
    },
    {
        id: 'social-platform',
        name: 'Social Media Platform',
        icon: 'Users',
        category: 'web',
        description: 'User profiles, feeds, posts, and social interactions.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Elasticsearch'],
        requirements: `Build a social media platform with the following features:
- User profiles with bio, avatar, and cover photo
- News feed with algorithmic sorting
- Posts with text, images, and videos
- Like, comment, and share functionality
- Follow/unfollow and friend connections
- Direct messaging between users
- Notifications for social activities
- Hashtags and content discovery
- Content moderation tools`,
        constraints: {
            architecture: 'Microservices',
            database: 'PostgreSQL',
            cache: 'Redis for feeds',
            search: 'Elasticsearch',
        },
    },
];

export function getTemplates(): ArchitectureTemplate[] {
    return templates;
}

export function getTemplateById(id: string): ArchitectureTemplate | undefined {
    return templates.find((t) => t.id === id);
}

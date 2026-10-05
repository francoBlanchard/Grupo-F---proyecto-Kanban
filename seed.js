const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Board = require('./models/board-model');
const Column = require('./models/column-model');
const Ticket = require('./models/ticket-model');

const seedData = async () => {
  try {
    console.log('[Seed] Conectando a la base de datos...');
    await connectDB();

    console.log('[Seed] Limpiando datos existentes...');
    await Board.deleteMany({});
    await Column.deleteMany({});
    await Ticket.deleteMany({});

    console.log('[Seed] Insertando datos de prueba...');

    // 1. Tablero 1: Plataforma E-Commerce
    const board1 = await Board.create({
      title: 'Plataforma E-Commerce',
      description: 'Tablero de desarrollo y seguimiento del sprint principal'
    });

    const col1_1 = await Column.create({
      title: 'Backlog',
      boardId: board1._id,
      order: 0
    });

    const col1_2 = await Column.create({
      title: 'En Progreso',
      boardId: board1._id,
      order: 1
    });

    const col1_3 = await Column.create({
      title: 'En Revisión',
      boardId: board1._id,
      order: 2
    });

    const col1_4 = await Column.create({
      title: 'Terminado',
      boardId: board1._id,
      order: 3
    });

    // Tickets para Tablero 1
    await Ticket.create([
      {
        title: 'Diseñar arquitectura de microservicios',
        description: 'Documentar diagramas de secuencia y contratos de OpenAPI.',
        priority: 'high',
        columnId: col1_1._id,
        order: 0
      },
      {
        title: 'Investigar integración de pagos',
        description: 'Comparar comisiones y webhooks de Mercado Pago vs Stripe.',
        priority: 'medium',
        columnId: col1_1._id,
        order: 1
      },
      {
        title: 'Implementar autenticación con JWT',
        description: 'Endpoints de registro, login y refresh token con rotación.',
        priority: 'high',
        columnId: col1_2._id,
        order: 0
      },
      {
        title: 'Crear componente de carrito de compras',
        description: 'Persistencia en localStorage y sincronización con backend.',
        priority: 'medium',
        columnId: col1_2._id,
        order: 1
      },
      {
        title: 'Endpoint de cálculo de costos de envío',
        description: 'Integrar cálculo dinámico por código postal y peso.',
        priority: 'low',
        columnId: col1_3._id,
        order: 0
      },
      {
        title: 'Configurar entorno inicial y Docker',
        description: 'Dockerfile multi-stage y docker-compose para dev.',
        priority: 'medium',
        columnId: col1_4._id,
        order: 0
      }
    ]);

    // 2. Tablero 2: Campaña Marketing Q4
    const board2 = await Board.create({
      title: 'Campaña de Marketing Q4',
      description: 'Lanzamiento de producto y promociones de fin de año'
    });

    const col2_1 = await Column.create({
      title: 'Ideas',
      boardId: board2._id,
      order: 0
    });

    const col2_2 = await Column.create({
      title: 'En Producción',
      boardId: board2._id,
      order: 1
    });

    const col2_3 = await Column.create({
      title: 'Publicado',
      boardId: board2._id,
      order: 2
    });

    await Ticket.create([
      {
        title: 'Diseño de banners para redes sociales',
        description: 'Formatos para Instagram Stories y LinkedIn.',
        priority: 'medium',
        columnId: col2_1._id,
        order: 0
      },
      {
        title: 'Redacción de newsletter promocional',
        description: 'Copywriting enfocado en descuentos por lanzamiento.',
        priority: 'high',
        columnId: col2_2._id,
        order: 0
      },
      {
        title: 'Comunicado de prensa oficial',
        description: 'Distribución a medios de tecnología.',
        priority: 'low',
        columnId: col2_3._id,
        order: 0
      }
    ]);

    console.log('\n=============================================');
    console.log('✅ BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('=============================================');
    console.log(`📌 Tablero 1 Creado: "${board1.title}" (ID: ${board1._id})`);
    console.log(`   - Columna: "${col1_1.title}" (ID: ${col1_1._id})`);
    console.log(`   - Columna: "${col1_2.title}" (ID: ${col1_2._id})`);
    console.log(`   - Columna: "${col1_3.title}" (ID: ${col1_3._id})`);
    console.log(`   - Columna: "${col1_4.title}" (ID: ${col1_4._id})`);
    console.log(`\n📌 Tablero 2 Creado: "${board2.title}" (ID: ${board2._id})`);
    console.log(`   - Columna: "${col2_1.title}" (ID: ${col2_1._id})`);
    console.log(`   - Columna: "${col2_2.title}" (ID: ${col2_2._id})`);
    console.log(`   - Columna: "${col2_3.title}" (ID: ${col2_3._id})`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error al poblar la base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();

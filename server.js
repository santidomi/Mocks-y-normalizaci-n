import express from 'express';
import { engine } from 'express-handlebars';
import moment from 'moment';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import generateFakeProducts from './utils/fakerProductGenerator.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { Mensajes } from './models/messageSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;
const timestamp = moment().format('h:mm a');

/* Mongo conection */

async function connectMG() {
  try {
    await mongoose.connect('mongodb+srv://joselamensa:NBLW114i2jvyU60F@cluster0.1clmwkn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
    console.log('Conectado a mongo! ✅');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}

await connectMG();

const FakeP = generateFakeProducts(5);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implementación del server con socket

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

httpServer.listen(PORT, () => console.log('SERVER ON http://localhost:' + PORT));

app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

app.get('/', async (req, res) => {
  res.render('productslist');
});

io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.emit('product-list', await FakeP);

  socket.on('msg', async (data) => {
    // Muestra el mensaje por consola
    console.log('Se recibio un msg nuevo', 'msg:', data);

    await Mensajes.save({ timestamp: timestamp, ...data });
    io.emit('msg-list', await Mensajes.find());
  });
});

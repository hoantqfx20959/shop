const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const socketio = require('socket.io');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const PORT = process.env.PORT || 5000;

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync('images', { recursive: true });
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      uuidv4() + '-' + file.originalname.toLowerCase().split(' ').join('-')
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false })); // x-www-form-urlencoded <form>
app.use(bodyParser.json({ limit: '50mb' })); // application/json

app.use(
  // multer({ storage: fileStorage, fileFilter: fileFilter }).single('images')
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 8)
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());

app.use(cookieParser());

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const conversationRoutes = require('./routes/conversation');

app.use(authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', conversationRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {});
    const io = socketio(server, { pingTimeout: 60000 });
    require('./socket')(io);
  })
  .catch(err => console.log(err));

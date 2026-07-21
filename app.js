require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const productosRouter = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // permite usar PUT/DELETE desde formularios HTML (<input name="_method">)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/productos'));
app.use('/productos', productosRouter);

app.use((req, res) => {
    res.status(404).send('Pagina no encontrada');
});

app.listen(PORT, () => {
    console.log(`Cliente Web Venta Plus corriendo en http://localhost:${PORT}`);
});

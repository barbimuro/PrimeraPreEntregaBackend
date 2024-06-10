import  express  from "express";
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import handlebars from 'express-handlebars';

const app = express()

const PORT = process.env.PORT || 8080 ;

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`))

app.get('/', (req, res)=>{
    res.render('home')
} )

app.get('/products', (req, res)=>{
    res.render('index')
})

app.use(express.json());

app.use(express.static('./src/public'))

app.use('/api/products', productsRouter)

app.use('/api/cart', cartRouter)
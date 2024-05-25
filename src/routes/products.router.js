import { Router }  from "express";
import uploader from "../middlewares/uploader.js";
import fileSystem from "fs";

const router = Router();

const loadProducts = () => {
  if (fileSystem.existsSync('./products.json')){
    const data = fileSystem.readFileSync('./products.json', 'utf-8');
    return JSON.parse(data)
  } else {
    return  [
        {"id": 1 , "name": "spray fijador", "quantity": 7, "price": 20},
        {"id": 2 , "name": "Paleta de sombras", "quantity": 5, "price": 70},
        {"id": 3 , "name": "Base", "quantity": 3, "price": 50},
        {"id": 4 , "name": "Mascara", "quantity": 21, "price": 15}
      ]
    }
  }

const saveProducts = (products) => {
    fileSystem.writeFileSync('./products.json', JSON.stringify(products, null, 2))
}
const deleteProductById = (productId) => {
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    saveProducts(products);
    return true;
  }
  return false;
}


let products = loadProducts()

router.get('/',(req,res)=>{
    const limit = parseInt(req.query.limit); 

    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
})
router.get('/:pid',(req, res)=>{
    const pid = req.params.pid;
    const productId = parseInt(pid);
    const product = products.find(p=>p.id === productId)
    if(!product){
        return res.status(404).send({status:"error", error:"product not found"})
    }
      

    res.send(product);
})

router.post('/',uploader.single('data'),(req,res)=>{
  console.log(req.file)
  console.log(req.body);
  const newProduct = ({
    id : products[products.length-1].id+1, 
    name:req.body.name,
    title:req.body.title,
    description:req.body.description,
    code:req.body.code,
    price:parseInt(req.body.price),
    status:req.body.status === 'true' || req.body.status === '1',
    stock:parseInt(req.body.stock),
    category:req.body.category
  })
  products.push(newProduct)
  res.send("Producto agregado");
  console.log(products)
  saveProducts(products)
})

 router.put('/:pid', uploader.single('data'),(req, res)=>{
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const productIndex = products.findIndex(p=>p.id === productId)
  if(productIndex === -1){
      return res.status(404).send({status:"error", error:"product not found"})
  }
  products[productIndex] = {
    ...products[productIndex],
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: parseInt(req.body.price),
    status: req.body.status === 'true' || req.body.status === '1',
    stock: parseInt(req.body.stock),
    category: req.body.category
  };

  saveProducts(products);

  res.send(products[productIndex]);
 
})

  router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const deleted = deleteProductById(productId);
  if (deleted) {
    res.send({ status: "success", message: "Producto eliminado correctamente" });
  } else {
    res.status(404).send({ status: "error", error: "product not found" });
  }
});



export default router
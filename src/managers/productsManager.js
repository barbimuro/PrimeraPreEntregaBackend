import fileSystem from 'fs';
class ProductsManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async loadProducts() {
      try {   
          if (fileSystem.existsSync(this.filePath)){
          const data = await fileSystem.promises.readFile(this.filePath, 'utf-8');
          return JSON.parse(data)
        } else {
          const initialProducts = [
            { "id": 1, "name": "spray fijador", "quantity": 7, "price": 20 },
            { "id": 2, "name": "Paleta de sombras", "quantity": 5, "price": 70 },
            { "id": 3, "name": "Base", "quantity": 3, "price": 50 },
            { "id": 4, "name": "Mascara", "quantity": 21, "price": 15 }
        ];
        await this.saveProducts(initialProducts);
          }
        } catch {
          console.error('Error loading products:', error);
          throw new Error('Could not load products');
        }
        } 
        async saveProducts(products){
          try {
            await fileSystem.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error saving products:', error);
            throw new Error('Could not save products');
        }
    
        }
        async deleteProductById(productId){
            const products = await this.loadProducts();
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
              products.splice(index, 1);
              await this.saveProducts(products);
              return true;
            }
            return false;
          }
}

export default ProductsManager





/*const loadProducts = () => {
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


let products = loadProducts() */
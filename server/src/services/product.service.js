const Product = require('../models/Product.model');
const { deleteImage } = require('../helpers/cloudinary.helper');

class ProductService {
  async getAllProducts(filters = {}) {
    const { search, categoria, minPrecio, maxPrecio, estado } = filters;
    
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (categoria) {
      query.categoria = categoria;
    }

    if (estado) {
      query.estado = estado;
    }

    if (minPrecio || maxPrecio) {
      query.precio = {};
      if (minPrecio) query.precio.$gte = parseFloat(minPrecio);
      if (maxPrecio) query.precio.$lte = parseFloat(maxPrecio);
    }

    return await Product.find(query).sort({ createdAt: -1 });
  }

  async getProductById(productId) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  }

  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  async updateProduct(productId, updateData, imageFile) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Si hay nueva imagen
    if (imageFile) {
      // Eliminar imagen anterior de Cloudinary si existe
      if (product.imagen.publicId) {
        await deleteImage(product.imagen.publicId);
      }
      
      // Actualizar con nueva imagen
      updateData.imagen = {
        url: imageFile.path,
        publicId: imageFile.filename
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedProduct;
  }

  async deleteProduct(productId) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Eliminar imagen de Cloudinary si existe
    if (product.imagen.publicId) {
      await deleteImage(product.imagen.publicId);
    }

    await Product.findByIdAndDelete(productId);
    
    return product;
  }
}

module.exports = new ProductService();
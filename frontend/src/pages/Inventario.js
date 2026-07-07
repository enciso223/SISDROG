import React, {useState, useEffect} from 'react';
import {apiClient} from '../api/client';

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState({low_stock: [], expiring_soon: []});

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Estado para el formulario de Producto (min_stock oculto y code opcional)
  const [newProduct, setNewProduct] = useState({
    name: '',
    purchase_price: '',
    sale_price: '',
    stock: '',
    category_id: '',
  });

  // Estado para el formulario de Categoría
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAlerts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/inventory/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/inventory/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await apiClient.get(
        '/inventory/products/alerts?expiry_days=30',
      );
      setAlerts(response.data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  // --- CREAR CATEGORÍA ---
  const handleCreateCategory = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/inventory/categories', newCategory);
      alert('Categoría creada exitosamente');
      setNewCategory({name: '', description: ''});
      setShowCategoryForm(false);
      fetchCategories(); // Recargar lista para el select
    } catch (error) {
      alert('Error al crear la categoría.');
      console.error(error);
    }
  };

  // --- CREAR PRODUCTO ---
  const handleCreateProduct = async e => {
    e.preventDefault();
    try {
      // Preparamos los datos para que coincidan con el esquema ProductCreate del backend
      const productData = {
        ...newProduct,
        // Genera un código automático si el backend lo exige y el usuario no lo ingresó
        code: `PROD-${Date.now()}`,
        min_stock: 5, // Se envía por defecto sin mostrarlo al usuario
        purchase_price: parseFloat(newProduct.purchase_price),
        sale_price: parseFloat(newProduct.sale_price),
        stock: parseInt(newProduct.stock, 10),
        category_id: newProduct.category_id
          ? parseInt(newProduct.category_id, 10)
          : null,
      };

      await apiClient.post('/inventory/products', productData);
      alert('Producto creado exitosamente');

      setShowProductForm(false);
      setNewProduct({
        name: '',
        purchase_price: '',
        sale_price: '',
        stock: '',
        category_id: '',

      fetchProducts();
      fetchAlerts();
    } catch (error) {
      alert('Error al crear el producto. Verifica los datos.');
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <h2>Gestión de Inventario</h2>
        <div>
          <button
            className="btn btn-primary"
            style={{marginRight: '10px'}}
            onClick={() => setShowCategoryForm(!showCategoryForm)}>
            {showCategoryForm ? 'Cerrar Categoría' : '+ Nueva Categoría'}
          </button>
          <button
            className="btn btn-success"
            onClick={() => setShowProductForm(!showProductForm)}>
            {showProductForm ? 'Cancelar Producto' : '+ Nuevo Producto'}
          </button>
        </div>
      </div>

      {/* Alertas */}
      {alerts.low_stock?.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '5px',
            margin: '20px 0',
            border: '1px solid #ffeeba',
          }}>
          <h4 style={{color: '#856404'}}>⚠️ Alertas de Stock Bajo</h4>
          <p style={{color: '#856404'}}>
            <strong>Reponer:</strong>{' '}
            {alerts.low_stock.map(p => p.name).join(', ')}
          </p>
        </div>
      )}

      {/* Formulario de Creación de Categoría */}
      {showCategoryForm && (
        <form
          onSubmit={handleCreateCategory}
          style={{
            background: '#e9ecef',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            marginTop: '20px',
          }}>
          <h3>Crear Categoría</h3>
          <div style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              className="search-input"
              value={newCategory.name}
              onChange={e =>
                setNewCategory({...newCategory, name: e.target.value})
              }
              required
            />
            <input
              type="text"
              placeholder="Descripción (Opcional)"
              className="search-input"
              value={newCategory.description}
              onChange={e =>
                setNewCategory({...newCategory, description: e.target.value})
              }
            />
            <button type="submit" className="btn btn-primary">
              Guardar Categoría
            </button>
          </div>
        </form>
      )}

      {/* Formulario de Creación de Producto */}
      {showProductForm && (
        <form
          onSubmit={handleCreateProduct}
          style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            marginTop: '20px',
          }}>
          <h3>Registrar Nuevo Producto</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '15px',

            <input
              type="text"
              placeholder="Nombre del producto"
              className="search-input"
              value={newProduct.name}
              onChange={e =>
                setNewProduct({...newProduct, name: e.target.value})
              }
              required

            <select
              className="search-input"
              value={newProduct.category_id}
              onChange={e =>
                setNewProduct({...newProduct, category_id: e.target.value})
              }>
              <option value="">-- Seleccionar Categoría (Opcional) --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Precio de Compra"
              className="search-input"
              value={newProduct.purchase_price}
              onChange={e =>
                setNewProduct({...newProduct, purchase_price: e.target.value})
              }
              required

            <input
              type="number"
              step="0.01"
              placeholder="Precio de Venta"
              className="search-input"
              value={newProduct.sale_price}
              onChange={e =>
                setNewProduct({...newProduct, sale_price: e.target.value})
              }
              required

            <input
              type="number"
              placeholder="Stock Inicial"
              className="search-input"
              value={newProduct.stock}
              onChange={e =>
                setNewProduct({...newProduct, stock: e.target.value})
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            style={{marginTop: '15px'}}>
            Guardar Producto
          </button>
        </form>
      )}

      {/* Tabla de Productos */}
      <table className="cart-table" style={{marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Código (Auto)</th>
            <th>Nombre</th>
            <th>Precio Venta</th>
            <th>Stock Actual</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <small>{product.code}</small>
              </td>
              <td>{product.name}</td>
              <td>${product.sale_price}</td>
              <td>
                <span
                  style={{
                    color:
                      product.stock <= product.min_stock ? 'red' : 'inherit',
                    fontWeight:
                      product.stock <= product.min_stock ? 'bold' : 'normal',
                  }}>
                  {product.stock}
                </span>
              </td>
              <td>{product.is_active ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="empty-cart">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

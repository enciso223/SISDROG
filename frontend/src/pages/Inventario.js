import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState({ low_stock: [], expiring_soon: [] });

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    purchase_price: '',
    sale_price: '',
    stock: '',
    category_id: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
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
      console.error("Error cargando productos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/inventory/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await apiClient.get('/inventory/products/alerts?expiry_days=30');
      setAlerts(response.data);
    } catch (error) {
      console.error("Error cargando alertas:", error);
    }
  };

  const getErrorMessage = (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        return detail.map(d => `${d.loc?.slice(-1)[0] || 'campo'}: ${d.msg}`).join(', ');
      }
      return detail;
    }
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySuccess('');
    try {
      await apiClient.post('/inventory/categories', newCategory);
      setCategorySuccess('Categoría creada exitosamente.');
      setNewCategory({ name: '', description: '' });
      fetchCategories();
      setTimeout(() => {
        setCategorySuccess('');
        setShowCategoryForm(false);
      }, 2000);
    } catch (error) {
      setCategoryError(getErrorMessage(error));
      console.error(error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductError('');
    setProductSuccess('');
    try {
      const productData = {
        ...newProduct,
        code: `PROD-${Date.now()}`,
        min_stock: 5,
        purchase_price: parseFloat(newProduct.purchase_price),
        sale_price: parseFloat(newProduct.sale_price),
        stock: parseInt(newProduct.stock, 10),
        category_id: newProduct.category_id ? parseInt(newProduct.category_id, 10) : null
      };

      await apiClient.post('/inventory/products', productData);
      setProductSuccess('Producto creado exitosamente.');
      setNewProduct({ name: '', purchase_price: '', sale_price: '', stock: '', category_id: '' });
      fetchProducts();
      fetchAlerts();
      setTimeout(() => {
        setProductSuccess('');
        setShowProductForm(false);
      }, 2000);
    } catch (error) {
      setProductError(getErrorMessage(error));
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de Inventario</h2>
        <div>
          <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => { setShowCategoryForm(!showCategoryForm); setCategoryError(''); setCategorySuccess(''); }}>
            {showCategoryForm ? 'Cerrar Categoría' : '+ Nueva Categoría'}
          </button>
          <button className="btn btn-success" onClick={() => { setShowProductForm(!showProductForm); setProductError(''); setProductSuccess(''); }}>
            {showProductForm ? 'Cancelar Producto' : '+ Nuevo Producto'}
          </button>
        </div>
      </div>

      {/* Alertas de stock */}
      {(alerts.low_stock?.length > 0) && (
        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', margin: '20px 0', border: '1px solid #ffeeba' }}>
          <h4 style={{ color: '#856404' }}>⚠️ Alertas de Stock Bajo</h4>
          <p style={{ color: '#856404' }}>
            <strong>Reponer:</strong> {alerts.low_stock.map(p => p.name).join(', ')}
          </p>
        </div>
      )}

      {/* Formulario Categoría */}
      {showCategoryForm && (
        <form onSubmit={handleCreateCategory} style={{ background: '#e9ecef', padding: '20px', borderRadius: '8px', marginBottom: '20px', marginTop: '20px' }}>
          <h3>Crear Categoría</h3>

          {categoryError && (
            <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '10px 15px', borderRadius: '5px', marginTop: '10px', border: '1px solid #f5c2c7' }}>
              ❌ {categoryError}
            </div>
          )}
          {categorySuccess && (
            <div style={{ backgroundColor: '#d1e7dd', color: '#0f5132', padding: '10px 15px', borderRadius: '5px', marginTop: '10px', border: '1px solid #badbcc' }}>
              ✅ {categorySuccess}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <input type="text" placeholder="Nombre de la categoría" className="search-input"
              value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} required />
            <input type="text" placeholder="Descripción (Opcional)" className="search-input"
              value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
            <button type="submit" className="btn btn-primary">Guardar Categoría</button>
          </div>
        </form>
      )}

      {/* Formulario Producto */}
      {showProductForm && (
        <form onSubmit={handleCreateProduct} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', marginTop: '20px' }}>
          <h3>Registrar Nuevo Producto</h3>

          {productError && (
            <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '10px 15px', borderRadius: '5px', marginTop: '10px', border: '1px solid #f5c2c7' }}>
              ❌ {productError}
            </div>
          )}
          {productSuccess && (
            <div style={{ backgroundColor: '#d1e7dd', color: '#0f5132', padding: '10px 15px', borderRadius: '5px', marginTop: '10px', border: '1px solid #badbcc' }}>
              ✅ {productSuccess}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <input type="text" placeholder="Nombre del producto" className="search-input"
              value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />

            <select className="search-input" value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}>
              <option value="">-- Seleccionar Categoría (Opcional) --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input type="number" step="0.01" placeholder="Precio de Compra" className="search-input"
              value={newProduct.purchase_price} onChange={e => setNewProduct({ ...newProduct, purchase_price: e.target.value })} required />

            <input type="number" step="0.01" placeholder="Precio de Venta" className="search-input"
              value={newProduct.sale_price} onChange={e => setNewProduct({ ...newProduct, sale_price: e.target.value })} required />

            <input type="number" placeholder="Stock Inicial" className="search-input"
              value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-success" style={{ marginTop: '15px' }}>Guardar Producto</button>
        </form>
      )}

      {/* Tabla de Productos */}
      <table className="cart-table" style={{ marginTop: '20px' }}>
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
              <td><small>{product.code}</small></td>
              <td>{product.name}</td>
              <td>${product.sale_price}</td>
              <td>
                <span style={{ color: product.stock <= product.min_stock ? 'red' : 'inherit', fontWeight: product.stock <= product.min_stock ? 'bold' : 'normal' }}>
                  {product.stock}
                </span>
              </td>
              <td>{product.is_active ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="5" className="empty-cart">No hay productos registrados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

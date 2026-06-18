import React, { useState } from 'react';
import { apiClient } from '../api/client';

export default function Ventas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Simulación de búsqueda conectada al módulo de inventario (HU-02)
  const searchProduct = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Esta es la ruta exacta que coincidirá con tu backend
      const response = await apiClient.get(`/inventory/products/search?q=${encodeURIComponent(searchQuery)}`);
      console.log('Search response:', response);
      // Asegurar que `products` sea siempre un array
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (Array.isArray(response.data?.products)) {
        products = response.data.products;
      } else if (response.data && typeof response.data === 'object') {
        // Si el backend devolviera un solo producto como objeto, convertirlo a array
        products = [response.data];
      }
      console.log('Parsed products:', products);
      
      if (products.length === 0) {
        alert('Producto no encontrado.');
        return;
      }

      const product = products[0];

      if (product.stock <= 0) {
        alert('Stock Insuficiente: No hay unidades disponibles.');
        return;
      }
      addToCart(product);
      setSearchQuery(''); // Limpia el buscador
    } catch (error) {
      console.error('Error buscando producto:', error);
      alert('Error de conexión o producto no encontrado. Revisa la consola para más detalles.');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart = [];
    if (existingItem) {
      newCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    calculateTotal(newCart);
  };

  const calculateTotal = (currentCart) => {
      const newTotal = currentCart.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);
    setTotal(newTotal);
  };

  const checkout = async () => {
    try {
      // Conexión con el módulo sales (HU-01)
      // Transformar el carrito al esquema esperado por el backend
      const payload = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
      };
      await apiClient.post('/sales', payload);
      alert('Venta registrada con éxito. Inventario actualizado.');
      setCart([]);
      setTotal(0);
      setSearchQuery('');
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      alert('Error al procesar la venta. Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="page-container">
      <h2>Punto de Venta</h2>
      
      <form onSubmit={searchProduct} className="search-container">
        <input
          type="text"
          placeholder="Escanear código de barras o buscar nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="cart-container">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.sale_price}</td>
              <td>${item.sale_price * item.quantity}</td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-cart">No hay productos en la venta actual.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="checkout-section">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button 
          className="btn btn-success" 
          onClick={checkout}
          disabled={cart.length === 0}
        >
          Finalizar Venta
        </button>
      </div>
    </div>
  );
}
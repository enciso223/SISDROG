/**
 * Controlador del punto de venta (POS).
 */

import {useState, useCallback, useEffect, useMemo} from 'react';
import {inventoryService, salesService, mockProducts} from '../services';
import {Product, SaleItem, SaleCreate, PaymentMethod} from '../models';
import {DEMO_MODE, TAX_RATE} from '../config/constants';

export interface CartItem extends SaleItem {
  productName: string;
}

export interface UsePOSControllerReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  categories: string[];
  cart: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  filteredProducts: Product[];
  setSelectedCategory: (category: string) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  applyDiscount: (amount: number) => void;
  clearCart: () => void;
  finalizeSale: (paymentMethod?: PaymentMethod) => Promise<void>;
}

const ALL_CATEGORY = 'Todos';

export const usePOSController = (): UsePOSControllerReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, _setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = DEMO_MODE ? mockProducts : await inventoryService.getAll();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar productos',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => [
      ALL_CATEGORY,
      ...new Set(products.map(p => p.category).filter(Boolean) as string[]),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORY ||
        product.category === selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        (product.laboratory &&
          product.laboratory.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) {
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (newQuantity > product.stock) {
          return prev;
        }
        return prev.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: newQuantity * item.unitPrice,
              }
            : item,
        );
      }

      const newItem: CartItem = {
        productId: product.id ?? 0,
        productName: product.name,
        quantity: 1,
        unitPrice: product.salePrice,
        subtotal: product.salePrice,
      };
      return [...prev, newItem];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        setCart(prev => prev.filter(item => item.productId !== productId));
        return;
      }

      const product = products.find(p => p.id === productId);
      if (product && quantity > product.stock) {
        return;
      }

      setCart(prev =>
        prev.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.unitPrice,
              }
            : item,
        ),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const applyDiscount = useCallback((amount: number) => {
    setDiscount(Math.max(0, amount));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.subtotal, 0),
    [cart],
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);

  const total = useMemo(
    () => subtotal + tax - discount,
    [subtotal, tax, discount],
  );

  const finalizeSale = useCallback(
    async (
      paymentMethod: PaymentMethod = PaymentMethod.CASH,
    ): Promise<void> => {
      if (cart.length === 0) {
        throw new Error('El carrito está vacío');
      }

      const saleData: SaleCreate = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        paymentMethod,
      };

      if (DEMO_MODE) {
        clearCart();
        return;
      }

      await salesService.create(saleData);
      clearCart();
    },
    [cart, clearCart],
  );

  return {
    products,
    loading,
    error,
    selectedCategory,
    categories,
    cart,
    subtotal,
    tax,
    discount,
    total,
    filteredProducts,
    setSelectedCategory,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyDiscount,
    clearCart,
    finalizeSale,
  };
};

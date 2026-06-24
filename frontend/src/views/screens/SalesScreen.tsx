/**
 * Vista: Pantalla de ventas (POS).
 * Los estilos están en SalesScreen.styles.ts
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {usePOSController} from '../../controllers';
import {Product} from '../../models';
import {TAX_RATE} from '../../config/constants';
import {Icon} from '../components';
import {salesStyles as styles, PRIMARY} from './SalesScreen.styles';

// Habilitar LayoutAnimation en Android (por si se ejecuta allí alguna vez)
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Componentes Secundarios ──────────────────────────────────────

interface QuantityButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
  label,
  onPress,
  disabled,
  variant = 'primary',
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({pressed}) => [
      styles.qtyButton,
      variant === 'ghost' && styles.qtyButtonGhost,
      disabled && styles.qtyButtonDisabled,
      pressed && !disabled && {opacity: 0.6, transform: [{scale: 0.95}]},
    ]}>
    <Text
      style={[
        styles.qtyButtonText,
        variant === 'ghost' && styles.qtyButtonTextGhost,
        disabled && styles.qtyButtonTextDisabled,
      ]}>
      {label}
    </Text>
  </Pressable>
);

interface CategoryChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  active,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.chip,
      active && styles.chipActive,
      pressed && {transform: [{scale: 0.97}]},
    ]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </Pressable>
);

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onPress}) => {
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= (product.minStock ?? 0);

  const stockBadgeColor = outOfStock
    ? styles.badgeRed
    : lowStock
    ? styles.badgeYellow
    : styles.badgeGreen;
  const stockTextColor = outOfStock
    ? styles.badgeTextRed
    : lowStock
    ? styles.badgeTextYellow
    : styles.badgeTextGreen;

  return (
    <Pressable
      style={({pressed}) => [
        styles.productCard,
        outOfStock && styles.productCardDisabled,
        pressed && !outOfStock && {transform: [{scale: 0.98}], elevation: 6},
      ]}
      onPress={() => onPress(product)}
      disabled={outOfStock}>
      <View style={styles.productCardHeader}>
        <View style={styles.productIconPlaceholder}>
          <Icon name="inventory" size={22} color={PRIMARY} />
        </View>
        <View style={[styles.stockBadge, stockBadgeColor]}>
          <Text style={stockTextColor}>
            {outOfStock ? 'Sin Stock' : `Stock: ${product.stock}`}
          </Text>
        </View>
      </View>

      <View style={styles.productCardBody}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productLab} numberOfLines={1}>
          {product.laboratory ?? 'Genérico'}
        </Text>
      </View>

      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>${product.salePrice.toFixed(2)}</Text>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      </View>
    </Pressable>
  );
};

interface CartItemRowProps {
  item: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => (
  <View style={styles.cartItem}>
    <View style={styles.cartItemHeader}>
      <Text style={styles.cartItemName} numberOfLines={2}>
        {item.productName}
      </Text>
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.6}
        style={styles.cartItemRemoveBtn}>
        <Icon name="delete" size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
    <View style={styles.cartItemFooter}>
      <View style={styles.cartQtyControls}>
        <QuantityButton label="−" onPress={onDecrease} variant="ghost" />
        <Text style={styles.cartQty}>{item.quantity}</Text>
        <QuantityButton label="+" onPress={onIncrease} variant="ghost" />
      </View>
      <View style={styles.cartItemTotals}>
        <Text style={styles.cartItemSubtotal}>${item.subtotal.toFixed(2)}</Text>
        <Text style={styles.cartItemUnitPrice}>
          {item.quantity} × ${item.unitPrice.toFixed(2)}
        </Text>
      </View>
    </View>
  </View>
);

// ─── Componente Principal ─────────────────────────────────────────

export const SalesScreen: React.FC = () => {
  const {
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
    addToCart: _addToCart,
    updateQuantity,
    removeFromCart: _removeFromCart,
    applyDiscount,
    clearCart: _clearCart,
    finalizeSale,
  } = usePOSController();

  const [scannerValue, setScannerValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(true);

  // Wrappers con animación
  const addToCart = (p: Product) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    _addToCart(p);
  };
  const removeFromCart = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    _removeFromCart(id);
  };
  const clearCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    _clearCart();
  };

  const handleScannerSubmit = () => {
    const code = scannerValue.trim();
    if (!code) {
      return;
    }
    const product = filteredProducts.find(
      p =>
        p.code.toLowerCase() === code.toLowerCase() ||
        p.name.toLowerCase().includes(code.toLowerCase()),
    );
    if (product) {
      addToCart(product);
      setScannerValue('');
    }
  };

  const handleIncrease = (productId: number) => {
    const item = cart.find(c => c.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecrease = (productId: number) => {
    const item = cart.find(c => c.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleFinalize = async () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de finalizar.');
      return;
    }
    setIsProcessing(true);
    try {
      await finalizeSale();
      Alert.alert(
        'Venta finalizada',
        'La venta se registró correctamente y el stock fue actualizado.',
      );
      clearCart();
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'No se pudo finalizar la venta',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    if (cart.length === 0) {
      return;
    }
    Alert.alert(
      'Limpiar venta',
      '¿Estás seguro de que deseas vaciar el carrito?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Sí, limpiar', onPress: clearCart, style: 'destructive'},
      ],
    );
  };

  const openDiscountInput = () => {
    setDiscountInput(discount > 0 ? discount.toFixed(2) : '');
    setEditingDiscount(true);
  };

  const commitDiscount = () => {
    const amount = parseFloat(discountInput);
    applyDiscount(Number.isNaN(amount) ? 0 : amount);
    setEditingDiscount(false);
  };

  const cancelDiscount = () => setEditingDiscount(false);

  return (
    <View style={styles.container}>
      {/* ─── Área Principal (Catálogo) ─── */}
      <View style={styles.main}>
        {/* Toolbar: buscador + botón carrito (cuando está cerrado) */}
        <View style={styles.toolbar}>
          <View style={styles.scannerRow}>
            <Icon name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.scannerInput}
              placeholder="Escanear código de barras o buscar producto..."
              placeholderTextColor="#9CA3AF"
              value={scannerValue}
              onChangeText={setScannerValue}
              onSubmitEditing={handleScannerSubmit}
              returnKeyType="search"
            />
            <View style={styles.scannerStatus} />
          </View>

          {!isCartOpen && (
            <TouchableOpacity
              style={styles.openCartFab}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setIsCartOpen(true);
              }}
              activeOpacity={0.85}>
              <Icon name="sales" size={20} color="#FFFFFF" />
              <Text style={styles.openCartFabText}>Venta Actual</Text>
              {cart.length > 0 && (
                <View style={styles.openCartBadge}>
                  <Text style={styles.openCartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Chips de categorías */}
        <View style={styles.categories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}>
            {categories.map(category => (
              <CategoryChip
                key={category}
                label={category}
                active={category === selectedCategory}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={PRIMARY}
            style={styles.loadingIndicator}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Grilla de productos */}
        <ScrollView
          style={styles.productsScroll}
          showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <View
                key={product.id ?? product.code}
                style={styles.productCardWrapper}>
                <ProductCard product={product} onPress={addToCart} />
              </View>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <Icon name="inventory" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  No se encontraron productos.
                </Text>
              </View>
            )}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* ─── Panel Lateral (Carrito) ─── */}
      {isCartOpen && (
        <View style={styles.cartPanel}>
          <View style={styles.cartHeader}>
            <View style={styles.cartTitleBlock}>
              <Text style={styles.cartTitle}>Venta Actual</Text>
              <Text style={styles.cartSubtitle}>
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setIsCartOpen(false);
              }}
              activeOpacity={0.7}
              style={styles.closeButton}>
              <Icon name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.cartItems}
            showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View style={styles.cartEmptyContainer}>
                <Icon name="sales" size={44} color="#E5E7EB" />
                <Text style={styles.cartEmpty}>El carrito está vacío.</Text>
                <Text style={styles.cartEmptySub}>
                  Selecciona productos del catálogo.
                </Text>
              </View>
            ) : (
              cart.map(item => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onIncrease={() => handleIncrease(item.productId)}
                  onDecrease={() => handleDecrease(item.productId)}
                  onRemove={() => removeFromCart(item.productId)}
                />
              ))
            )}
          </ScrollView>

          <View style={styles.cartSummaryWrapper}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                IVA ({(TAX_RATE * 100).toFixed(0)}%)
              </Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>

            {editingDiscount ? (
              <View style={styles.discountInputRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Descuento
                </Text>
                <TextInput
                  style={styles.discountInput}
                  value={discountInput}
                  onChangeText={setDiscountInput}
                  keyboardType="numeric"
                  autoFocus
                  selectTextOnFocus
                  onBlur={commitDiscount}
                  onSubmitEditing={commitDiscount}
                />
                <TouchableOpacity onPress={cancelDiscount} activeOpacity={0.7}>
                  <Text style={styles.discountCancel}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.summaryRow}
                onPress={openDiscountInput}
                activeOpacity={0.7}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Descuento
                </Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -${discount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                disabled={cart.length === 0}
                activeOpacity={0.7}>
                <Icon name="delete" size={20} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  (cart.length === 0 || isProcessing) &&
                    styles.checkoutButtonDisabled,
                ]}
                onPress={handleFinalize}
                disabled={cart.length === 0 || isProcessing}
                activeOpacity={0.9}>
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Icon name="payment" size={20} color="#FFFFFF" />
                    <Text style={styles.checkoutButtonText}>
                      Cobrar ${total.toFixed(2)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

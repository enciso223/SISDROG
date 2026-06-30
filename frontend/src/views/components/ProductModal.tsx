/**
 * Componente modal para crear y editar productos.
 *
 * Diseño profesional con secciones agrupadas, iconos de sección,
 * y una experiencia visual premium.
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Input} from './Input';
import {Icon, IconName} from './Icon';
import {Product, ProductCreate} from '../../models';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProductCreate, id?: number) => void;
  product?: Product | null; // Si es null, estamos creando. Si tiene valor, estamos editando.
}

/* ─── Paleta ─── */
const TEAL = '#0D9488';
const TEAL_DARK = '#0F766E';
const TEAL_LIGHT = '#F0FDFA';
const TEXT_MAIN = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const BORDER = '#E2E8F0';
const BG_SURFACE = '#FFFFFF';
const BG_SECTION = '#F8FAFC';
const DANGER = '#EF4444';

/* ─── Componente auxiliar: encabezado de sección ─── */
interface SectionHeaderProps {
  icon: IconName;
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({icon, title, subtitle}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIconBadge}>
      <Icon name={icon} size={14} color={TEAL} />
    </View>
    <View style={styles.sectionTextContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

/* ─── Componente auxiliar: tarjeta de sección ─── */
const SectionCard: React.FC<{children: React.ReactNode}> = ({children}) => (
  <View style={styles.sectionCard}>{children}</View>
);

export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  onSave,
  product,
}) => {
  const [formData, setFormData] = useState<Partial<ProductCreate>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      if (product) {
        setFormData({
          code: product.code,
          name: product.name,
          description: product.description || '',
          presentation: product.presentation || '',
          laboratory: product.laboratory || '',
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          stock: product.stock,
          minStock: product.minStock || 5,
          expirationDate: product.expirationDate || '',
          supplierId: product.supplierId,
        });
      } else {
        setFormData({
          code: '',
          name: '',
          description: '',
          presentation: '',
          laboratory: '',
          purchasePrice: 0,
          salePrice: 0,
          stock: 0,
          minStock: 5,
          expirationDate: '',
        });
      }
      setErrors({});
    }
  }, [visible, product]);

  const handleChange = (field: keyof ProductCreate, value: string | number | undefined) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code) newErrors.code = 'Requerido';
    if (!formData.name) newErrors.name = 'Requerido';
    if (formData.purchasePrice === undefined || formData.purchasePrice < 0)
      newErrors.purchasePrice = 'Debe ser mayor o igual a 0';
    if (formData.salePrice === undefined || formData.salePrice < 0)
      newErrors.salePrice = 'Debe ser mayor o igual a 0';
    if (formData.stock === undefined || formData.stock < 0)
      newErrors.stock = 'Debe ser mayor o igual a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData as ProductCreate, product?.id);
    }
  };

  if (!visible) return null;

  const isEditing = !!product;

  return (
    <View style={[StyleSheet.absoluteFill, {zIndex: 1000, elevation: 1000}]}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* ─── Acento superior ─── */}
          <View style={styles.topAccent} />

          {/* ─── Header ─── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Icon
                  name={isEditing ? 'edit' : 'inventory'}
                  size={20}
                  color={BG_SURFACE}
                />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </Text>
                <Text style={styles.subtitle}>
                  {isEditing
                    ? 'Modifica los detalles del producto'
                    : 'Completa la información para registrar un nuevo producto'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Cerrar modal">
              <Icon name="close" size={16} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          {/* ─── Formulario ─── */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}>

            {/* ── Sección: Información Básica ── */}
            <SectionHeader
              icon="info"
              title="Información Básica"
              subtitle="Datos de identificación del producto"
            />
            <SectionCard>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input
                    label="Código *"
                    placeholder="Código de barras o SKU"
                    value={formData.code}
                    onChangeText={v => handleChange('code', v)}
                    error={errors.code}
                  />
                </View>
                <View style={styles.col}>
                  <Input
                    label="Nombre *"
                    placeholder="Nombre del producto"
                    value={formData.name}
                    onChangeText={v => handleChange('name', v)}
                    error={errors.name}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input
                    label="Descripción"
                    placeholder="Descripción breve del producto"
                    value={formData.description}
                    onChangeText={v => handleChange('description', v)}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input
                    label="Presentación"
                    placeholder="Ej. Tableta, Jarabe, Cápsula"
                    value={formData.presentation}
                    onChangeText={v => handleChange('presentation', v)}
                  />
                </View>
                <View style={styles.col}>
                  <Input
                    label="Laboratorio"
                    placeholder="Marca o laboratorio fabricante"
                    value={formData.laboratory}
                    onChangeText={v => handleChange('laboratory', v)}
                  />
                </View>
              </View>
            </SectionCard>

            {/* ── Sección: Precios ── */}
            <SectionHeader
              icon="money"
              title="Precios"
              subtitle="Costos de compra y venta"
            />
            <SectionCard>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input
                    label="Precio de Compra *"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.purchasePrice?.toString()}
                    onChangeText={v =>
                      handleChange('purchasePrice', parseFloat(v) || 0)
                    }
                    error={errors.purchasePrice}
                  />
                </View>
                <View style={styles.col}>
                  <Input
                    label="Precio de Venta *"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.salePrice?.toString()}
                    onChangeText={v =>
                      handleChange('salePrice', parseFloat(v) || 0)
                    }
                    error={errors.salePrice}
                  />
                </View>
              </View>
              {/* Indicador de margen */}
              {formData.purchasePrice !== undefined &&
                formData.salePrice !== undefined &&
                formData.purchasePrice > 0 && (
                  <View style={styles.marginIndicator}>
                    <View style={styles.marginDot} />
                    <Text style={styles.marginText}>
                      Margen:{' '}
                      {(
                        ((formData.salePrice - formData.purchasePrice) /
                          formData.purchasePrice) *
                        100
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                )}
            </SectionCard>

            {/* ── Sección: Inventario y Lote ── */}
            <SectionHeader
              icon="package"
              title="Inventario y Lote"
              subtitle="Cantidades, stock mínimo y caducidad"
            />
            <SectionCard>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input
                    label="Stock Inicial *"
                    placeholder="0"
                    keyboardType="numeric"
                    value={formData.stock?.toString()}
                    onChangeText={v =>
                      handleChange('stock', parseInt(v, 10) || 0)
                    }
                    error={errors.stock}
                  />
                </View>
                <View style={styles.col}>
                  <Input
                    label="Stock Mínimo"
                    placeholder="5"
                    keyboardType="numeric"
                    value={formData.minStock?.toString()}
                    onChangeText={v =>
                      handleChange('minStock', parseInt(v, 10) || 0)
                    }
                  />
                </View>
                <View style={styles.col}>
                  <Input
                    label="Vencimiento"
                    placeholder="YYYY-MM-DD"
                    value={formData.expirationDate}
                    onChangeText={v => handleChange('expirationDate', v)}
                  />
                </View>
              </View>
            </SectionCard>

            {/* ── Sección: Proveedor ── */}
            <SectionHeader
              icon="purchases"
              title="Proveedor"
              subtitle="Relación con el proveedor (opcional)"
            />
            <SectionCard>
              <View style={styles.row}>
                <View style={[styles.col, {maxWidth: '50%'}]}>
                  <Input
                    label="ID Proveedor"
                    placeholder="Opcional"
                    keyboardType="numeric"
                    value={formData.supplierId?.toString() || ''}
                    onChangeText={v =>
                      handleChange(
                        'supplierId',
                        parseInt(v, 10) || undefined,
                      )
                    }
                  />
                </View>
              </View>
            </SectionCard>

            {/* Espaciado inferior para scroll */}
            <View style={{height: 8}} />
          </ScrollView>

          {/* ─── Footer ─── */}
          <View style={styles.footer}>
            <View style={styles.footerHint}>
              <Text style={styles.footerHintText}>
                Los campos marcados con * son obligatorios
              </Text>
            </View>
            <View style={styles.footerActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                accessibilityLabel="Cancelar">
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                accessibilityLabel="Guardar producto">
                <Icon name="save" size={14} color={BG_SURFACE} />
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Actualizar' : 'Guardar Producto'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

/* ─── Estilos ─── */
const styles = StyleSheet.create({
  /* Overlay */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Modal Container */
  modalContainer: {
    backgroundColor: BG_SECTION,
    borderRadius: 16,
    width: '95%',
    maxWidth: 820,
    height: Math.round(Dimensions.get('window').height * 0.88),
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 16,
    overflow: 'hidden',
  },

  /* Acento superior */
  topAccent: {
    height: 4,
    backgroundColor: TEAL,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 28,
    backgroundColor: BG_SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_MAIN,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 3,
    fontWeight: '400',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BG_SECTION,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },

  /* Formulario */
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: 28,
    paddingTop: 24,
  },

  /* Sección Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    gap: 10,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 1,
  },

  /* Tarjeta de sección */
  sectionCard: {
    backgroundColor: BG_SURFACE,
    borderRadius: 12,
    padding: 20,
    paddingTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },

  /* Grid */
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },

  /* Indicador de margen */
  marginIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 8,
    marginTop: 4,
    marginHorizontal: 8,
    gap: 6,
  },
  marginDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
  },
  marginText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEAL_DARK,
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  footerHint: {
    flex: 1,
  },
  footerHintText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '400',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: TEAL,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: BG_SURFACE,
  },
});

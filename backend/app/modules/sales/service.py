from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date

from app.modules.sales.repository import SaleRepository, SaleReceiptRepository
from app.modules.sales.model import Sale, SaleItem, SaleReceipt
from app.modules.sales.schema import SaleCreate
from app.modules.inventory.repository import ProductRepository


class SaleService:

    def __init__(self):
        self.repo = SaleRepository()
        self.receipt_repo = SaleReceiptRepository()
        self.product_repo = ProductRepository()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip, limit)

    def get_by_id(self, db: Session, sale_id: int):
        sale = self.repo.get_by_id(db, sale_id)
        if not sale:
            raise HTTPException(status_code=404, detail="Venta no encontrada")
        return sale

    def create_sale(self, db: Session, data: SaleCreate):
        """
        HU-01: Gestionar venta completa
        - Valida stock por producto
        - Calcula subtotales y total automáticamente
        - HU-08: descuenta stock al finalizar
        """
        if not data.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La venta debe contener al menos un producto"
            )

        sale_items = []
        total = 0.0

        # Validar todos los productos antes de crear la venta
        for item_data in data.items:
            product = self.product_repo.get_by_id(db, item_data.product_id)
            if not product or not product.is_active:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id {item_data.product_id} no encontrado"
                )
            # HU-01: validar stock suficiente
            if product.stock < item_data.quantity:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Stock insuficiente para '{product.name}'. Disponible: {product.stock}"
                )

            subtotal = product.sale_price * item_data.quantity
            total += subtotal
            sale_items.append((product, item_data.quantity, product.sale_price, subtotal))

        # Crear la venta
        sale = Sale(total=round(total, 2), notes=data.notes)
        db.add(sale)
        db.flush()  # obtener ID sin hacer commit todavía

        # Crear ítems y HU-08: actualizar inventario
        for product, qty, unit_price, subtotal in sale_items:
            item = SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                quantity=qty,
                unit_price=unit_price,
                subtotal=round(subtotal, 2)
            )
            db.add(item)
            product.stock -= qty  # HU-08: descuento automático de stock

        # HU-03: generar comprobante automáticamente
        receipt_number = f"REC-{sale.id:06d}"
        receipt = SaleReceipt(
            sale_id=sale.id,
            receipt_number=receipt_number,
            establishment_name="Droguería",
        )
        db.add(receipt)
        db.commit()
        db.refresh(sale)
        return sale

    def get_summary(self, db: Session, date_from: date = None, date_to: date = None):
        """HU-04: resumen de ventas"""
        result = self.repo.get_summary(db, date_from, date_to)
        return {
            "total_sales": float(result.total_sales),
            "transaction_count": result.transaction_count,
            "date_from": str(date_from) if date_from else None,
            "date_to": str(date_to) if date_to else None,
        }

    def get_receipt(self, db: Session, sale_id: int):
        """HU-03: obtener comprobante de venta"""
        self.get_by_id(db, sale_id)  # valida que existe
        receipt = self.receipt_repo.get_by_sale_id(db, sale_id)
        if not receipt:
            raise HTTPException(status_code=404, detail="Comprobante no encontrado")
        return receipt
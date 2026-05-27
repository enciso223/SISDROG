from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database.database import get_db
from app.modules.sales.schema import SaleCreate, SaleResponse, ReceiptResponse, SalesSummaryResponse
from app.modules.sales.controller import SaleController

router = APIRouter(prefix="/sales", tags=["Ventas"])

ctrl = SaleController()


@router.get("", response_model=List[SaleResponse])
def list_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return ctrl.list(db, skip, limit)


@router.post("", response_model=SaleResponse, status_code=201)
def create_sale(data: SaleCreate, db: Session = Depends(get_db)):
    """
    HU-01: Registrar venta completa con múltiples productos.
    Valida stock, calcula total y actualiza inventario automáticamente.
    """
    return ctrl.create(db, data)


@router.get("/summary", response_model=SalesSummaryResponse)
def get_summary(
    date_from: Optional[date] = Query(None, description="Fecha inicio (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="Fecha fin (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """HU-04: Resumen de ventas. Filtrar por día o rango de fechas."""
    return ctrl.get_summary(db, date_from, date_to)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    return ctrl.get(db, sale_id)


@router.get("/{sale_id}/receipt", response_model=ReceiptResponse)
def get_receipt(sale_id: int, db: Session = Depends(get_db)):
    """HU-03: Obtener comprobante de venta."""
    return ctrl.get_receipt(db, sale_id)
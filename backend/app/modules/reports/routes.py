from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database.database import get_db
from app.core.security import get_current_user
from app.modules.auth.model import User
from app.modules.reports.schema import (
    PurchaseHistoryItem,
    FinancialBalanceResponse,
    SalesReportResponse,
    TopProductsResponse,
    InventoryValueResponse
)
from app.modules.reports.controller import ReportsController

router = APIRouter(prefix="/reports", tags=["Reports"])

ctrl = ReportsController()


@router.get("/purchases", response_model=List[PurchaseHistoryItem])
def get_purchase_history(
    skip: int = 0,
    limit: int = 100,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    product_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """HU-10: Historial de compras filtrado por fecha y producto"""
    return ctrl.get_purchase_history(db, skip, limit, date_from, date_to, product_id)


@router.get("/balance", response_model=FinancialBalanceResponse)
def get_financial_balance(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """HU-12: Balance financiero"""
    return ctrl.get_financial_balance(db, date_from, date_to)


@router.get("/sales", response_model=SalesReportResponse)
def get_sales_report(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """HU-13: Reporte de ventas por período"""
    return ctrl.get_sales_report(db, date_from, date_to)


@router.get("/top-products", response_model=TopProductsResponse)
def get_top_products(
    limit: int = Query(10, ge=1, le=50),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """HU-14: Ranking de productos más vendidos"""
    return ctrl.get_top_products(db, limit, date_from, date_to)


@router.get("/inventory-value", response_model=InventoryValueResponse)
def get_inventory_value(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """HU-15: Valor total del inventario"""
    return ctrl.get_inventory_value(db)

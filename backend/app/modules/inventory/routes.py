from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.modules.inventory.schema import (
    ProductCreate, ProductUpdate, ProductResponse,
    CategoryCreate, CategoryResponse,
    SupplierCreate, SupplierUpdate, SupplierResponse,
    StockAlertResponse
)
from app.modules.inventory.controller import ProductController, CategoryController, SupplierController

router = APIRouter(prefix="/inventory", tags=["Inventario"])

product_ctrl = ProductController()
category_ctrl = CategoryController()
supplier_ctrl = SupplierController()


# ─── Productos ────────────────────────────────────────────────

@router.get("/products", response_model=List[ProductResponse])
def list_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """HU-06: listar productos con stock y precios"""
    return product_ctrl.list(db, skip, limit)


@router.get("/products/search", response_model=List[ProductResponse])
def search_products(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """HU-06: búsqueda en tiempo real por nombre o código"""
    return product_ctrl.search(db, q)


@router.get("/products/alerts", response_model=StockAlertResponse)
def get_alerts(
    expiry_days: int = Query(30, description="Días para considerar vencimiento próximo"),
    db: Session = Depends(get_db)
):
    """HU-07: alertas de stock bajo y vencimiento"""
    return product_ctrl.get_alerts(db, expiry_days)


@router.get("/products/code/{code}", response_model=ProductResponse)
def get_product_by_code(code: str, db: Session = Depends(get_db)):
    """HU-02: buscar producto por código de barras"""
    return product_ctrl.get_by_code(db, code)


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return product_ctrl.get(db, product_id)


@router.post("/products", response_model=ProductResponse, status_code=201)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    """HU-05: crear producto"""
    return product_ctrl.create(db, data)


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    """HU-05: editar producto"""
    return product_ctrl.update(db, product_id, data)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """HU-05: eliminar producto"""
    product_ctrl.delete(db, product_id)


# ─── Categorías ───────────────────────────────────────────────

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return category_ctrl.list(db)


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return category_ctrl.create(db, data)


# ─── Proveedores ──────────────────────────────────────────────

@router.get("/suppliers", response_model=List[SupplierResponse])
def list_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return supplier_ctrl.list(db, skip, limit)


@router.get("/suppliers/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    return supplier_ctrl.get(db, supplier_id)


@router.post("/suppliers", response_model=SupplierResponse, status_code=201)
def create_supplier(data: SupplierCreate, db: Session = Depends(get_db)):
    return supplier_ctrl.create(db, data)


@router.put("/suppliers/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, data: SupplierUpdate, db: Session = Depends(get_db)):
    return supplier_ctrl.update(db, supplier_id, data)
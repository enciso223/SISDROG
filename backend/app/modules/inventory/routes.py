from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.modules.inventory.schema import (
    ProductCreate, ProductUpdate, ProductResponse,
    CategoryCreate, CategoryResponse,
    ProductLotCreate, ProductLotResponse,
    StockAlertResponse
)
from app.modules.inventory.service import ProductService, CategoryService, ProductLotService

router = APIRouter(prefix="/inventory", tags=["Inventario"])

product_svc = ProductService()
category_svc = CategoryService()
lot_svc = ProductLotService()


# ─── Productos ────────────────────────────────────────────────

@router.get("/products", response_model=List[ProductResponse])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return product_svc.get_all(db, skip, limit)


@router.get("/products/search", response_model=List[ProductResponse])
def search_products(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return product_svc.search(db, q)


@router.get("/products/alerts", response_model=StockAlertResponse)
def get_alerts(
    expiry_days: int = Query(30, description="Días para considerar vencimiento próximo"),
    db: Session = Depends(get_db)
):
    return product_svc.get_alerts(db, expiry_days)


@router.get("/products/code/{code}", response_model=ProductResponse)
def get_product_by_code(code: str, db: Session = Depends(get_db)):
    return product_svc.get_by_code(db, code)


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return product_svc.get_by_id(db, product_id)


@router.post("/products", response_model=ProductResponse, status_code=201)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    return product_svc.create(db, data)


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    return product_svc.update(db, product_id, data)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product_svc.delete(db, product_id)


# ─── Lotes ───────────────────────────────────────────────────

@router.get("/products/{product_id}/lots", response_model=List[ProductLotResponse])
def get_product_lots(product_id: int, db: Session = Depends(get_db)):
    """Obtener todos los lotes activos de un producto ordenados por fecha de vencimiento"""
    return lot_svc.get_lots_by_product(db, product_id)


@router.post("/products/{product_id}/lots", response_model=ProductLotResponse, status_code=201)
def add_lot(product_id: int, data: ProductLotCreate, db: Session = Depends(get_db)):
    """Agregar un nuevo lote a un producto existente"""
    return lot_svc.add_lot(db, product_id, data)


# ─── Categorías ───────────────────────────────────────────────

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return category_svc.get_all(db)


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return category_svc.create(db, data)

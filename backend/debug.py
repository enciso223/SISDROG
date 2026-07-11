from app.database.database import SessionLocal
from app.modules.inventory.model import Product, ProductLot
from app.modules.sales.model import SaleItem
from app.modules.inventory.schema import ProductCreate, ProductLotCreate
from app.modules.inventory.service import ProductService
from datetime import date
from sqlalchemy import func

def debug_create():
    db = SessionLocal()
    svc = ProductService()
    
    code = "1111"
    lot_number = "LOT-03"
    
    existing_products = svc.repo.get_all_by_code(db, code)
    print(f"Existing products with code {code}: {[p.id for p in existing_products]}")
    
    # Simulate data
    lot_data = ProductLotCreate(lot_number=lot_number, purchase_date=date.today(), expiry_date=date.today(), stock=10)
    
    for p in existing_products:
        print(f"Checking product {p.id} for lot {lot_data.lot_number}")
        dup_lot = (
            db.query(ProductLot)
            .filter(
                ProductLot.product_id == p.id,
                func.lower(ProductLot.lot_number) == func.lower(lot_data.lot_number),
            )
            .first()
        )
        if dup_lot:
            print(f"  FOUND dup_lot! id={dup_lot.id}, is_active={dup_lot.is_active}, p.is_active={p.is_active}")
        else:
            print(f"  NOT FOUND")

if __name__ == "__main__":
    debug_create()

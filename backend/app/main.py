from fastapi import FastAPI

from app.modules.auth.routes import router as auth_router
from app.modules.inventory.routes import router as inventory_router
from app.modules.sales.routes import router as sales_router

app = FastAPI(
    title="Pharmacy Management System",
    version="1.0.0",
    description="Sistema de gestión para droguería"
)

app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(sales_router)


@app.get("/")
def root():
    return {
        "message": "Pharmacy API running successfully",
        "sprint": "Sprint 1 - Ventas e Inventario"
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.routes import router as auth_router
from app.modules.inventory.routes import router as inventory_router
from app.modules.sales.routes import router as sales_router

# ✅ PRIMERO se crea la app
app = FastAPI(
    title="Pharmacy Management System",
    version="1.0.0",
    description="Sistema de gestión para droguería"
)

# ✅ Luego middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Luego routers
app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(sales_router)

# ✅ Endpoint base
@app.get("/")
def root():
    return {
        "message": "Pharmacy API running successfully",
        "sprint": "Sprint 1 - Ventas e Inventario"
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.routes import router as auth_router
from app.modules.inventory.routes import router as inventory_router
from app.modules.sales.routes import router as sales_router
from app.modules.purchases.routes import router as purchases_router
from app.modules.expenses.routes import router as expenses_router
from app.modules.donations.routes import router as donations_router
from app.modules.reports.routes import router as reports_router

app = FastAPI(
    title="Pharmacy Management System",
    version="1.0.0",
    description="Sistema de gestión para droguería"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(sales_router)
app.include_router(purchases_router)
app.include_router(expenses_router)
app.include_router(donations_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "message": "Pharmacy API running successfully",
        "sprint": "Sprint 3 - Reportes y Análisis"
    }


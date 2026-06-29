from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.modules.auth.routes import router as auth_router
from app.modules.donations.routes import router as donations_router
from app.modules.expenses.routes import router as expenses_router
from app.modules.inventory.routes import router as inventory_router
from app.modules.purchases.routes import router as purchases_router
from app.modules.suppliers.routes import router as suppliers_router


app = FastAPI(title="SISDROG API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    return JSONResponse(
        status_code=422,
        content={"detail": "Error de validación en los datos enviados"},
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={
            "detail": (
                "Conflicto de datos: el registro ya existe o viola restricciones"
            )
        },
    )


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(suppliers_router)
app.include_router(purchases_router)
app.include_router(expenses_router)
app.include_router(donations_router)

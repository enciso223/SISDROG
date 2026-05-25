from fastapi import FastAPI
from app.modules.routes import router as medicines_router


app = FastAPI(
    title="Pharmacy Management System",
    version="1.0.0"
)

app.include_router(medicines_router)


@app.get("/")
def root():
    return {"message": "Pharmacy API running successfully"}

from fastapi import FastAPI

from app.modules.auth.routes import router as auth_router

app = FastAPI(
    title="Pharmacy Management System",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/")
def root():

    return {
        "message": "Pharmacy API running successfully"
    }
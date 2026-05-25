from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Medicine(Base):
	__tablename__ = "medicines"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String(255), nullable=False, index=True)
	description = Column(Text, nullable=True)
	price = Column(Float, nullable=False, default=0.0)
	quantity = Column(Integer, nullable=False, default=0)
	created_at = Column(DateTime(timezone=True), server_default=func.now())



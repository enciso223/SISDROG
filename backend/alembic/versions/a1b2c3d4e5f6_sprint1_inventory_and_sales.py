"""Sprint 1 - inventory and sales tables

Revision ID: a1b2c3d4e5f6
Revises: fc7829396705
Create Date: 2026-05-26 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'fc7829396705'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # categories
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)

    # suppliers
    op.create_table(
        'suppliers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('contact', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_suppliers_id'), 'suppliers', ['id'], unique=False)

    # products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('presentation', sa.String(), nullable=True),
        sa.Column('laboratory', sa.String(), nullable=True),
        sa.Column('purchase_price', sa.Float(), nullable=False),
        sa.Column('sale_price', sa.Float(), nullable=False),
        sa.Column('batch', sa.String(), nullable=True),
        sa.Column('expiry_date', sa.Date(), nullable=True),
        sa.Column('stock', sa.Integer(), nullable=True),
        sa.Column('min_stock', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=True),
        sa.Column('supplier_id', sa.Integer(), sa.ForeignKey('suppliers.id'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.create_index(op.f('ix_products_code'), 'products', ['code'], unique=True)
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)

    # sales
    op.create_table(
        'sales',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('total', sa.Float(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sales_id'), 'sales', ['id'], unique=False)

    # sale_items
    op.create_table(
        'sale_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sale_id', sa.Integer(), sa.ForeignKey('sales.id'), nullable=False),
        sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Float(), nullable=False),
        sa.Column('subtotal', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sale_items_id'), 'sale_items', ['id'], unique=False)

    # sale_receipts
    op.create_table(
        'sale_receipts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sale_id', sa.Integer(), sa.ForeignKey('sales.id'), unique=True, nullable=False),
        sa.Column('receipt_number', sa.String(), nullable=False),
        sa.Column('establishment_name', sa.String(), nullable=True),
        sa.Column('establishment_address', sa.String(), nullable=True),
        sa.Column('establishment_phone', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('receipt_number')
    )
    op.create_index(op.f('ix_sale_receipts_id'), 'sale_receipts', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('sale_receipts')
    op.drop_table('sale_items')
    op.drop_table('sales')
    op.drop_table('products')
    op.drop_table('suppliers')
    op.drop_table('categories')
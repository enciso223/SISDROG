/**
 * Servicio de donaciones: expone operaciones contra /donations.
 *
 * Este proyecto usa las donaciones para dos flujos:
 *  - Entrada ("received"): aumenta el inventario (se registra desde Inventario).
 *  - Salida  ("delivered"): disminuye el inventario (se registra desde Ventas
 *    marcando la venta actual como donación, con precio a pagar $0).
 */

import apiClient from './api';

export type DonationType = 'received' | 'delivered';

export interface DonationItemInput {
  productId: number;
  quantity: number;
}

export interface DonationInput {
  donationType: DonationType;
  donorOrRecipient?: string;
  /** Fecha en formato YYYY-MM-DD. Por defecto, hoy. */
  donationDate?: string;
  items: DonationItemInput[];
  notes?: string;
}

interface DonationItemBackend {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
}

interface DonationBackend {
  id: number;
  donation_type: DonationType;
  donor_or_recipient?: string | null;
  donation_date: string;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  items: DonationItemBackend[];
}

export interface Donation {
  id: number;
  donationType: DonationType;
  donorOrRecipient?: string;
  donationDate: string;
  notes?: string;
  createdAt: string;
  items: {id: number; productId: number; productName?: string; quantity: number}[];
}

function mapToDonation(data: DonationBackend): Donation {
  return {
    id: data.id,
    donationType: data.donation_type,
    donorOrRecipient: data.donor_or_recipient ?? undefined,
    donationDate: data.donation_date,
    notes: data.notes ?? undefined,
    createdAt: data.created_at,
    items: (data.items || []).map(i => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      quantity: i.quantity,
    })),
  };
}

/** Fecha de hoy en formato YYYY-MM-DD (zona local). */
function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

class DonationsService {
  async getAll(type?: DonationType): Promise<Donation[]> {
    const response = await apiClient.get<DonationBackend[]>('/donations', {
      params: type ? { donation_type: type } : undefined
    });
    return response.data.map(mapToDonation);
  }

  async create(data: DonationInput): Promise<Donation> {
    const payload = {
      donation_type: data.donationType,
      donor_or_recipient: data.donorOrRecipient,
      donation_date: data.donationDate ?? todayISO(),
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      notes: data.notes,
    };

    const response = await apiClient.post<DonationBackend>(
      '/donations',
      payload,
    );
    return mapToDonation(response.data);
  }
}

export const donationsService = new DonationsService();

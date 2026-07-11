import {useState, useCallback} from 'react';
import {donationsService, DonationType} from '../services/DonationsService';
import {Donation, DonationInput} from '../services/DonationsService'; // Reusing from service as model isn't separated

interface UseDonationsControllerReturn {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  fetchDonations: (type?: DonationType) => Promise<void>;
  createDonation: (data: DonationInput) => Promise<void>;
  clearError: () => void;
}

export const useDonationsController = (): UseDonationsControllerReturn => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async (type?: DonationType): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await donationsService.getAll(type);
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar donaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDonation = useCallback(async (data: DonationInput): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newDonation = await donationsService.create(data);
      setDonations(prev => [...prev, newDonation]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar donación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    donations,
    loading,
    error,
    fetchDonations,
    createDonation,
    clearError,
  };
};

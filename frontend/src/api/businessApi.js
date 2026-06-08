import { apiFetch } from './apiClient';

export async function fetchBusiness(licenseNumber) {
  try {
    return await apiFetch(`/api/business/${encodeURIComponent(licenseNumber)}`);
  } catch (error) {
    if (error.status === 404) {
      return { notFound: true };
    }
    throw error;
  }
}

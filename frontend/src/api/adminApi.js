import { apiFetch } from './apiClient';

export function fetchBusinesses() {
  return apiFetch('/api/admin/businesses');
}

export function createBusiness(payload) {
  return apiFetch('/api/admin/businesses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBusiness(id, payload) {
  return apiFetch(`/api/admin/businesses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteBusiness(id) {
  return apiFetch(`/api/admin/businesses/${id}`, {
    method: 'DELETE',
  });
}

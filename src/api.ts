/**
 * Centralized API client - all server communication goes through here
 */
import type { Restaurant, Table, MenuItem, Order, OrderItem } from './types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Settings ────────────────────────────────────────────────
export const api = {
  getSettings: () => request<Record<string, string>>('/settings'),

  saveSettings: (data: Record<string, string>) =>
    request<{ success: boolean }>('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // ── Restaurants ──
  getRestaurants: () => request<Restaurant[]>('/restaurants'),

  createRestaurant: (r: Restaurant) =>
    request<{ success: boolean }>('/restaurants', { method: 'POST', body: JSON.stringify(r) }),

  updateRestaurant: (r: Restaurant) =>
    request<{ success: boolean }>(`/restaurants/${r.id}`, { method: 'PUT', body: JSON.stringify(r) }),

  deleteRestaurant: (id: string) =>
    request<{ success: boolean }>(`/restaurants/${id}`, { method: 'DELETE' }),

  // ── Tables ──
  getTables: () => request<Table[]>('/tables'),

  createTable: (t: Table) =>
    request<{ success: boolean }>('/tables', { method: 'POST', body: JSON.stringify(t) }),

  updateTable: (id: string, data: Partial<Table>) =>
    request<{ success: boolean }>(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteTable: (id: string) =>
    request<{ success: boolean }>(`/tables/${id}`, { method: 'DELETE' }),

  // ── Menu Items ──
  getMenuItems: () => request<MenuItem[]>('/menu-items'),

  createMenuItem: (item: MenuItem) =>
    request<{ success: boolean }>('/menu-items', { method: 'POST', body: JSON.stringify(item) }),

  updateMenuItem: (id: string, data: Partial<MenuItem>) =>
    request<{ success: boolean }>(`/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMenuItem: (id: string) =>
    request<{ success: boolean }>(`/menu-items/${id}`, { method: 'DELETE' }),

  // ── Orders ──
  getOrders: () => request<Order[]>('/orders'),

  createOrder: (order: Order) =>
    request<{ success: boolean }>('/orders', { method: 'POST', body: JSON.stringify(order) }),

  updateOrder: (id: string, data: { status?: Order['status']; paymentMethod?: Order['paymentMethod'] }) =>
    request<{ success: boolean }>(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // ── Reset ──
  resetAll: () => request<{ success: boolean }>('/reset', { method: 'POST' }),
};

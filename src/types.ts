/**
 * QR Menu & Table System - TypeScript Types
 * Iraq Edition 🇮🇶
 */

export type ThemeMode = 'light' | 'dark';
export type Lang = 'ar' | 'en';

export type ActiveTab =
  | 'dashboard'
  | 'tables'
  | 'menu'
  | 'orders'
  | 'themes'
  | 'reports'
  | 'settings';

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  phone: string;
  address: string;
  city: string;
  currency: string;
  taxRate: number;
  serviceCharge: number;
  paymentMode: 'before' | 'after';
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'empty' | 'occupied' | 'ordering' | 'waiting' | 'eating' | 'dirty';
  qrCodeSeed: string;
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  available: boolean;
  isPopular?: boolean;
  restaurantId?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  priceAtOrder: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  service: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
  createdAt: string;
  paymentMethod?: 'cash' | 'card';
}

export interface MenuTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  primary: string;
  secondary: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  bgClass: string;
  cardClass: string;
  fontClass: string;
  badgeClass: string;
}

export interface NotificationPayload {
  title: string;
  subtitle?: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

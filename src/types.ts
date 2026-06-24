/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
  | 'settings' 
  | 'customer-simulator';

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number; // e.g. 0.15 for 15% VAT
  serviceCharge: number; // flat fee or percentage
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'empty' | 'ordering' | 'waiting' | 'eating' | 'dirty';
  qrCodeSeed: string; // custom string to display or represent QR code
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
  createdAt: string; // ISO String
  paymentMethod?: 'cash' | 'card';
}

export interface MenuTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  primary: string; // Hex color
  secondary: string;
  accent: string;
  gradientFrom: string; // Tailwind color class or hex
  gradientTo: string;
  bgClass: string; // e.g. bg-white dark:bg-zinc-900
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

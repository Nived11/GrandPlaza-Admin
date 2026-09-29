'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { extractErrorMessages } from '@/utils/extractErrorMessages';
import { getStaffOrdersApi, updateOrderStatusApi } from '../api/orderApi';
import { AdminOrder, OrderStatus, PaymentStatus } from '../types/orderTypes';

// 🔔 Clean Web Audio API Chime for New Order Notification
const playNewOrderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First Ding (D5 - 587 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second Ding (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.18);
    gain2.gain.setValueAtTime(0.35, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.debug('Audio chime playback inhibited by browser interaction policy:', err);
  }
};

export function useLiveOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('preparing');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const knownOrderIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Initialize sound settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('grandplaza_order_sound');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('grandplaza_order_sound', String(next));
      }
      return next;
    });
  };

  // Fetch Orders
  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);

    try {
      const response = await getStaffOrdersApi({
        search: searchQuery,
        payment_status: paymentFilter !== 'all' ? paymentFilter : undefined,
      });

      let orderList: AdminOrder[] = [];
      if (Array.isArray(response)) {
        orderList = response;
      } else if (response && Array.isArray(response.results)) {
        orderList = response.results;
      } else if (response && Array.isArray(response.data)) {
        orderList = response.data;
      }

      // Check for incoming new orders to ring chime
      if (!isFirstLoadRef.current && soundEnabled) {
        const hasNewOrder = orderList.some(
          (o) =>
            !knownOrderIdsRef.current.has(o.id) &&
            (o.status === 'pending' || o.status === 'preparing')
        );

        if (hasNewOrder) {
          playNewOrderChime();
          toast.info('🔔 New Order received in Kitchen!', {
            duration: 4000,
          });
        }
      }

      // Update known IDs
      orderList.forEach((o) => knownOrderIdsRef.current.add(o.id));
      isFirstLoadRef.current = false;

      setOrders(orderList);
    } catch (err: unknown) {
      console.error('Error fetching staff orders:', err);
      if (!isSilent) {
        const msg = extractErrorMessages(err);
        toast.error(msg);
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [searchQuery, paymentFilter, soundEnabled]);

  // Initial fetch
  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // Polling every 12 seconds for real-time live order updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 12000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  // Status metrics calculation
  const stats = {
    total: orders.length,
    // Group pending and preparing together for kitchen
    preparing: orders.filter((o) => o.status === 'preparing' || o.status === 'pending').length,
    ready_for_pickup: orders.filter((o) => o.status === 'ready_for_pickup').length,
    out_for_delivery: orders.filter((o) => o.status === 'out_for_delivery').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // Filter orders according to active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'preparing') {
      return order.status === 'preparing' || order.status === 'pending';
    }
    return order.status === activeTab;
  });

  // Update order status with optimistic update
  const updateStatus = async (orderId: number, nextStatus: OrderStatus, paymentStatus?: PaymentStatus) => {
    setIsUpdating(true);
    try {
      await updateOrderStatusApi(orderId, nextStatus, paymentStatus);

      // Optimistic UI update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: nextStatus,
                payment_status: paymentStatus || o.payment_status,
                updated_at: new Date().toISOString(),
              }
            : o
        )
      );

      const statusLabels: Record<OrderStatus, string> = {
        pending: 'Pending',
        preparing: 'In Kitchen (Preparing)',
        ready_for_pickup: 'Food Ready (Packed)',
        out_for_delivery: 'Dispatched to Delivery Boy',
        delivered: 'Delivered Successfully',
        cancelled: 'Cancelled',
      };

      toast.success(`Order #${orderId} moved to "${statusLabels[nextStatus]}"`);
      return true;
    } catch (err: unknown) {
      console.error('Error updating order status:', err);
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    orders: filteredOrders,
    allOrders: orders,
    stats,
    loading,
    isUpdating,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    paymentFilter,
    setPaymentFilter,
    autoRefresh,
    setAutoRefresh,
    soundEnabled,
    toggleSound,
    refreshOrders: () => fetchOrders(false),
    updateStatus,
  };
}

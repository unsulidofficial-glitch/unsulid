'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Download,
  Filter,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Eye,
  Truck,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Selected Order for Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingAwb, setTrackingAwb] = useState('');
  const [courierName, setCourierName] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const loadOrders = () => {
    setLoading(true);
    api.admin
      .getOrders({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentMethod: paymentFilter || undefined,
      })
      .then((res) => {
        if (res?.orders) setOrders(res.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleOpenStatusModal = (ord: any) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingAwb(ord.shipment?.awbNumber || '');
    setCourierName(ord.shipment?.courierName || 'BlueDart Express Air');
    setStatusNotes('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    setMessage(null);

    try {
      const res = await api.admin.updateOrderStatus(selectedOrder.id, {
        orderStatus: newStatus,
        trackingAwb: trackingAwb.trim() || undefined,
        courierName: courierName.trim() || undefined,
        notes: statusNotes.trim() || undefined,
      });

      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update order status', isError: true });
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCsv = () => {
    window.open('http://localhost:3000/api/admin/reports/orders/export', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
            FULFILLMENT DESK
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">Order Management</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Track customer orders, update dispatch statuses, and monitor Surat logistics.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-sans font-semibold border border-white/10 transition-colors self-start sm:self-center"
        >
          <Download className="w-4 h-4 text-[#C6A15B]" />
          <span>Export Orders to CSV</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-sans flex items-center gap-2 ${
            message.isError
              ? 'bg-red-950/80 border border-red-800 text-red-200'
              : 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
          }`}
        >
          {message.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or phone..."
            className="w-full bg-black/60 border border-white/15 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
          >
            <option value="">All Payment Types</option>
            <option value="PREPAID">Prepaid (Razorpay)</option>
            <option value="COD">Cash on Delivery (COD)</option>
          </select>

          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="text-white/40 uppercase tracking-wider text-[10px] border-b border-white/10">
            <tr>
              <th className="pb-3">Order Number</th>
              <th className="pb-3">Customer Contact</th>
              <th className="pb-3">Items Summary</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Grand Total</th>
              <th className="pb-3 text-right">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-white/40">
                  No orders match the selected criteria.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <span className="font-mono font-bold text-sm text-white block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>

                  <td className="py-4">
                    <strong className="text-white block">{ord.customerSnapshot?.name}</strong>
                    <span className="text-[11px] font-mono text-[#C6A15B]">
                      {ord.customerSnapshot?.phone}
                    </span>
                    <span className="text-[11px] text-white/40 block">
                      {ord.addressSnapshot?.city}, {ord.addressSnapshot?.state}
                    </span>
                  </td>

                  <td className="py-4 max-w-xs truncate text-white/80">
                    {ord.items.map((i: any) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-300'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-red-950 text-red-300'
                          : 'bg-[#5B0F18] text-white'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>

                  <td className="py-4 font-mono text-[11px]">
                    <span className="text-white block uppercase font-semibold">
                      {ord.paymentMethod}
                    </span>
                    <span
                      className={
                        ord.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                      }
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 font-serif font-bold text-sm text-[#C6A15B]">
                    ₹{ord.grandTotal.toLocaleString('en-IN')}
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(ord)}
                      className="px-3 py-1.5 rounded-lg bg-[#5B0F18] hover:bg-[#741522] text-white text-xs font-semibold transition-colors"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141414] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A15B] font-bold block">
                  ORDER FULFILLMENT
                </span>
                <h2 className="font-serif text-xl font-bold">{selectedOrder.orderNumber}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-white/70 font-medium mb-1.5">Fulfillment Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="CONFIRMED">CONFIRMED (Ready to pack in Surat)</option>
                  <option value="PROCESSING">PROCESSING (Compounding &amp; Inspection)</option>
                  <option value="PACKED">PACKED (Sealed in velvet coffret)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Express Courier)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                  <option value="CANCELLED">CANCELLED (Restores Stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">
                  Airway Bill Number (AWB)
                </label>
                <input
                  type="text"
                  value={trackingAwb}
                  onChange={(e) => setTrackingAwb(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">
                  Fulfillment Notes / Cancellation Reason
                </label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Optional status change remarks..."
                  className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/5"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold text-xs hover:bg-[#741522]"
                >
                  {updating ? 'Updating...' : 'Commit Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import { Wrench, CheckCircle2 } from 'lucide-react';

interface AdminServicesClientProps {
  initialRequests: any[];
}

export default function AdminServicesClient({ initialRequests }: AdminServicesClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id || null);
  const [selectedStatus, setSelectedStatus] = useState(
    initialRequests[0]?.status || 'NEW'
  );
  const [adminNotes, setAdminNotes] = useState(
    initialRequests[0]?.admin_notes || ''
  );
  const [saving, setSaving] = useState(false);

  const selected = requests.find((r) => r.id === selectedId);

  const handleSelect = (sr: any) => {
    setSelectedId(sr.id);
    setSelectedStatus(sr.status);
    setAdminNotes(sr.admin_notes || '');
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          admin_notes: adminNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((item) =>
            item.id === selected.id
              ? { ...item, status: selectedStatus, admin_notes: adminNotes }
              : item
          )
        );
        alert('Service request updated successfully!');
      }
    } catch (e) {
      alert('Error updating service request');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="bg-[#E0F2FE] text-[#0284C7] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            New
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-[#FEF3C7] text-[#D97706] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            In progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-[#DCFCE7] text-[#16A34A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
        Service Requests
      </h2>
      <p className="text-xs text-[#726861]">
        Murals, ceramics commissions, and custom paintings requested by clients
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {requests.map((sr) => {
            const isCurrent = sr.id === selectedId;
            return (
              <div
                key={sr.id}
                onClick={() => handleSelect(sr)}
                className={`p-4 rounded-[4px] border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#FAF4EC] border-[#BA4E25] shadow-xs'
                    : 'bg-[#FDFBF9] border-[#E7E0D8] hover:border-[#BA4E25]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[#281C18]">
                    {sr.guest_name}
                  </span>
                  {getStatusBadge(sr.status)}
                </div>
                <div className="text-xs font-semibold text-[#429599] uppercase tracking-wider mb-1">
                  {sr.service_type}
                </div>
                <p className="text-xs text-[#726861] line-clamp-1">{sr.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-5 shadow-xs">
          {selected ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#BA4E25] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase">
                    {selected.service_type}
                  </span>
                  <span className="text-xs text-[#8F8178]">
                    {new Date(selected.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                  {selected.guest_name}
                </h3>
                <p className="text-xs text-[#726861] mt-0.5">
                  Contact: <strong className="text-[#281C18]">{selected.guest_contact}</strong>
                </p>
              </div>

              <div className="bg-[#FAF4EC] border border-[#EBE4DA] rounded-[4px] p-4 text-sm text-[#3E332E] leading-relaxed">
                {selected.description}
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  STATUS
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-48 text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  INTERNAL CURATOR NOTES
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes on artist assignment, dimensions, quote..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs px-5 py-2.5 rounded-[3px] transition-all shadow-xs"
              >
                {saving ? 'Saving...' : 'Update Status & Notes'}
              </button>
            </>
          ) : (
            <p className="text-xs text-[#8F8178]">Select a service request to view.</p>
          )}
        </div>
      </div>
    </div>
  );
}

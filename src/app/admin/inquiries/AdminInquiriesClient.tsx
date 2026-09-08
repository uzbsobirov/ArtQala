'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface AdminInquiriesClientProps {
  initialInquiries: any[];
}

export default function AdminInquiriesClient({ initialInquiries }: AdminInquiriesClientProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedId, setSelectedId] = useState(initialInquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(
    initialInquiries[0]?.status || 'NEW'
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const selected = inquiries.find((i) => i.id === selectedId);

  const handleSelect = (inq: any) => {
    setSelectedId(inq.id);
    setSelectedStatus(inq.status);
    setReplyText(inq.admin_reply || '');
    setSuccess(false);
  };

  const handleSendReply = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          admin_reply: replyText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selected.id
              ? { ...item, status: selectedStatus, admin_reply: replyText }
              : item
          )
        );
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      alert('Failed to update inquiry');
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
      case 'ANSWERED':
        return (
          <span className="bg-[#DCFCE7] text-[#16A34A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            Answered
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
        Inquiries
      </h2>

      {/* 2-Column Layout matching AdminInquiries.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inquiries List */}
        <div className="lg:col-span-5 space-y-3">
          {inquiries.map((inq) => {
            const isCurrent = inq.id === selectedId;
            return (
              <div
                key={inq.id}
                onClick={() => handleSelect(inq)}
                className={`p-4 rounded-[4px] border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#FAF4EC] border-[#BA4E25] shadow-xs'
                    : 'bg-[#FDFBF9] border-[#E7E0D8] hover:border-[#BA4E25]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#281C18]">
                    {inq.guest_name || 'Guest Customer'}
                  </span>
                  {getStatusBadge(inq.status)}
                </div>
                <div className="text-xs text-[#726861]">
                  {inq.painting?.title_en || 'Artwork inquiry'} ·{' '}
                  {new Date(inq.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Message & Reply Pane */}
        <div className="lg:col-span-7 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-5 shadow-xs">
          {selected ? (
            <>
              {/* Customer Header */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                  {selected.guest_name}
                </h3>
                <p className="text-xs text-[#726861] mt-0.5">
                  {selected.guest_email} · {selected.guest_phone || 'SAMARKAND'} ·{' '}
                  <span className="text-[#281C18] font-semibold">
                    {selected.painting?.title_en} (${selected.painting?.price})
                  </span>
                </p>
              </div>

              {/* Inquired Message Bubble matching AdminInquiries.png */}
              <div className="bg-[#FAF4EC] border border-[#EBE4DA] rounded-[4px] p-5 text-sm text-[#3E332E] leading-relaxed italic">
                "{selected.message}"
              </div>

              {/* Status Selector */}
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
                  <option value="ANSWERED">Answered</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Reply Textarea matching AdminInquiries.png */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  REPLY MESSAGE
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply to customer..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                />
              </div>

              {success && (
                <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Reply saved and status updated!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendReply}
                disabled={saving}
                className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs px-5 py-2.5 rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Send Reply'}</span>
              </button>
            </>
          ) : (
            <p className="text-xs text-[#8F8178]">Select an inquiry to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wrench, CheckCircle2, Send, Shield, User, Loader2, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AdminServicesClientProps {
  initialRequests: any[];
}

export default function AdminServicesClient({ initialRequests }: AdminServicesClientProps) {
  const { t } = useApp();
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id || null);
  const [selectedStatus, setSelectedStatus] = useState(
    initialRequests[0]?.status || 'NEW'
  );
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = requests.find((r) => r.id === selectedId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedId, selected?.messages]);

  const handleSelect = async (sr: any) => {
    setSelectedId(sr.id);
    setSelectedStatus(sr.status);
    setReplyText('');
    setSuccess(false);

    // Mark unread customer messages as read
    const hasUnread = (sr.messages || []).some(
      (m: any) => m.sender === 'CUSTOMER' && !m.is_read
    );

    if (hasUnread) {
      try {
        await fetch(`/api/services/${sr.id}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewer: 'ADMIN' }),
        });

        setRequests((prev) =>
          prev.map((item) =>
            item.id === sr.id
              ? {
                  ...item,
                  messages: (item.messages || []).map((m: any) =>
                    m.sender === 'CUSTOMER' ? { ...m, is_read: true } : m
                  ),
                }
              : item
          )
        );
      } catch (err) {
        console.error('Error marking read:', err);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selected || !replyText.trim() || saving) return;
    setSaving(true);
    const targetStatus = selectedStatus === 'NEW' ? 'IN_PROGRESS' : selectedStatus;

    try {
      const res = await fetch(`/api/services/${selected.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'ADMIN',
          message: replyText.trim(),
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setSelectedStatus(targetStatus);
        setRequests((prev) =>
          prev.map((item) =>
            item.id === selected.id
              ? {
                  ...item,
                  status: targetStatus,
                  messages: [...(item.messages || []), data.message],
                  admin_notes: replyText.trim(),
                }
              : item
          )
        );
        setReplyText('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      alert('Serverga ulanishda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    if (!selected) return;

    try {
      await fetch(`/api/admin/services/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setRequests((prev) =>
        prev.map((item) => (item.id === selected.id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="bg-[#E0F2FE] text-[#0284C7] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {t.admin.new}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-[#FEF3C7] text-[#D97706] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {t.admin.inProgress}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-[#DCFCE7] text-[#16A34A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {t.admin.completed}
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
            {t.admin.services}
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Murals, ceramics commissions, and custom artwork requests
          </p>
        </div>
        <span className="text-xs text-[#726861]">
          {requests.length} {t.admin.all.toLowerCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {requests.map((sr) => {
            const isCurrent = sr.id === selectedId;
            const messages = sr.messages || [];
            const unreadCustomer = messages.filter(
              (m: any) => m.sender === 'CUSTOMER' && !m.is_read
            ).length;
            const lastMsg = messages[messages.length - 1];

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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#281C18]">
                      {sr.guest_name}
                    </span>
                    {unreadCustomer > 0 && (
                      <span className="bg-[#BA4E25] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCustomer} yangi
                      </span>
                    )}
                  </div>
                  {getStatusBadge(sr.status)}
                </div>
                <div className="text-xs font-semibold text-[#429599] uppercase tracking-wider mb-1">
                  {sr.service_type}
                </div>

                {lastMsg ? (
                  <p className="text-[11.5px] text-[#554740] line-clamp-1 italic bg-[#F7F3EE] p-1.5 rounded-[2px]">
                    <strong>{lastMsg.sender === 'ADMIN' ? 'Kurator: ' : 'Mijoz: '}</strong>
                    {lastMsg.message}
                  </p>
                ) : (
                  <p className="text-xs text-[#554740] line-clamp-2 italic">
                    "{sr.description}"
                  </p>
                )}

                <div className="text-[10px] text-[#8F8178] mt-1 text-right">
                  {new Date(sr.created_at).toLocaleDateString('en-US', {
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

        {/* Right Detail / Chat Pane */}
        <div className="lg:col-span-7 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-5 shadow-xs">
          {selected ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EAE1] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#BA4E25] uppercase tracking-wider">
                      {selected.service_type}
                    </span>
                    <span className="text-[#A8988E]">·</span>
                    <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                      {selected.guest_name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#726861] mt-0.5">
                    Contact: <strong className="text-[#281C18]">{selected.guest_contact}</strong>
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase">
                    STATUS:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  >
                    <option value="NEW">{t.admin.new}</option>
                    <option value="IN_PROGRESS">{t.admin.inProgress}</option>
                    <option value="COMPLETED">{t.admin.completed}</option>
                  </select>
                </div>
              </div>

              {/* Thread History */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {(selected.messages || []).length === 0 ? (
                  <div className="bg-[#FAF4EC] border border-[#EBE4DA] rounded-[4px] p-5 text-sm text-[#3E332E] italic">
                    "{selected.description}"
                  </div>
                ) : (
                  (selected.messages || []).map((msg: any) => {
                    const isCustomer = msg.sender === 'CUSTOMER';
                    const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const dateStr = new Date(msg.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-[10.5px] mb-1 font-medium ${
                            isCustomer ? 'text-[#726861]' : 'text-[#8F8178] flex-row-reverse'
                          }`}
                        >
                          {isCustomer ? (
                            <>
                              <User className="w-3 h-3 text-[#BA4E25]" />
                              <span>{selected.guest_name || 'Customer'}</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-3 h-3 text-[#DAA932]" />
                              <span className="text-[#DAA932] font-semibold">Art Qala Curator (Siz)</span>
                            </>
                          )}
                          <span className="text-[#B5A599]">· {dateStr}, {timeStr}</span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-[4px] px-4 py-3 text-xs leading-relaxed shadow-xs ${
                            isCustomer
                              ? 'bg-[#FAF4EC] text-[#281C18] border border-[#E7E0D8] rounded-tl-none'
                              : 'bg-[#281C18] text-[#FAF4EC] rounded-tr-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <div className="pt-2 border-t border-[#F0EAE1] space-y-3">
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase">
                  KURATOR JAVOBI VA MULOHAZALARI
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Mijozga xizmat (eskizlar, narx, muddat) bo'yicha javob yozing..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                />

                {success && (
                  <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span>Javob chatga qo'shildi va email xabarnoma yuborildi!</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8F8178] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#429599]" />
                    <span>Email kontaktiga avtomatik xabarnoma boradi</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={saving || !replyText.trim()}
                    className="bg-[#BA4E25] hover:bg-[#9C3E1B] disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{saving ? 'Yuborilmoqda...' : 'Javobni yuborish'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-[#8F8178]">Tafsilotlarni ko'rish uchun so'rovni tanlang.</p>
          )}
        </div>
      </div>
    </div>
  );
}

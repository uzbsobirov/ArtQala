'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Shield, User, Clock, Loader2, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AdminInquiriesClientProps {
  initialInquiries: any[];
}

export default function AdminInquiriesClient({ initialInquiries }: AdminInquiriesClientProps) {
  const { t, formatPrice } = useApp();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedId, setSelectedId] = useState(initialInquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(
    initialInquiries[0]?.status || 'NEW'
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = inquiries.find((i) => i.id === selectedId);

  // Auto scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedId, selected?.messages]);

  const handleSelect = async (inq: any) => {
    setSelectedId(inq.id);
    setSelectedStatus(inq.status);
    setReplyText('');
    setSuccess(false);

    // Mark customer messages as read by admin
    const hasUnreadCustomer = (inq.messages || []).some(
      (m: any) => m.sender === 'CUSTOMER' && !m.is_read
    );

    if (hasUnreadCustomer) {
      try {
        await fetch(`/api/inquiries/${inq.id}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewer: 'ADMIN' }),
        });

        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inq.id
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
    const targetStatus = selectedStatus === 'NEW' || selectedStatus === 'IN_PROGRESS'
      ? 'ANSWERED'
      : selectedStatus;

    try {
      const res = await fetch(`/api/inquiries/${selected.id}/messages`, {
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
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selected.id
              ? {
                  ...item,
                  status: targetStatus,
                  messages: [...(item.messages || []), data.message],
                  admin_reply: replyText.trim(),
                }
              : item
          )
        );
        setReplyText('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.error || 'Javobni saqlashda xatolik yuz berdi');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    if (!selected) return;

    try {
      await fetch(`/api/admin/inquiries/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setInquiries((prev) =>
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
      case 'ANSWERED':
        return (
          <span className="bg-[#DCFCE7] text-[#16A34A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {t.admin.answered}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-[#F3E8FF] text-[#9333EA] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
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
        <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
          {t.admin.inquiries}
        </h2>
        <span className="text-xs text-[#726861]">
          {inquiries.length} {t.admin.all.toLowerCase()}
        </span>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inquiries List */}
        <div className="lg:col-span-5 space-y-3">
          {inquiries.map((inq) => {
            const isCurrent = inq.id === selectedId;
            const messages = inq.messages || [];
            const unreadCustomerMsgs = messages.filter(
              (m: any) => m.sender === 'CUSTOMER' && !m.is_read
            ).length;
            const lastMessage = messages[messages.length - 1];

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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#281C18]">
                      {inq.guest_name || 'Guest Customer'}
                    </span>
                    {unreadCustomerMsgs > 0 && (
                      <span className="bg-[#BA4E25] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCustomerMsgs} yangi
                      </span>
                    )}
                  </div>
                  {getStatusBadge(inq.status)}
                </div>

                <div className="text-xs text-[#726861] mb-1 truncate">
                  {inq.painting?.title_en || 'Artwork inquiry'} · {inq.painting?.price ? `$${inq.painting.price}` : ''}
                </div>

                {lastMessage && (
                  <p className="text-[11.5px] text-[#554740] line-clamp-1 italic bg-[#F7F3EE] p-1.5 rounded-[2px]">
                    <strong>{lastMessage.sender === 'ADMIN' ? 'Kurator: ' : 'Mijoz: '}</strong>
                    {lastMessage.message}
                  </p>
                )}

                <div className="text-[10px] text-[#8F8178] mt-1 text-right">
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

        {/* Right: Message & Reply Thread Pane */}
        <div className="lg:col-span-7 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-5 shadow-xs">
          {selected ? (
            <>
              {/* Customer & Painting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EAE1] gap-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                    {selected.guest_name}
                  </h3>
                  <p className="text-xs text-[#726861] mt-0.5">
                    {selected.guest_email} {selected.guest_phone ? `· ${selected.guest_phone}` : ''} ·{' '}
                    <span className="text-[#281C18] font-semibold">
                      {selected.painting?.title_en} (${selected.painting?.price})
                    </span>
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
                    <option value="ANSWERED">{t.admin.answered}</option>
                    <option value="COMPLETED">{t.admin.completed}</option>
                  </select>
                </div>
              </div>

              {/* Thread History */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {(selected.messages || []).length === 0 ? (
                  <div className="bg-[#FAF4EC] border border-[#EBE4DA] rounded-[4px] p-5 text-sm text-[#3E332E] italic">
                    "{selected.message}"
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

              {/* Reply Input Form */}
              <div className="pt-2 border-t border-[#F0EAE1] space-y-3">
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase">
                  KURATOR JAVOBI (CHAT ORQALI)
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Mijozga javob yozing... Yuborilganda mijoz shaxsiy kabinetida darhol ko'radi va email xabarnoma oladi."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                />

                {success && (
                  <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span>Javob chatga qo'shildi va mijozga Resend orqali email xabarnoma yuborildi!</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8F8178] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#429599]" />
                    <span>Resend email xabarnoma avtomatik jo'natiladi</span>
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

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Bot,
  Bell,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Sliders,
  HelpCircle,
  Truck,
  Package,
} from 'lucide-react';
import {
  simulateWhatsAppRequest,
  getWhatsAppConfigRequest,
  sendCustomWhatsAppRequest,
} from '../lib/api';

interface WhatsAppConfig {
  meta_configured: boolean;
  twilio_configured: boolean;
  admin_phone: string;
  webhook_verify_token: string;
}

export default function WhatsAppAutomationHub({ token }: { token?: string | null }) {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Simulator State
  const [simQuery, setSimQuery] = useState('Track JRQ');
  const [simPhone, setSimPhone] = useState('919919388211');
  const [simLoading, setSimLoading] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  // Custom Message State
  const [customPhone, setCustomPhone] = useState('');
  const [customText, setCustomText] = useState('');
  const [sendingCustom, setSendingCustom] = useState(false);
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const webhookUrl = `${window.location.origin}/api/whatsapp/webhook`;

  useEffect(() => {
    if (token) {
      setLoadingConfig(true);
      getWhatsAppConfigRequest(token)
        .then((res) => {
          if (res.success) {
            setConfig({
              meta_configured: res.meta_configured,
              twilio_configured: res.twilio_configured,
              admin_phone: res.admin_phone,
              webhook_verify_token: res.webhook_verify_token,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingConfig(false));
    }
  }, [token]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simQuery.trim()) return;

    setSimLoading(true);
    setSimOutput(null);

    try {
      const res = await simulateWhatsAppRequest(simQuery.trim(), simPhone.trim());
      if (res.success) {
        setSimOutput(res.result.whatsappUrl ? decodeURIComponent(res.result.whatsappUrl.split('text=')[1] || '') : 'Automated response generated.');
      }
    } catch (err) {
      setSimOutput(err instanceof Error ? err.message : 'Simulation failed.');
    } finally {
      setSimLoading(false);
    }
  };

  const handleSendCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone.trim() || !customText.trim() || !token) {
      setCustomFeedback('Phone number and message are required.');
      return;
    }

    setSendingCustom(true);
    setCustomFeedback(null);

    try {
      const res = await sendCustomWhatsAppRequest(customPhone.trim(), customText.trim(), token);
      if (res.success) {
        setCustomFeedback('Message dispatched successfully via WhatsApp concierge!');
        setCustomText('');
      }
    } catch (err) {
      setCustomFeedback(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setSendingCustom(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── HEADER BANNER ──────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/10 via-emerald-500/5 to-transparent p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-emerald-800 dark:text-[#25D366] text-xs font-bold tracking-wider uppercase">
              <Zap size={13} className="text-[#25D366]" />
              <span>JORIQUE Concierge • Automation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">
              WhatsApp Business & Inbound Bot Automation
            </h2>
            <p className="text-xs sm:text-sm text-secondary dark:text-white/70 leading-relaxed">
              Real-time transactional dispatches, order status tracking, automated customer receipts, and 24/7 inbound AI/keyword concierge support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/919919388211"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <MessageCircle size={15} />
              <span>Open Concierge (+91 99193 88211)</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 3 ACTIVE AUTOMATION TRIGGERS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#25D366]">
              <Package size={20} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              Active Trigger
            </span>
          </div>
          <h3 className="text-sm font-bold text-primary dark:text-white">1. Instant Order Confirmation</h3>
          <p className="text-xs text-secondary dark:text-white/60 leading-relaxed">
            Triggered automatically the second a customer places an order. Sends complete item summary, invoice amount, and luxury fulfillment guarantee.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>Zero manual admin effort</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Bell size={20} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              Store Alert
            </span>
          </div>
          <h3 className="text-sm font-bold text-primary dark:text-white">2. Admin Order Alerts</h3>
          <p className="text-xs text-secondary dark:text-white/60 leading-relaxed">
            Immediately alerts the store owner (+91 99193 88211) via WhatsApp with customer contact, city, and item count so packing begins without delay.
          </p>
          <div className="pt-2 text-[11px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>Dispatched to +91 99193 88211</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Bot size={20} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300">
              24/7 Inbound
            </span>
          </div>
          <h3 className="text-sm font-bold text-primary dark:text-white">3. Inbound Auto-Responder</h3>
          <p className="text-xs text-secondary dark:text-white/60 leading-relaxed">
            Customers texting your WhatsApp get automated instant responses for live order tracking, category catalogs, Egyptian cotton wash care, and return policy.
          </p>
          <div className="pt-2 text-[11px] font-mono text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>Live order lookup enabled</span>
          </div>
        </div>
      </div>

      {/* ── WEBHOOK & META CONFIGURATION CARD ──────────────────────────── */}
      <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#D4AF37]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white">
              Webhook Configuration (Meta & Twilio Endpoints)
            </h3>
          </div>
          <span className="text-xs text-secondary dark:text-white/60">
            For receiving inbound WhatsApp replies directly into the server
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60 block">
              Meta WhatsApp Cloud Webhook URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full text-xs font-mono bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-lg px-3 py-2 text-primary dark:text-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(webhookUrl, 'url')}
                className="px-3 py-2 rounded-lg bg-cream dark:bg-white/10 hover:bg-primary hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <Copy size={13} />
                <span>{copiedKey === 'url' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-secondary/70 dark:text-white/50">
              Paste in Meta Developer Portal $\rightarrow$ WhatsApp $\rightarrow$ Configuration $\rightarrow$ Callback URL
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60 block">
              Webhook Verify Token
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={config?.webhook_verify_token || 'JORIQUE_WHATSAPP_VERIFY_TOKEN'}
                className="w-full text-xs font-mono bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-lg px-3 py-2 text-primary dark:text-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(config?.webhook_verify_token || 'JORIQUE_WHATSAPP_VERIFY_TOKEN', 'token')}
                className="px-3 py-2 rounded-lg bg-cream dark:bg-white/10 hover:bg-primary hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <Copy size={13} />
                <span>{copiedKey === 'token' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-secondary/70 dark:text-white/50">
              Verify Token required by Meta to authenticate the webhook challenge
            </p>
          </div>
        </div>
      </div>

      {/* ── AUTOMATION SIMULATOR & TEST HARNESS ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulator */}
        <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[#25D366]" />
              <h3 className="text-sm font-bold text-primary dark:text-white">
                Live Inbound Bot Simulator
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#25D366]/10 text-emerald-700 dark:text-[#25D366]">
              Interactive Test
            </span>
          </div>

          <p className="text-xs text-secondary dark:text-white/60">
            Test how the 24/7 automation engine processes incoming customer queries and returns formatted luxury replies.
          </p>

          <form onSubmit={handleRunSimulation} className="space-y-3">
            <div className="flex flex-wrap gap-1.5 pb-1">
              {['Track Order', 'Catalog', 'Wash Care', 'Return Policy', 'Chat with Stylist'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSimQuery(preset)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-white/5 hover:border-[#25D366] text-secondary dark:text-white/70 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-secondary dark:text-white/70 block mb-1">
                Simulated Customer Message
              </label>
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="e.g. Track JRQ-123, Catalog, Care, or Return"
                className="w-full text-xs bg-cream/20 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2.5 text-primary dark:text-white outline-none focus:border-[#25D366]"
              />
            </div>

            <button
              type="submit"
              disabled={simLoading || !simQuery.trim()}
              className="w-full py-2.5 rounded-xl bg-primary dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {simLoading ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} className="text-[#25D366]" />}
              <span>{simLoading ? 'Generating Response...' : 'Simulate Bot Response'}</span>
            </button>
          </form>

          {simOutput && (
            <div className="p-4 rounded-xl bg-[#EFEAE2] dark:bg-[#0B141A] border border-[#25D366]/30 text-xs font-sans text-[#111B21] dark:text-[#E9EDEF] whitespace-pre-wrap leading-relaxed shadow-inner">
              <div className="text-[10px] font-bold text-[#008069] dark:text-[#25D366] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                <span>Simulated WhatsApp Reply</span>
              </div>
              {simOutput}
            </div>
          )}
        </div>

        {/* Custom Outbound WhatsApp Dispatcher */}
        <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send size={18} className="text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-primary dark:text-white">
                Direct WhatsApp Dispatcher
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-amber-800 dark:text-[#D4AF37]">
              Ad-hoc Message
            </span>
          </div>

          <p className="text-xs text-secondary dark:text-white/60">
            Send an instant custom notice, courier tracking update, or promotional token to any customer phone number.
          </p>

          <form onSubmit={handleSendCustomMessage} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-secondary dark:text-white/70 block mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="e.g. 919919388211 or 9919388211"
                className="w-full text-xs bg-cream/20 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2.5 text-primary dark:text-white outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-secondary dark:text-white/70 block mb-1">
                Message Body
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type luxury message or courier update..."
                className="w-full text-xs bg-cream/20 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2.5 text-primary dark:text-white outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {customFeedback && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {customFeedback}
              </p>
            )}

            <button
              type="submit"
              disabled={sendingCustom || !customPhone.trim() || !customText.trim()}
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {sendingCustom ? <RefreshCw size={13} className="animate-spin" /> : <MessageCircle size={14} />}
              <span>{sendingCustom ? 'Dispatching...' : 'Send WhatsApp Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { supabase } from '../supabase.js';

// In-memory ring buffer for resilient, ultra-fast real-time logging
const inMemoryLogs = [];
const MAX_LOGS = 300;

// Seed realistic atelier activities if buffer is empty
const INITIAL_LOGS = [
  {
    id: 'seed-act-1',
    type: 'whatsapp',
    action: 'whatsapp_automation_ready',
    title: 'WhatsApp Automation Concierge Online',
    description: 'Meta Cloud API & Twilio Webhook listeners active on /api/whatsapp/webhook',
    metadata: { provider: 'Meta & Twilio', status: 'active', auto_reply: true },
    actor: 'system',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'seed-act-2',
    type: 'product',
    action: 'catalog_sync',
    title: 'Catalogue Store Synced',
    description: 'Luxury catalogue collections published for digital storefront & WhatsApp sharing',
    metadata: { channel: 'web & whatsapp', collections: 'Essential, Royal Heritage, Silk Route' },
    actor: 'admin',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'seed-act-3',
    type: 'order',
    action: 'order_status_ready',
    title: 'Order Dispatch Automation Active',
    description: 'Automated 360° unboxing reminders & tracking dispatch enabled',
    metadata: { rule: 'on status=shipped notify customer via WhatsApp' },
    actor: 'system',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

inMemoryLogs.push(...INITIAL_LOGS);

/**
 * Log an activity event to both in-memory store and Supabase activity_logs table
 */
export async function logActivity({
  type = 'system',
  action,
  title,
  description = '',
  metadata = {},
  actor = 'system',
}) {
  const logItem = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    action: action || type,
    title: title || 'Store Event',
    description: description || '',
    metadata: metadata || {},
    actor,
    created_at: new Date().toISOString(),
  };

  // 1. Add to in-memory buffer (unshifts to top)
  inMemoryLogs.unshift(logItem);
  if (inMemoryLogs.length > MAX_LOGS) {
    inMemoryLogs.pop();
  }

  // 2. Persist to Supabase activity_logs table asynchronously
  try {
    const { error } = await supabase.from('activity_logs').insert([
      {
        type: logItem.type,
        action: logItem.action,
        title: logItem.title,
        description: logItem.description,
        metadata: logItem.metadata,
        actor: logItem.actor,
        created_at: logItem.created_at,
      },
    ]);

    if (error) {
      // Gracefully ignore table-not-found error in dev/unmigrated databases
      if (!error.message?.includes('relation "public.activity_logs" does not exist')) {
        console.warn('[ACTIVITY LOG] Supabase sync note:', error.message);
      }
    }
  } catch (err) {
    // Non-blocking: memory buffer remains primary source of truth
    console.debug('[ACTIVITY LOG] Async log write:', err.message);
  }

  return logItem;
}

/**
 * Retrieve recent activity logs with filtering and search
 */
export async function getActivityLogs({ type = 'all', search = '', limit = 50 } = {}) {
  let dbLogs = [];

  // Try fetching from Supabase first
  try {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit) || 50);

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,action.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      dbLogs = data;
    }
  } catch (_e) {
    // Fall back to in-memory logs
  }

  // If Supabase returned logs, merge and deduplicate with in-memory logs
  let combined = [...inMemoryLogs];
  if (dbLogs.length > 0) {
    const seenIds = new Set(inMemoryLogs.map((l) => l.id));
    for (const d of dbLogs) {
      if (!seenIds.has(d.id)) {
        combined.push(d);
        seenIds.add(d.id);
      }
    }
  }

  // Sort descending by created_at
  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Apply filters to combined
  if (type && type !== 'all') {
    combined = combined.filter((l) => l.type === type);
  }

  if (search) {
    const s = search.toLowerCase();
    combined = combined.filter(
      (l) =>
        (l.title && l.title.toLowerCase().includes(s)) ||
        (l.description && l.description.toLowerCase().includes(s)) ||
        (l.action && l.action.toLowerCase().includes(s)) ||
        (l.actor && l.actor.toLowerCase().includes(s))
    );
  }

  return combined.slice(0, Number(limit) || 50);
}

/**
 * Clear in-memory logs (admin convenience)
 */
export async function clearActivityLogs() {
  inMemoryLogs.length = 0;
  try {
    await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (_e) {
    // ignore
  }
  return true;
}

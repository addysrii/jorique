import { Router } from 'express';
import { adminRequired, authRequired } from '../middleware/auth.js';
import {
  getActivityLogs,
  logActivity,
  clearActivityLogs,
} from '../services/activityLogger.js';

const router = Router();

/**
 * GET /api/activity-logs
 * Fetch filtered activity logs (admin only or authenticated)
 */
router.get('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { type, search, limit } = req.query;
    const logs = await getActivityLogs({
      type: type || 'all',
      search: search || '',
      limit: limit ? parseInt(limit, 10) : 50,
    });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/activity-logs
 * Create an activity log (e.g. from frontend POS or Admin actions)
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const { type, action, title, description, metadata } = req.body || {};
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const log = await logActivity({
      type: type || 'system',
      action: action || 'custom_event',
      title,
      description: description || '',
      metadata: metadata || {},
      actor: req.user?.role || 'admin',
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/activity-logs
 * Clear activity history (admin only)
 */
router.delete('/', authRequired, adminRequired, async (_req, res) => {
  try {
    await clearActivityLogs();
    res.json({ success: true, message: 'Activity log history cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

/**
 * Generates an ultra-luxurious 3-panel Lighting Fidelity Comparison Card (Warm, Neutral, Cold)
 * for e-commerce textile and product listings, matching calibrated studio daylight standards.
 */
export async function generateLightingComparisonCard(
  source: File | Blob | string
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    if (source instanceof File || source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      img.src = source;
    }

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      const W = 1200;
      const H = 1200;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas 2D context'));
        return;
      }

      // 1. Studio background (Warm refined neutral grey matching studio backdrop)
      ctx.fillStyle = '#DFDFDF';
      ctx.fillRect(0, 0, W, H);

      // 2. Panel Dimensions
      const marginX = 40;
      const gap = 20;
      const colW = Math.floor((W - 2 * marginX - 2 * gap) / 3); // ~360px
      const colTop = 112;
      const colH = 918;

      const x1 = marginX;
      const x2 = marginX + colW + gap;
      const x3 = marginX + 2 * (colW + gap);

      // Helper to draw image covering vertical column aspect ratio
      const drawCover = (targetX: number, targetY: number, w: number, h: number) => {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const scale = Math.max(w / iw, h / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const cx = (w - nw) / 2;
        const cy = (h - nh) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, w, h);
        ctx.clip();
        ctx.drawImage(img, targetX + cx, targetY + cy, nw, nh);
        ctx.restore();
      };

      // ── Panel 1: WARM LIGHT (2700K Incandescent Warmth) ──
      drawCover(x1, colTop, colW, colH);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x1, colTop, colW, colH);
      ctx.clip();
      // Amber tone overlay
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = 'rgba(235, 145, 30, 0.32)';
      ctx.fillRect(x1, colTop, colW, colH);
      // Soft warm ambient wash
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(255, 230, 190, 0.15)';
      ctx.fillRect(x1, colTop, colW, colH);
      ctx.restore();

      // ── Panel 2: NEUTRAL LIGHT (5500K Calibrated Studio Daylight - 100% True) ──
      drawCover(x2, colTop, colW, colH);

      // ── Panel 3: COLD LIGHT (7500K Cool Ambient Sky/Blue Tone) ──
      drawCover(x3, colTop, colW, colH);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x3, colTop, colW, colH);
      ctx.clip();
      // Cool cyan/slate blue overlay
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = 'rgba(50, 125, 225, 0.25)';
      ctx.fillRect(x3, colTop, colW, colH);
      // Subtle cool shadow wash
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(215, 230, 255, 0.12)';
      ctx.fillRect(x3, colTop, colW, colH);
      ctx.restore();

      // ── Typography: Column Headers ──
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 31px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      // 1. WARM LIGHT
      ctx.fillStyle = '#C28445';
      ctx.fillText('WARM LIGHT', x1 + colW / 2, 64);

      // 2. NEUTRAL LIGHT
      ctx.fillStyle = '#707B88';
      ctx.fillText('NEUTRAL LIGHT', x2 + colW / 2, 64);

      // 3. COLD LIGHT
      ctx.fillStyle = '#3A80D2';
      ctx.fillText('COLD LIGHT', x3 + colW / 2, 64);

      // ── Bottom Banner: True Color Representation ──
      const barY = 1060;
      const barH = 76;
      const barX = marginX;
      const barW = W - 2 * marginX;

      // Draw white rounded pill
      ctx.save();
      ctx.beginPath();
      const radius = 14;
      ctx.moveTo(barX + radius, barY);
      ctx.lineTo(barX + barW - radius, barY);
      ctx.quadraticCurveTo(barX + barW, barY, barX + barW, barY + radius);
      ctx.lineTo(barX + barW, barY + barH - radius);
      ctx.quadraticCurveTo(barX + barW, barY + barH, barX + barW - radius, barY + barH);
      ctx.lineTo(barX + radius, barY + barH);
      ctx.quadraticCurveTo(barX, barY + barH, barX, barY + barH - radius);
      ctx.lineTo(barX, barY + radius);
      ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
      ctx.closePath();

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#D1D5DB';
      ctx.stroke();
      ctx.restore();

      const centerY = barY + barH / 2;

      // Helper for vector Globe Icon
      const drawGlobe = (x: number, y: number, size: number, color: string) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const r = size / 2;
        const cx = x + r;
        const cy = y + r;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - (r - 1.5), cy);
        ctx.lineTo(cx + (r - 1.5), cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, (r - 1.5) * 0.45, r - 1.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      // Helper for vector Monitor Icon
      const drawMonitor = (x: number, y: number, size: number, color: string) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const sw = size * 1.05;
        const sh = size * 0.72;
        const cr = 2;
        ctx.beginPath();
        ctx.moveTo(x + cr, y);
        ctx.lineTo(x + sw - cr, y);
        ctx.quadraticCurveTo(x + sw, y, x + sw, y + cr);
        ctx.lineTo(x + sw, y + sh - cr);
        ctx.quadraticCurveTo(x + sw, y + sh, x + sw - cr, y + sh);
        ctx.lineTo(x + cr, y + sh);
        ctx.quadraticCurveTo(x, y + sh, x, y + sh - cr);
        ctx.lineTo(x, y + cr);
        ctx.quadraticCurveTo(x, y, x + cr, y);
        ctx.closePath();
        ctx.stroke();

        // Stand neck & base
        ctx.beginPath();
        ctx.moveTo(x + sw / 2, y + sh);
        ctx.lineTo(x + sw / 2, y + sh + 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + sw * 0.25, y + sh + 5);
        ctx.lineTo(x + sw * 0.75, y + sh + 5);
        ctx.stroke();
        ctx.restore();
      };

      // Left: Globe + Calibrated Daylight Conditions
      const iconSize = 22;
      drawGlobe(barX + 30, centerY - iconSize / 2, iconSize, '#64748B');
      ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.textAlign = 'left';
      ctx.fillText('Calibrated Daylight Conditions', barX + 60, centerY);

      // Center: TRUE COLOR REPRESENTATION
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.fillText('←  TRUE COLOR REPRESENTATION  →', W / 2, centerY);

      // Right: Monitor + Individual Screen Settings May Vary
      const rightText = 'Individual Screen Settings May Vary';
      ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const rightTextWidth = ctx.measureText(rightText).width;
      const rightTotalW = iconSize + 10 + rightTextWidth;
      const rightStartX = barX + barW - 30 - rightTotalW;

      drawMonitor(rightStartX, centerY - iconSize / 2, iconSize, '#64748B');
      ctx.fillStyle = '#4B5563';
      ctx.textAlign = 'left';
      ctx.fillText(rightText, rightStartX + iconSize + 10, centerY);

      // Convert to Blob and File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob failed'));
            return;
          }
          const file = new File([blob], `lighting-fidelity-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve({ file, dataUrl });
        },
        'image/jpeg',
        0.92
      );
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image for lighting comparison card: ${err}`));
    };
  });
}

/**
 * Checks whether an image URL represents a Lighting Fidelity comparison card
 */
export function isLightingComparisonImage(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.includes('lighting-fidelity') ||
    url.includes('lighting-comparison') ||
    url.includes('lighting_fidelity')
  );
}

/**
 * Currency, Date & Time formatting helpers
 */
export function formatCurrencyINR(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime12(dateOrTimeString) {
  if (!dateOrTimeString) return '--:--';
  if (typeof dateOrTimeString === 'string' && dateOrTimeString.includes(':') && !dateOrTimeString.includes('-')) {
    const [h, m] = dateOrTimeString.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
  }
  const date = new Date(dateOrTimeString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function calculateHoursDifference(startTime, endTime) {
  if (!startTime || !endTime) return { workHours: '00:00', extraHours: '00:00' };
  
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  
  const startMin = sH * 60 + sM;
  const endMin = eH * 60 + eM;
  
  const diffMin = Math.max(0, endMin - startMin);
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  
  const workHrsFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  
  // Standard day is 8 hours (480 mins)
  const standardMin = 8 * 60;
  const overtimeMin = Math.max(0, diffMin - standardMin);
  const otHours = Math.floor(overtimeMin / 60);
  const otMins = overtimeMin % 60;
  const extraHrsFormatted = `${String(otHours).padStart(2, '0')}:${String(otMins).padStart(2, '0')}`;
  
  return {
    workHours: workHrsFormatted,
    extraHours: extraHrsFormatted,
    totalMinutes: diffMin
  };
}

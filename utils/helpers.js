const calculatePagination = (page = 1, limit = 12) => {
  const p = Math.max(parseInt(page), 1);
  const l = Math.min(parseInt(limit), 100);
  return { page: p, limit: l, skip: (p - 1) * l };
};

const sanitizeString = (str) => String(str || '').trim().replace(/[<>]/g, '');

const toSlug = (str) => String(str).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

module.exports = { calculatePagination, sanitizeString, toSlug };

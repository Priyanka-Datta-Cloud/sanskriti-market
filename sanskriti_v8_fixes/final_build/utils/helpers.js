const formatPrice = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const generateOrderNumber = () => {
  return 'SM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
};

const sanitizeSearch = (query) => {
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
};

const calculatePagination = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit) || 12));
  return { page: p, limit: l, skip: (p - 1) * l };
};

const getImagePlaceholder = (category, index = 0) => {
  const colors = {
    textiles: ['#8B4513', '#D2691E', '#CD853F'],
    pottery: ['#A0522D', '#BC8F8F', '#DEB887'],
    jewelry: ['#B8860B', '#DAA520', '#FFD700'],
    woodwork: ['#654321', '#8B6914', '#A0522D'],
    metalwork: ['#708090', '#778899', '#696969'],
    paintings: ['#9932CC', '#8B008B', '#BA55D3'],
    'home-decor': ['#2F4F4F', '#556B2F', '#6B8E23'],
    accessories: ['#CD5C5C', '#F08080', '#FA8072'],
    other: ['#4682B4', '#5F9EA0', '#6495ED'],
  };
  const palette = colors[category] || colors.other;
  const color = palette[index % palette.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="${color}" width="400" height="400"/><text x="200" y="200" text-anchor="middle" dy=".3em" fill="white" font-family="Georgia,serif" font-size="24">${category || 'craft'}</text></svg>`)}`;
};

module.exports = {
  formatPrice,
  generateOrderNumber,
  sanitizeSearch,
  calculatePagination,
  getImagePlaceholder,
};

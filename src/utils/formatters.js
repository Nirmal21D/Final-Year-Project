export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatTimelineData = (monthlyData) => {
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      ...data
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

export const formatDistributionData = (loanTypes) => {
  return Object.entries(loanTypes).map(([name, value]) => ({
    name,
    value
  }));
};
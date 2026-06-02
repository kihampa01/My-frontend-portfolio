// Production backend URL (set via environment variable or default)
const apiBaseUrl = typeof window !== 'undefined' ? 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : 'https://portfolio-backend-api.onrender.com') 
  : '';
window.PORTFOLIO_CONFIG = {
  apiBaseUrl: "https://my-backend-portfolio-1.onrender.com"
};

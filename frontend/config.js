// Production backend URL (set via environment variable or default)
(function() {
  const defaultApi = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://portfolio-backend-api.onrender.com')
    : '';
  window.PORTFOLIO_CONFIG = {
    apiBaseUrl: (defaultApi).replace(/\/$/, "")
  };
})();

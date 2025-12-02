export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  error: '/error',
  api: {
    login: '/api/login',
    signup: '/api/signup',
    logout: '/api/logout',
    me: '/api/me',
  },
} as const;

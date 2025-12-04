export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  error: '/error',
  api: {
    login: '/api/login',
    signup: '/api/signup',
    logout: '/api/logout',
    pokemons: {
      basic_infos: '/api/pokemons/basic_infos',
      list: '/api/pokemons/list',
      getByParam: (param: string) => `/api/pokemons/basic_infos/${param}`,
      detail: (id: number) => `/api/pokemons/${id}`,
    },
  },
} as const;

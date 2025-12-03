export interface User {
  id: string;
  username: string;
}

export interface Token {
  token: string;
  expAt: string;
}

export interface Session {
  id: string;
  expAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  session: Session;
  token: Token;
}

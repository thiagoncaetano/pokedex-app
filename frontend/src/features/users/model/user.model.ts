export interface User {
  id: string;
  username: string;
}

export interface UserSignupResponse {
  user: User;
  session: {
    id: string;
    expAt: string;
    isActive: boolean;
  };
  token: {
    token: string;
    expAt: string;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData extends LoginData {
  first_name: string;
  last_name: string;
  email: string;
}

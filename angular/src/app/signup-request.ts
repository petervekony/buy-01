export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'SELLER';
}

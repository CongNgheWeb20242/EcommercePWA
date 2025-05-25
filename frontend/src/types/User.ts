export interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  isAdmin: Boolean,
  phone?: number,
  address?: string,
  createdAt?: string,
}
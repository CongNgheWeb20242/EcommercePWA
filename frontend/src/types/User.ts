export interface User {
    _id : string;
    name: string;
    email: string;
    profilePic: string;
    isAdmin: boolean;
    token?: string;
  }
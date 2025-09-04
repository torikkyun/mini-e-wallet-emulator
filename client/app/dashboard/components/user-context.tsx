import React, { createContext, useContext } from 'react';

export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
};

export const UserContext = createContext<UserType | null>(null);

export const useUser = () => useContext(UserContext);

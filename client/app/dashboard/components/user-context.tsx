import React, { createContext, useContext, useState } from 'react';

export type UserType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  accountNumber: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
  user,
  setUser,
}: {
  children: React.ReactNode;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}) => {
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

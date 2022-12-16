import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return UserContext ? useContext(UserContext) : null;
}
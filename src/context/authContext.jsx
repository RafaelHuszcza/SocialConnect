import { createContext, useContext, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const user = sessionStorage.getItem("@SocialConnect:user");
    if (user){
      return  JSON.parse(user);
    }    
    return null
      
  });

  const signIn = async (user) => {
    setData(user);
    sessionStorage.setItem("@SocialConnect:user",  JSON.stringify(user));

  };

  const signOut = () => {
    sessionStorage.clear();
    setData(
      null
    );
  };

  const isLogged = () => {

    if(data) {
      return true;
    } else {
      return false
    }
  };

  const generateAccess = (
    access = sessionStorage.getItem("@dataSymbion:access")
  ) => {
    const config = {
      headers: { Authorization: `Bearer ${access}` },
    };
    return config;
  };

  return (
    <AuthContext.Provider
      value={{
        data,
        signIn,
        signOut,
        isLogged,
        generateAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

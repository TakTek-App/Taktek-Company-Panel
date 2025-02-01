import React, { ReactElement, useContext, useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  zipCode: string;
  businessReg: string;
  driverLicense: string;
  driverLicenseExpDate: string;
  insurance: string;
  insuranceExpDate: string;
  license: string;
  amountDue: number;
  services: Service[];
  technicians: any[];
}

interface Service {
  id: number;
  name: string;
  categoryId: number;
}

interface AuthContextProps {
  signedIn: boolean;
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  company: Company | undefined;
  setCompany: any;
}
export const AuthContext = React.createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthContext.Provider");
  }
  return context;
};

const AuthContextWrapper = ({ children }: { children: ReactElement }) => {
  const getInitialSignedIn = () => {
    const savedState = localStorage.getItem("signedIn");
    return savedState === "true";
  };
  const getInitialCompany = (): Company | undefined => {
    const savedCompany = localStorage.getItem("company");
    return savedCompany ? JSON.parse(savedCompany) : undefined;
  };

  const [signedIn, setSignedIn] = useState(getInitialSignedIn);
  const [company, setCompany] = useState<Company | undefined>(
    getInitialCompany
  );

  useEffect(() => {
    localStorage.setItem("signedIn", signedIn.toString());
  }, [signedIn]);
  useEffect(() => {
    if (company) {
      localStorage.setItem("company", JSON.stringify(company));
    } else {
      localStorage.removeItem("company"); // Eliminar si no hay compañía
    }
  }, [company]);
  return (
    <AuthContext.Provider
      value={{ signedIn, setSignedIn, company, setCompany }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextWrapper;

import React, { createContext, useContext } from "react";
import { PORTFOLIO_DATA, type PortfolioData } from "../data/portfolio";

export * from "../data/portfolio";

interface PortfolioContextType {
  data: PortfolioData;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: PORTFOLIO_DATA,
});

export const PortfolioProvider: React.FC<{
  children: React.ReactNode;
  value?: PortfolioData;
}> = ({ children, value = PORTFOLIO_DATA }) => {
  return (
    <PortfolioContext.Provider value={{ data: value }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};

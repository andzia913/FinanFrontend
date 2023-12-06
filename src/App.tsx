import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { CashFlow, CashGoals, CostStructure, FinancialBalance, Main } from "./containers/index.tsx";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
  

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
            <Routes>
              <Route  path="/" element={<Main />}/>
              <Route  path="/cash-goals" element={<CashGoals />}/>
              <Route  path="/cash-flow" element={<CashFlow />}/>
              <Route  path="/cost-structure" element={<CostStructure />}/>
              <Route  path="/financial-balance" element={<FinancialBalance />}/>
            </Routes>
     </ThemeProvider>
    </div>
  );
}

export default App;

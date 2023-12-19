import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Login, Register, CashFlow, CashGoals, CostStructure, FinancialBalance, Main } from "./containers/index.tsx";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#dc2ffd',
    },
    secondary: {
      main: '#3f56e6',
    },
  },
});

  

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
            <Routes>
              <Route  path="/" element={<Main />}/>
              <Route  path="/login" element={<Login />}/>
              <Route  path="/register" element={<Register />}/>
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

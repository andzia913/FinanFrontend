import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { CashFlow, CashGoals, CostStructure, FinancialBalance, Main } from "./containers/index.tsx";

const App = () => {
  return (
    <div className="App">
     <Routes>
       <Route exact path="/" element={<Main />}/>
       <Route  path="/cashGoals" element={<CashGoals />}/>
       <Route  path="/cashFlow" element={<CashFlow />}/>
       <Route  path="/costStructure" element={<CostStructure />}/>
       <Route  path="/financialBalance" element={<FinancialBalance />}/>
     </Routes>
    </div>
  );
}

export default App;

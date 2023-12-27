import { Routes, Route } from "react-router-dom";
import "./App.css";
import {
  Login,
  Register,
  CashFlow,
  CashGoals,
  CostStructure,
  FinancialBalance,
  Main,
} from "./containers/index.tsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ProtectedRoute from "./components/PrivateRoute/PrivateRoute.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#dc2ffd",
    },
    secondary: {
      main: "#3f56e6",
    },
  },
});

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cash-goals"
            element={
              <ProtectedRoute>
                <CashGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cash-flow"
            element={
              <ProtectedRoute>
                <CashFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cost-structure"
            element={
              <ProtectedRoute>
                <CostStructure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-balance"
            element={
              <ProtectedRoute>
                <FinancialBalance />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import './App.css';
import DashboardPage from './components/DashboardPage';
import AccountsPage from './components/AccountsPage';
import AccountDetail from './components/AccountDetail';
import TransactionsPage from './components/TransactionsPage';
import ImportPage from './components/ImportPage';
import DepositsPage from './components/DepositsPage';
import Signup from './components/authentication/Signup';
import Login from './components/authentication/Login';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import LoadingSpinnerCenter from './components/UI/LoadingSpinnerCenter';

const App = () => {
  document.title = 'MyFinance';

  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />}>
                <Route index path="/dashboard" element={<DashboardPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route
                  path="/accounts/detail/:accountId"
                  element={<AccountDetail />}
                />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/deposits" element={<DepositsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;

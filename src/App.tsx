import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import './App.css';
import AccountsPage from './components/AccountsPage';
import AccountDetail from './components/AccountDetail';
import TransactionsPage from './components/TransactionsPage';
import AnalyticsPage from './components/AnalyticsPage';
import ImportPage from './components/ImportPage';
import Signup from './components/authentication/Signup';
import Login from './components/authentication/Login';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';

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
            <Route path="/" element={<MainLayout />}>
              <Route path="/accounts" element={<AccountsPage />} />
              <Route
                path="/accounts/detail/:accountId"
                element={<AccountDetail />}
              />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/import" element={<ImportPage />} />
            </Route>
          </Route>
        </Route>

        {/* catch all */}
      </Routes>
    </div>
  );
};

export default App;

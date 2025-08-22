import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';

import { ROUTES_CONFIG } from './routes/routes.config';
import { AuthProvider } from './features/auth/Auth.context';
import { ProtectedRoute } from './routes/Protected.route';

import { Layout } from './ui/layout/Layout';
import { HomePage } from './pages/Home.page';

import { LoginPage } from './pages/Login.page';
import { ContactsPage } from './pages/Contacts.page';
import { AddContactPage } from './pages/AddContact.page';
import { EditContactPage } from './pages/EditContact.page';
import { UsersPage } from './pages/Users.page';
import { Error403Page } from './pages/Error-403.page';
import { Error404Page } from './pages/Error-404.page';
import { Error500Page } from './pages/Error-500.page';

const theme = createTheme({ cssVariables: true });

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route element={<ProtectedRoute roles={['user']} />}>
              <Route path={ROUTES_CONFIG.CONTACTS.LIST} element={<ContactsPage />} />
              <Route path={ROUTES_CONFIG.CONTACTS.CREATE} element={<AddContactPage />} />
              <Route path={ROUTES_CONFIG.CONTACTS.EDIT(':id')} element={<EditContactPage />} />
             
            </Route>
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path={ROUTES_CONFIG.USERS.LIST} element={<UsersPage />} />
            </Route>
            <Route path={ROUTES_CONFIG.HOME} element={<HomePage />} />
            <Route path={ROUTES_CONFIG.AUTH.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES_CONFIG.ERROR.FORBIDDEN} element={<Error403Page />} />
            <Route path={ROUTES_CONFIG.ERROR.SERVER_ERROR} element={<Error500Page />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

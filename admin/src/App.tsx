import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { LeadsPage } from './pages/leads/LeadsPage';
import { LoginPage } from './pages/login/LoginPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="leads" replace />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="projetos" element={<ProjectsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/admin/leads" replace />} />
  </Routes>
);

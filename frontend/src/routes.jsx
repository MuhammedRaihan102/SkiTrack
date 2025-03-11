import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import LoginForm from './components/auth/login-form';
import RegisterForm from './components/auth/register-form';
import Overview from './components/dashboard/overview';
import SkillList from './components/skills/skill-list';
import ProfileView from './components/profile/profile-view';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route element={<RootLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/skills" element={<SkillList />} />
        <Route path="/profile" element={<ProfileView />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
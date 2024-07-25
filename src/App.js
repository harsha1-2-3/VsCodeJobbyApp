import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginWithRouter from './components/Login';
import Home from './components/Home';
import Jobs from './components/Jobs';
import JobItem from './components/JobItem';
import NotFound from './components/NotFound';
import './App.css';

const App = () => (
  <Routes>
    <Route exact path="/login" element={<LoginWithRouter />} />
    <Route exact path="/" element={<ProtectedRoute />}>
      <Route index element={<Home />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="jobs/:id" element={<JobItem />} />
    </Route>
    <Route exact path="/not-found" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/not-found" />} />
  </Routes>
);

export default App;

import { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@/views/pages/Login';
import NotFound from '@/views/pages/NotFound';
import Contracts from '@/views/pages/Contracts';
import Dashboard from '@/views/pages/Dashboard';
import Vacations from '@/views/pages/Vacations';
import ProtectedRoute from '@/components/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/assets/styles/main.css';

const App: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/contracts" element={<Contracts />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/vacations" element={<Vacations />} />
                </Route>

                <Route path="/login" element={<Login />} />

                <Route path="/*" element={<NotFound />} />
            </Routes>

            <ToastContainer position="bottom-center" theme="colored" />
        </BrowserRouter>
    );
};

export default App;

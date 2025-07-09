import React from 'react';
import {Route, Routes } from 'react-router-dom';
import Home from './Home';
import Sobre from './Sobre';
import NotFound from './NotFound';
const Rota: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
export default Rota;

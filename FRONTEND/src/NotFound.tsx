import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return(
    <>
        <h2>Página não encontrada!</h2>
        <Link to="/">retornar a página inicial</Link>
    </>
  );
};

export default NotFound;

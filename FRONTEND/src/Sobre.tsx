import React from 'react';
import { Link } from 'react-router-dom';
const Sobre: React.FC = () => {
  return(
    <>
        <h2>Sobre nossa aplicação</h2>
        <Link to="/">retornar a página inicial</Link>
    </>
  );
};
export default Sobre;

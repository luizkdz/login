import { Routes, Route } from "react-router-dom";
import CriarConta from "../CriarConta";
import Home from "../Home/index.js";
import PaginaInicial from '../PaginaInicial/index.js';

function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastrar" element={<CriarConta />} />
      <Route path="/paginainicial" element = {<PaginaInicial/>}/>
    </Routes>
  );
}

export default Rotas;
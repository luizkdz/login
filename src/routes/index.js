import { Routes, Route } from "react-router-dom";
import CriarConta from "../CriarConta";
import Home from "../Home/index.js";
import PaginaInicial from '../PaginaInicial/index.js';
import EsqueciSenha from '../Esqueci-Senha/index.js';
function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastrar" element={<CriarConta />} />
      <Route path="/paginainicial" element = {<PaginaInicial/>}/>
      <Route path="/esqueci-minha-senha" element = {<EsqueciSenha/>}></Route>
    </Routes>
  );
}

export default Rotas;
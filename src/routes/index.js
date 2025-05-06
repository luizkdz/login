import { Routes, Route } from "react-router-dom";
import CriarConta from "../CriarConta";
import Home from "../Home/index.js";
import PaginaInicial from '../PaginaInicial/index.js';
import EsqueciSenha from '../Esqueci-Senha/index.js';
import PaginaProduto from '../PaginaProduto/index.js';
import PaginaBuscaProduto from "../PaginaBuscaProduto/index.js";
import PaginaCarrinho from "../PaginaCarrinho/index.js";
import PaginaEscolherFormaEntrega from "../PaginaEscolherFormaEntrega/index.js";
import PaginaMinhaConta from "../PaginaMinhaConta/index.js";
import PaginaEnderecos from "../PaginaEnderecos/index.js";
import PaginaMeusPedidos from "../PaginaMeusPedidos/index.js";
import PaginaDetalhesPedido from "../PaginaDetalhesPedido/index.js";

function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastrar" element={<CriarConta />} />
      <Route path="/paginainicial" element = {<PaginaInicial/>}/>
      <Route path="/esqueci-minha-senha" element = {<EsqueciSenha/>}></Route>
      <Route path="/produto/:id" element = {<PaginaProduto/>}></Route>
      <Route path="/busca-produto" element = {<PaginaBuscaProduto/>}></Route>
      <Route path="/busca-produto/:nomeProduto" element = {<PaginaBuscaProduto/>}></Route>
      <Route path="/carrinho" element ={<PaginaCarrinho/>}></Route>
      <Route path="/checkout" element = {<PaginaEscolherFormaEntrega/>}></Route>
      <Route path="/minha-conta" element ={<PaginaMinhaConta/>}></Route>
      <Route path="/minha-conta/enderecos" element={<PaginaEnderecos/>} />
      <Route path="/meus-pedidos" element={<PaginaMeusPedidos/>}></Route>
      <Route path="/meus-pedidos/:idPedido" element={<PaginaDetalhesPedido/>}></Route>
    </Routes>
  );
}

export default Rotas;
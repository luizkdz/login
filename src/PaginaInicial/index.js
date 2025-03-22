import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../componentes/header/index.js';
import './styles.css';
import Banner from '../componentes/banner/index.js';
import SessaoProdutos from "../componentes/secao-produtos/index.js";
import CardCategorias from "../componentes/card-categorias/index.js";
function PaginaInicial() {
  
  const navigate = useNavigate();

  

  
  return (
    <div className="pagina-toda">
      <Header props="barra-pesquisa"/>
      <Banner/>
      <div className= "container-data">
      
      
      </div>  
      <SessaoProdutos/>
      <CardCategorias/>
    
    </div>
  );
}

export default PaginaInicial;
import Header from '../componentes/header/index.js';
import './styles.css';
import Banner from '../componentes/banner/index.js';
import SessaoProdutos from "../componentes/secao-produtos/index.js";
import CardCategorias from "../componentes/card-categorias/index.js";
import Conecte from "../componentes/secao-conecte/index.js";
import SecaoOfertas from "../componentes/secao-ofertas/index.js";
import Footer from "../componentes/footer/index.js";
function PaginaInicial() {
  
  return (
    <div className="pagina-toda">
      <Header props="barra-pesquisa"/>
      <Banner/>
       
      <SessaoProdutos/>
      <CardCategorias/>
      <Conecte/>
      
      <SecaoOfertas/>
      
      <Footer/>
      
    </div>
  );
}

export default PaginaInicial;
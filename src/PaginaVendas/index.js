import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';

function PaginaVendas(){
    return (
        <div className="pagina-toda-vendas">
            <Header props="p"/>
            <div className="secao-vendas">
            <button>Anunciar novo produto</button>
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaVendas;
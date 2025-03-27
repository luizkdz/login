import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';

function PaginaBuscaProduto() {
    return (
        <div className="pagina-toda-busca-produto">
            <Header props/>
            <div className="secao-busca-produto">
                <h1>Ferramentas</h1>
                <div className="card-categoria">
                    
                </div>
                
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaBuscaProduto;
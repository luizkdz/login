import './styles.css';

function Header({props}) {
    return (
        <header>
            <div className="nav-div">
                <img className="imagem-logo" src="./images/logo.svg" alt="Logo" />

                <div className="container-pesquisa">
                    {props && (
                        <div className="input-wrapper">
                            <input className="input-pesquisa" placeholder="Buscar produtos e marcas" />
                            <img className="icone-lupa" src="./images/lupa.png" alt="Buscar" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
import './styles.css';

function Conecte() {
    return(
        <div className="secao-conecte">
            <div className="card-conecte">
                <img src="./images/email.png" className="imagem-email"/>
                <div className="container-contato">
                    <h2>Entre em contato conosco</h2>
                    <p>Insira seu nome e seu email e receba as promoções</p>
                </div>
                <div className="container-nome-email">
                <input className="input-nome" type="nome" id="nome" required placeholder="Digite seu nome"/>
                <input className="input-email" type="email" id="email" required placeholder="Digite seu e-mail"/>
                <button className="botao-cadastrar">Cadastrar</button>
                </div>
            </div>
        </div>
    )
}

export default Conecte;
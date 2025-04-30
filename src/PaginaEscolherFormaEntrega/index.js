import { useState } from "react";
import Header from "../componentes/header";
import './styles.css'
import Footer from "../componentes/footer";
function PaginaEscolherFormaEntrega(){

    const [mostrarCardFormaEntrega, setMostrarCardFormaEntrega] = useState(true);
    const [mostrarEnvioCard, setMostrarEnvioCard] = useState(false);
    const [mostrarModalComoPagar, setMostrarModalComoPagar] = useState(false);
    const [mostrarReviseEConfirme, setMostrarReviseEConfirme] = useState(false);


    const entregaConcluida = mostrarModalComoPagar || mostrarReviseEConfirme;

    const imagemPagamento = entregaConcluida
  ? "/images/credit-card-pagina-entrega-azul.png"
  : "/images/credit-card-pagina-entrega.png";

const classePagamento = entregaConcluida
  ? "imagem-icone-pagina-entrega-azul"
  : "imagem-icone-pagina-entrega";

    const imagemEntrega = entregaConcluida
    ? "/images/cargo-truck-pagina-entrega-verde.png"
    : "/images/cargo-truck-pagina-entrega-azul.png";

    const classeEntrega = entregaConcluida
  ? "imagem-icone-pagina-entrega-verde"
  : "imagem-icone-pagina-entrega-azul";

    function handleMostrarReviseEConfirme(){
        setMostrarReviseEConfirme(!mostrarReviseEConfirme);
    }
    
    function handleMostrarModalComoPagar(){
        setMostrarModalComoPagar(!mostrarModalComoPagar);
    }

    function handleMostrarEnvioCard(){
        setMostrarEnvioCard(!mostrarEnvioCard);
    }
    function handleMostrarCardFormaEntrega(){
        setMostrarCardFormaEntrega(!mostrarCardFormaEntrega);
    }

    return (
        <div className="pagina-toda-forma-entrega">
            <Header props="d"/>
            <div className="container-icones-pagina-forma-entrega">
                <div className="icone-texto-pagina-forma-entrega">
                <img src = "/images/shopping-cart-pagina-entrega-verde.png" className="imagem-icone-pagina-entrega-verde"/>
                <p style={{fontSize:"12px"}} >Carrinho</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = "/images/user-pagina-entrega-verde.png" className="imagem-icone-pagina-entrega-verde"/>
                <p style={{fontSize:"12px"}} >Identificação</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = {imagemEntrega} className={classeEntrega}/>
                <p style={{fontSize:"12px"}} >Entrega</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = {imagemPagamento} className={classePagamento}/>
                <p style={{fontSize:"12px"}}>Pagamento</p>
                </div>
            </div>
            <div className="container-pagina-forma-entrega">
                {mostrarCardFormaEntrega && (
                    <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha a forma de entrega</p>
                    <div className="card-forma-entrega">
                        <div className="container-card-forma-entrega">
                            <input type="radio" className="input-radio-forma-entrega"/>
                            <div className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>Enviar no meu endereço</p>
                            <p>Rua Roger machados 1111 apto1111 - Belo Horizonte <br/> Residencial</p>
                            </div>
                            <p>Preço</p>
                        </div>
                        <div className="container-alterar-endereco-pagina-forma-entrega">
                            <a href="#">Alterar endereço ou escolher outro</a>
                        </div>
                    </div>
                    <button className="botao-continuar-forma-entrega" onClick={() => {handleMostrarCardFormaEntrega();handleMostrarEnvioCard()}}>Continuar</button>
                </div>
                )}
                {mostrarEnvioCard && (<div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha quando sua compra irá chegar</p>
                    <div className="card-forma-entrega">
                        <div className="container-card-forma-entrega-envio">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>Envio 1</p>
                            </div>
                            </div>
                            <p>Imagem produto</p>
                            </div>
                            <div className="container-dias-uteis">
                            <div className="container-input-tempo-entrega">
                            <input type="radio" className="input-radio-forma-entrega"/> <p>Daqui 8 dias úteis</p>
                            </div>
                            <p>Preço</p>
                            </div>
                            
                           
                    </div>
                    <div className="card-frete-pagina-entrega">
                            <div className="container-card-frete-pagina-entrega">
                                <p>Frete</p>
                                <p>R$Preço Frete</p>
                            </div>
                           </div>
                    <button className="botao-continuar-forma-entrega" onClick={() => {handleMostrarEnvioCard();handleMostrarModalComoPagar()}}>Continuar</button>
                </div>

                )}
                {mostrarModalComoPagar ? <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha como pagar</p>
                    <div className="card-forma-entrega-pagamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega"/>
                            <img src="/images/coupons-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Pix</p>
                            <p>Aprovação imediata</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <div className="card-forma-entrega">
                    <div className="container-card-forma-entrega">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega"/>
                            <img src="/images/contactless-metodos-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Cartão de crédito **** 1111</p>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                            </div>
                            </div>
                            <div className="card-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega"/>
                            <img src="/images/credit-card-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Novo cartão de crédito</p>
                            </div>
                            </div>
                            </div>
                            <div className="card-forma-entrega">
                            <div className="container-card-forma-entrega">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega"/>
                            <img src="/images/numbers-metodos-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Boleto Bancário</p>
                            <p>Aprovação em 1 a 2 dias úteis</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                    
                    <button className="botao-continuar-forma-entrega" onClick={() => {handleMostrarModalComoPagar();handleMostrarReviseEConfirme()}}>Continuar</button>
                </div> : ""}

                {mostrarReviseEConfirme ? <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Revise e confirme</p>
                    <p>Faturamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/contract.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Luiz Gustavo Cardoso</p>
                            <p>CPF:111.111.111.11</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Modificar dados de faturamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <p>Detalhe da entrega</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/gps.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontSize:"16px",fontWeight:"bold"}}>Rua xxxxxxx 1111 - Apto 1111</p>
                            <div className="container-endereco-alterar-endereco">
                            <p style={{fontSize:"14px"}}>Entrega no endereço</p>
                            <p style={{fontSize:"14px",color:"#3483fa"}}>Alterar endereço</p>
                            </div>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar endereço ou escolher outro</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/coupons-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Envio 1</p>
                            <p style={{fontSize:"14px"}}>Chegará em 8 dias úteis</p>
                            <p style={{fontSize:"14px"}}>Nome do produto kit de cozinha</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar data de entrega</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <p>Detalhe do pagamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/coupons-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Tipo de pagamento</p>
                            <p>R$ Valor do pagamento</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar forma de pagamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                    <button className="botao-continuar-forma-entrega" onClick={() => handleMostrarReviseEConfirme()}>Continuar</button>
                </div> : ""}
                
                <div className="card-resumo-compra-pagina-entrega">
                    <p style={{fontWeight:"bold"}}>Resumo da compra</p>
                    <div className="preco-produto-frete-pagina-entrega">
                    <div className="container-produto-preco-pagina-entrega">
                    <p>Produto</p>
                    <p>R$ 36</p>
                    </div>
                    
                    <div className="container-frete-pagina-entrega">
                        <p>Frete</p>
                        <p>R$ 25.00</p>
                        </div>
                    <div className="container-inserir-cupom-desconto-pagina-entrega">
                        <a style={{textDecoration:"none",color:"#3483fa"}}href="#">Inserir cupom de desconto</a>
                    </div>
                    </div>
                    <div className="container-voce-pagara">
                        <p>Você pagará</p>
                        <p>R$ 36</p>
                    </div>
                    
                </div>
            </div>
        <Footer/>
        </div>
    )
}

export default PaginaEscolherFormaEntrega;
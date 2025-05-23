import { useNavigate } from 'react-router-dom';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css'


function PaginaMinhaConta(){

    const navigate = useNavigate();
    return(
        <div className="pagina-toda-minha-conta">
            <Header props="p"/>
            <div className="secao-minha-conta">
                <div className="container-sua-conta-pedidos" style={{padding:"20px"}}>
                <div style={{width:"72%"}}>
                <h1>Sua conta</h1>
                <p>Olá usuário.Aqui é a página da sua conta. Navegue e gerencie conforme desejar</p>
                </div>
                <div className="container-pedidos-servicos-gerenciar-compra-cadastro">
                    <div className="card-pedidos">
                        <div style={{display:"flex",justifyContent:'space-between'}}>
                            <h2>Seus pedidos</h2>
                            <img src= "/images/cube-blue.png" style={{width:"40px",height:"40px"}}/>
                        </div>
                        <button onClick={() => {navigate("/meus-pedidos")}} style={{cursor:"pointer",backgroundColor:"rgb(0, 134, 255)",padding:"10px",borderRadius:"6px",border:"none",color:"white"}}>Acompanhe seus pedidos</button>
                        <div style={{marginTop:"10px"}}>
                        
                        </div>
                    </div>
                    <div className="card-pedidos">
                        <div style={{display:"flex",justifyContent:'space-between'}}>
                            <h2>Serviços</h2>
                            <img src= "/images/key-blue.png" style={{width:"40px",height:"40px"}}/>
                        </div>

                        <div style={{marginTop:"10px"}}>
                        
                        </div>
                    </div>
                    <div className="card-pedidos">
                        <div style={{display:"flex",justifyContent:'space-between'}}>
                            <h2>Gerenciar compra</h2>
                            <img src= "/images/shopping-bag-blue.png" style={{width:"40px",height:"40px"}}/>
                        </div>
                        
                        <div style={{marginTop:"10px"}}>
                        <p onClick={() => {navigate("/minha-conta/enderecos")}} className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Endereços de entrega</p>
                        <p className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Cartões de crédito</p>
                        </div>
                    </div>
                    <div className="card-pedidos">
                        <div style={{display:"flex",justifyContent:'space-between'}}>
                            <h2>Seu cadastro</h2>
                            <img src= "/images/user-blue.png" style={{width:"40px",height:"40px"}}/>
                        </div>
                        
                        <div style={{marginTop:"10px"}}>
                        <p className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Alterar seus dados cadastrais</p>
                        <p className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Alterar email</p>
                        <p className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Alterar senha</p>
                        <p onClick={() => {navigate("/minha-conta/enderecos")}} className="paragrafo-hover-minha-conta" style={{fontSize:"14px"}}>Seus endereços de entrega</p>
                       
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
            </div>
        </div>
    )
}

export default PaginaMinhaConta;
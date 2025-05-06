import { useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';

function PaginaDetalhesPedido(){

    const [menuHover,setMenuHover] = useState(false);

    return (
        <div className="pagina-toda-detalhes-pedido">
            <Header props="p"/>
            <div className="secao-detalhes-pedido">
                <div className={menuHover ? `container-meus-pedidos-inativo`: "container-meus-pedidos"}>
                <div className={menuHover ? `container-inativo` : ""}></div>
                <div onMouseEnter={() => {setMenuHover(true)}} onMouseLeave = {() => {setMenuHover(false)}}className="menu-lateral">
                <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/menu-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Minha conta</p></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/bag-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Compras</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/tag-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Vendas</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/coupon-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Marketing</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/pension-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Empréstimos</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/circle-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Assinaturas</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/test-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Bio livre</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/writing-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Faturamento</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/user-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Meu perfil</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/settings-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Configurações</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    
                </div>
                <div style={{display:"flex",margin:"0 auto",flexDirection:"column",padding:"20px"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Detalhes do pedido</h2>
                <button style={{backgroundColor:"#111111",color:"#ffffff", border:"2px solid #111111",borderRadius:"6px",fontSize:"20px",padding:"5px",display:"flex",gap:"10px",alignItems:"center"}}><img src="/images/seta-para-tras.png" style={{width:"25px",height:"25px"}}/>Voltar</button>
                </div>
                    
                    <div className="card-meus-pedidos">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p>Id do pedido</p>
                        <div>
                        <p>Pedido feito em : </p>
                        <p>Data</p>
                        </div>
                        </div>
                        
                        <div className="container-cards-detalhes-pedido">
                        <div style={{padding:"20px",borderRadius:"6px",backgroundColor:"white",display:"flex",flexDirection:"column",gap:"30px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px",boxSizing:"border-box", borderBottom:"2px solid rgb(211, 218, 221)",paddingBottom:"20px"}}>
                            <p style={{fontSize:"14px"}}>Vendido por:</p><p style={{color:"rgb(0, 134, 255)"}}>Luiz</p>
                            </div>
                            <h3>Status pedido</h3>
                            <div style={{backgroundColor:"white", display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                           
                            <img src="/images/cafe1.jpg" style={{width:"80px",height:"80px"}}/>
                            
                            <div>
                                <p>Nome do produto</p>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                            <button style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"white",width:"300px",height:"40px"}}>Quero trocar ou cancelar</button>
                            <button style={{backgroundColor:"#ffffff",border:"2px solid #111111",borderRadius:"6px",color:"#111111",width:"300px",height:"40px"}}>Preciso de ajuda</button>
                            </div>
                            </div>
                        </div>
                        <div className="card-gostou-do-produto">
                            <div style={{boxSizing:"border-box",borderBottom:"1px solid rgb(211, 218, 221)"}}> 
                            <p>Gostou do produto?</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                
                            
                            <p>Comprar novamente</p>
                            
                            <button style={{backgroundColor:"#ffffff",border:"2px solid #111111",borderRadius:"6px",color:"#111111",width:"300px",height:"40px"}}>Avaliar produto</button>
                            </div>
                        </div>
                        <div className="card-gostou-do-produto">
                            <div style={{boxSizing:"border-box",borderBottom:"1px solid rgb(211, 218, 221)"}}> 
                            <p>Entrega</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                
                            
                            <p>Detalhes da entrega</p>
                            
                            
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaDetalhesPedido;
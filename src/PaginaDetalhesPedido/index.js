import { useEffect, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import MenuLateral from '../componentes/menu-lateral';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function PaginaDetalhesPedido(){

    const [menuHover,setMenuHover] = useState(false);
    const {idPedido} = useParams();

    const [mostrarDetalhesPagamentoEnvio, setMostrarDetalhesPagamentoEnvio] = useState(false);
    console.log(`idpedidoe`,idPedido);
    
    const [pedido,setPedido] = useState([]);

    const calcularValorFreteTotal = () => {
    return (
        pedido.itens?.reduce((soma, item) => {
            return soma + (item.valor_frete * item.quantidade)
        },0));
    }

    const dataFormatada = (data) => {
        const date = new Date(data);
        return date.toLocaleString();
    }
    

    const imagemPagamento = { 
        Cartao : "/images/contactless-metodos-pagamento.png",
        Boleto : "/images/numbers-metodos-pagamento.png", 
        Pix : "/images/icone-pix.png"
        ,
    };

    const fetchPedido = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/meus-pedidos/${idPedido}`,{withCredentials:true})
            setPedido(resposta.data);
        }
        catch(err){
            console.error("Não foi possivel carregar o pedido");
        }
    }

    useEffect(() => {
        fetchPedido();
    },[pedido]);

    return (
        <div className="pagina-toda-detalhes-pedido">
            <Header props="p"/>
            <div className="secao-detalhes-pedido">
                <div className={menuHover ? `container-meus-pedidos-inativo`: "container-meus-pedidos"}>
                <div className={menuHover ? `container-inativo` : ""}></div>
                <MenuLateral setMenuHover={setMenuHover}/>
                <div style={{display:"flex",margin:"0 auto",flexDirection:"column",padding:"20px"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Detalhes do pedido</h2>
                <button style={{backgroundColor:"#111111",color:"#ffffff", border:"2px solid #111111",borderRadius:"6px",fontSize:"20px",padding:"5px",display:"flex",gap:"10px",alignItems:"center"}}><img src="/images/seta-para-tras.png" style={{width:"25px",height:"25px"}}/>Voltar</button>
                </div>
                    
                   <div className="card-meus-pedidos">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div>
                        <p>Id do pedido</p>
                        <p>{pedido.id}</p>
                        </div>
                        <div>
                        <p>Pedido feito em : </p>
                        <p>{dataFormatada(pedido.data_pedido)}</p>
                        </div>
                        </div>
                        
                        <div className="container-cards-detalhes-pedido">
                        <div style={{padding:"20px",borderRadius:"6px",backgroundColor:"white",display:"flex",flexDirection:"column",gap:"30px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px",boxSizing:"border-box", borderBottom:"2px solid rgb(211, 218, 221)",paddingBottom:"20px"}}>
                            <p style={{fontSize:"14px"}}>Vendido por:</p><p style={{color:"rgb(0, 134, 255)"}}>Luiz</p>
                            </div>
                            <h3>Status pedido</h3>
                            {pedido.itens?.map((item) => {return (
                                <div style={{backgroundColor:"white", display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                           
                                <img src={item.url} style={{width:"80px",height:"80px"}}/>
                                
                                <div style={{width:"500px"}}>
                                    <p>{item.nome}</p>
                                    <p>{item.cor_nome ? `Cor:${item.cor_nome}` : ""}</p>
                                    <p>{item.voltagem ? `Voltagem:${item.voltagem}` : ""}</p>
                                    <p>{item.dimensoes ? `Dimensões:${item.dimensoes}` : ""}</p>
                                    <p>{item.pesos ? `Peso:${item.pesos}` : ""}</p>
                                    <p>{item.generos ? `Genero:${item.generos}` : ""}</p>
                                    <p>{item.estampas ? `Estampa:${item.estampas}` : ""}</p>
                                    <p>{item.tamanhos ? `Tamanho:${item.tamanhos}` : ""}</p>
                                    <p>{item.materiais ? `Materiais:${item.materiais}` : ""}</p>
                                    <p>Quantidade: {item.quantidade}</p>
                                </div>
                                
                                </div>
                            )})}
                            <button style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"white",width:"100%",height:"40px"}}>Quero trocar ou cancelar</button>
                            <button style={{backgroundColor:"#ffffff",border:"2px solid #111111",borderRadius:"6px",color:"#111111",width:"100%",height:"40px"}}>Preciso de ajuda</button>
                            
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
                        
                        </div>
                        
                    </div>
                    
                </div>
                <div className="card-detalhe-da-compra">
                    <p>Detalhe da compra</p>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <p>ID pedido:</p>
                    <p>{pedido.id}</p>
                    </div>
                    <div style={{display:"flex",justifyContent:'space-between'}}>
                    <p>Produto:</p>
                <p>R${(pedido.total - pedido.preco_frete).toFixed(2)}</p>
                </div>
                <div style={{display:"flex",justifyContent:'space-between'}}>
                    <p>Frete</p>
                    <p>R${pedido.preco_frete?.toFixed(2)}</p>
                    </div>
                    <div style={{display:"flex",justifyContent:'space-between'}}>
                    <p>Total:</p>
                    <p>R${pedido.total?.toFixed(2)}</p>
                    </div>
                    <div onClick={() => {setMostrarDetalhesPagamentoEnvio(!mostrarDetalhesPagamentoEnvio)}}style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p style={{color:"#3483fa"}}>Detalhes do pagamento e envio</p>
                    
                    <img src="/images/setinha-dropdown-azul.png" style={{width:"16px",height:"16px"}}/>
                    </div>
                    <div className={`detalhes-pagamento-envio ${mostrarDetalhesPagamentoEnvio ? 'detalhes-pagamento-animated' : ''}`}>
    {/* conteúdo */}
                    <p>Pagamento</p>
                    <div className="card-pagamento-detalhes-da-compra">
                    <img src={imagemPagamento[pedido.metodo_pagamento]} style={{height:"50px",width:"50px"}}/>
                    <div>
                    <p style={{fontSize:"14px"}}>R${pedido.total?.toFixed(2)}</p>
                    <p style={{fontSize:"14px"}}>{pedido.parcelas}x de R${pedido.valor_parcela?.toFixed(2)}</p>
                    <p style={{fontSize:"12px"}}>{pedido.metodo_pagamento}</p>
                    <p style={{fontSize:"12px"}}>{pedido.metodo_pagamento === "Cartao" ? pedido.cartao_mascarado : ""}</p>
                    <p style={{fontSize:"12px"}}>{dataFormatada(pedido.data_pedido)}</p>
                    <p style={{fontSize:"12px"}}>Status pagamento</p>
                    </div>
                    </div>
                    <p>Frete</p>
                    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                    <div className="card-pagamento-detalhes-da-compra">
                    <img src="/images/truck-black.png" style={{height:"50px",width:"50px"}}/>
                    <div>
                        <div style={{display:"flex", gap:"20px",flexWrap:"wrap"}}>
                    <p style={{fontSize:"14px"}}>{pedido.endereco_logradouro ? `${pedido.endereco_logradouro}` : ""}</p>
                    <p style={{fontSize:"14px"}}>{pedido.endereco_numero ? `Número:${pedido.endereco_numero}` : ""}</p>
                    <p style={{fontSize:"14px"}}>{pedido.endereco_complemento ? `Complemento: ${pedido.endereco_complemento}` : ""}</p>
                    </div>
                    <div style={{display:"flex"}}>
                    <p style={{fontSize:"12px"}}>{pedido.endereco_cidade}</p>
                    <p style={{fontSize:"12px"}}>{pedido.endereco_estado && pedido.endereco_cidade ? `,${pedido.endereco_estado}` : ""} </p>
                    </div>
                    </div>
                    </div>
                    {pedido.itens?.map((item) => { return (
                        <div className="card-pagamento-detalhes-da-compra">
                        <img src={item.url} style={{height:"50px",width:"50px"}}/>
                        <div>
                        <p style={{fontSize:"14px"}}>{item.nome}</p>
                        <p style={{fontSize:"14px"}}>R${item.sub_total?.toFixed(2)}</p>
                        <p style={{fontSize:"12px"}}>{item.quantidade ? item.quantidade === 1 ? `${item.quantidade} unidade` : `${item.quantidade} unidades` : ""}</p>
                        
                        </div>
                        </div>
                        )
                    })}
                    
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
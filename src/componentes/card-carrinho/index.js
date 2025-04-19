import { useCarrinho } from '../../context/carrinhoContext';
import './styles.css'
import axios from 'axios';
function CardCarrinho({item,precoTotal,precoTotalPix,adicionarItemSalvo,mostrarModalAlterar,fetchItemSelecionado}){
    const {editarQuantidadeItemCarrinho,carrinhoItens,excluirItemCarrinho} = useCarrinho();


    

    const calcularDesconto = (desconto) => {
        const descontoNumber = Number(desconto);
        return descontoNumber ? `-${descontoNumber}%` : "";
    }
    

    const calcularPrecoTotal = (item) => {
        return carrinhoItens.reduce((soma,item) => {
            const preco = Number(item.preco_pix);
            const quantidade = Number(item.quantidade);
            return soma + preco * quantidade
        },0);
    }
    return (
        <div className="container-imagem-texto-carrinho">
                    <img src={item.imagem_produto} className="imagem-produto-pagina-carrinho"/>
                    <div className="container-texto-botoes">
                    <p>{item.produto_nome}</p>
                    <p>Cor:{item.cores}</p>
                    <div className="container-botoes-excluir-salvar-altera">
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => excluirItemCarrinho(item.id)}>Excluir</p>
                        <p onClick={() => {adicionarItemSalvo(item.produto_id); excluirItemCarrinho(item.id)}} style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Salvar</p>
                        <p onClick = {() => {mostrarModalAlterar();fetchItemSelecionado(item.produto_id, item.quantidade)}} style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Alterar</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Comprar Agora</p>
                        </div>
                    
                    </div>
                    <div className="container-botao-alterar-quantidade">
                    <img src={item.quantidade === 1 ? "/images/minus-grey.png" : "/images/minus.png"} className="botao-menos-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade - 1, item.id)}/>
                    <p>{item.quantidade}</p>
                    <img src = "/images/plus.png" className="botao-mais-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade + 1, item.id)}/>
                    </div>
                    <div className="container-preco-preco-pix-desconto">
                        <div className="container-preco-desconto">
                        <p style = {{fontSize: "12px", color:`#00a650`}}>{calcularDesconto(item.desconto)}</p>
                        <p style = {{fontSize: "12px", textDecoration: "line-through"}}>R${precoTotal}</p>
                        </div>
                        <p style={{fontSize:"20px",marginLeft:"10px"}}>R${precoTotalPix.toFixed(2)}</p>
                        
                    </div>
                    </div>
    )
}

export default CardCarrinho;
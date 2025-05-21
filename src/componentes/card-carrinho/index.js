import { useCarrinho } from '../../context/carrinhoContext';
import './styles.css'
import axios from 'axios';
function CardCarrinho({item,precoTotal,precoTotalPix,adicionarItemSalvo,mostrarModalAlterar,fetchItemSelecionado,carregarItensSalvos}){
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
                    <div>
                    <p>{item.cores ? `Cor:`+ item.cores : ""}</p>
                    <p>{item.materiais ? `Material:` + item.materiais : ""}</p>
                    </div>
                     
                    <div className="container-botoes-excluir-salvar-altera">
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => excluirItemCarrinho(item.produto_id,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids)}>Excluir</p>
                        <p onClick={() => {adicionarItemSalvo(item.produto_id,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids); excluirItemCarrinho(item.produto_id,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids)}} style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Salvar</p>
                        <p onClick = {() => {mostrarModalAlterar();fetchItemSelecionado(item.produto_id, item.quantidade,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids)}} style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Alterar</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Comprar Agora</p>
                        </div>
                    
                    </div>
                    <div className="container-botao-alterar-quantidade">
                    <img src={item.quantidade === 1 ? "/images/minus-grey.png" : "/images/minus.png"} className="botao-menos-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade - 1, item.id,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids,item.produto_id)}/>
                    <p>{item.quantidade}</p>
                    <img src = "/images/plus.png" className="botao-mais-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade + 1, item.id,item.cores_ids,item.voltagem_ids,item.dimensoes_ids,item.pesos_ids,item.generos_ids,item.estampas_ids,item.tamanhos_ids,item.materiais_ids,item.produto_id)}/>
                    </div>
                    <div className="container-preco-preco-pix-desconto">
                        <div className="container-preco-desconto">
                        <p style = {{fontSize: "12px", color:`#00a650`}}>{calcularDesconto(item.desconto)}</p>
                        <p style = {{fontSize: "12px", textDecoration: "line-through"}}>R${precoTotal}</p>
                        </div>
                        <p style={{fontSize:"20px",marginLeft:"10px"}}>R${(precoTotalPix || precoTotal)}</p>
                        
                    </div>
                    </div>
    )
}

export default CardCarrinho;
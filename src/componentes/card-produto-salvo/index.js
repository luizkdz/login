import './styles.css'
import { useCarrinho } from '../../context/carrinhoContext';
import axios from 'axios';

function CardProdutoSalvo({item,precoTotal,precoTotalPix,adicionarItemSalvo,excluirItemSalvo, obterCarrinho,atualizarItemSalvo,mostrarModalAlterar,fetchItemSalvo}){
    const {editarQuantidadeItemCarrinho,carrinhoItens,excluirItemCarrinho,adicionarAoCarrinho} = useCarrinho();


    

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
        <div className="container-produto-salvo">
                    <img src={item.url} className="imagem-produto-itens-salvos"/>
                    <div className="container-texto-botoes">
                    <p>{item.nome.length > 20 ? item.nome.slice(0,17) + "..." : item.nome}</p>
                    <p>{item.cor_valor ? `Cor:` + item.cor_valor : ""}</p>
                    <p>{item.material_valor ? `Material:` + item.material_valor : ""}</p>
                    <div className="container-botoes-excluir-salvar-altera">
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => excluirItemSalvo(item.produto_id,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id)}>Excluir</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => {adicionarAoCarrinho(item.produto_id,item.quantidade,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id); excluirItemSalvo(item.produto_id,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id); obterCarrinho()}}>Adicionar ao carrinho</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => {mostrarModalAlterar();console.log(`materialId é`,item.material_id);fetchItemSalvo(item.produto_id, item.quantidade,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id)}}>Alterar</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Comprar Agora</p>
                        </div>
                    
                    </div>
                    <div className="container-botao-alterar-quantidade">
                    <img src={item.quantidade === 1 ? "/images/minus-grey.png" : "/images/minus.png"} className="botao-menos-quantidade" onClick={() => atualizarItemSalvo(item.quantidade - 1, item.id,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id,item.produto_id)}/>
                    <p>{item.quantidade}</p>
                    <img src = "/images/plus.png" className="botao-mais-quantidade" onClick={() => atualizarItemSalvo(item.quantidade + 1, item.id,item.cor_id,item.voltagem_id,item.dimensoes_id,item.peso_id,item.genero_id,item.estampas_id,item.tamanho_id,item.material_id,item.produto_id)}/>
                    </div>
                    <div className="container-preco-preco-pix-desconto">
                        <div className="container-preco-desconto">
                        
                        </div>
                        <p style={{fontSize:"20px",marginLeft:"10px"}}>R${precoTotal}</p>
                        
                    </div>
                    </div>
    )
}

export default CardProdutoSalvo;
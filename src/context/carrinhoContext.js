import { createContext, useContext, useState } from "react";
import axios from 'axios';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({children}) => {
    const [carrinhoItens,setCarrinhoItens] = useState([])


const obterCarrinho = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/cart`,{withCredentials:true});
            setCarrinhoItens(resposta.data);
        }
        catch(err){
            console.error("Erro ao obter carrinho");
        }
    }

const adicionarAoCarrinho = async (produtoId, quantidade, corId = null, voltagemId = null, dimensoesId = null, pesosId = null, generoId = null, estampasId = null, tamanhosId = null, materiaisId) => {
    try {
        const resposta = await axios.post("http://localhost:5000/cart", {
            produtoId,
            quantidade,
            corId,
            voltagemId,
            dimensoesId,
            pesosId,
            generoId,
            estampasId,
            tamanhosId,
            materiaisId,
        }, { withCredentials: true });

        console.log(`dimensoesId e`, dimensoesId);
        

        await obterCarrinho();
    } catch (err) {
        console.error("Não foi possível adicionar item ao carrinho", err);
    }
};

const excluirItemCarrinho = async (itemId, corId = null, voltagemId = null, dimensoesId = null, pesosId = null, generoId = null, estampasId = null, tamanhosId = null, materiaisId = null) => {
    try{
        await axios.delete(`http://localhost:5000/cart/${itemId}`,{data: { produtoId: itemId,
            corId,
            voltagemId,
            dimensoesId,
            pesosId,
            generoId,
            estampasId,
            tamanhosId,
            materiaisId
        }, withCredentials:true});
        await obterCarrinho();
    }
    catch(err){
        console.error("Não foi possível excluir o item do carrinho");
    }
}
const editarQuantidadeItemCarrinho = async (novaQuantidade,itemId,corId = null,voltagemId = null, dimensoesId = null, pesosId = null,generoId = null, estampasId = null,tamanhosId = null, materiaisId = null,alterar=null,produtoId = null) => {
    try{
        await axios.put(`http://localhost:5000/cart/${itemId}`,{
        quantidade:Number(novaQuantidade),
        corId,
        voltagemId,
        dimensoesId,
        pesosId,
        generoId,
        estampasId,
        tamanhosId,
        materiaisId,
        produtoId,
        alterar
        
        },{withCredentials:true});
        await obterCarrinho();
        console.log(typeof novaQuantidade);
    }
    
    catch(err){
        console.error("Não foi possivel editar a quantidade de item no carrinho");
    }


}


return (
    <CarrinhoContext.Provider value={{carrinhoItens,setCarrinhoItens,obterCarrinho,adicionarAoCarrinho,editarQuantidadeItemCarrinho,excluirItemCarrinho }}>
        {children}
    </CarrinhoContext.Provider>
)
}
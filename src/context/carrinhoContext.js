import { createContext, useContext, useState } from "react";
import axios from 'axios';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({children}) => {
    const [carrinhoItens,setCarrinhoItens] = useState([])


const obterCarrinho = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/cart`);
            setCarrinhoItens(resposta.data);
        }
        catch(err){
            console.error("Erro ao obter carrinho");
        }
    }

const adicionarAoCarrinho = async (produtoId,quantidade) => {
    try{
        const resposta = await axios.post("http://localhost:5000/cart",{
            produtoId,
            quantidade
        },{withCredentials:true});
        console.log(`A resposta é :`, resposta);
        setCarrinhoItens((prev) => {
        const existente = prev.find((item) => { return item.produto_id === produtoId})
        if(existente){
        return prev.map((item) => {
        return item.produto_id === produtoId ? {...item, quantidade: item.quantidade + quantidade} : item;
        })
        }
        else{
           return [...prev,{produto_id:produtoId,quantidade}];
        }
        })        
    }
    catch(err){
        console.error("Não foi possivel adicionar item ao carrinho");
    }
}

const excluirItemCarrinho = async (itemId) => {
    try{
        await axios.delete(`http://localhost:5000/cart/${itemId}`,{withCredentials:true})
        setCarrinhoItens((prev) => {return prev.filter((item) => {return item.id !== itemId })});
    }
    catch(err){
        console.error("Não foi possível excluir o item do carrinho");
    }
}
const editarQuantidadeItemCarrinho = async (novaQuantidade,itemId) => {
    try{
        await axios.put(`http://localhost:5000/cart/${itemId}`,{
        quantidade:novaQuantidade
        });
        setCarrinhoItens((prev) => {
            return prev.map((item) => {
                return item.id === itemId ? {...item, quantidade:novaQuantidade} : item;
            })
        });
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
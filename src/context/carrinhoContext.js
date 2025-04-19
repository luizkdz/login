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

const adicionarAoCarrinho = async (produtoId, quantidade, corId = null, voltagemId = null, dimensoesId = null, pesosId = null, generoId = null, estampasId = null, tamanhosId = null, materiaisId = null) => {
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

        console.log(`A resposta é :`, resposta);

            setCarrinhoItens((prev) => {
                console.log(`prev é`, prev);
                console.log(`Cor id é`, corId);

                // A busca de um item que tenha um corId diferente (ou seja, não o mesmo)
                const existente = prev.find((item) => {
                    return item.produto_id === produtoId &&
                        Number(item.cores_ids) === Number(corId ?? null); // Se cores_ids for diferente
                });

                console.log(`Existente é`, existente);

                // Se o item não existir, adiciona um novo item ao carrinho
                if (!existente) {
                    return [...prev, {
                        produto_id: produtoId,
                        quantidade,
                        cores_ids: corId,
                        voltagemId,
                        dimensoesId,
                        pesosId,
                        generoId,
                        estampasId,
                        tamanhosId,
                        materiaisId
                    }];
                } else {
                    // Se o item já existir com as mesmas características, atualiza a quantidade
                    return prev.map((item) => {
                        if (item.produto_id === produtoId &&
                            Number(item.cores_ids) === Number(corId ?? null) &&
                            item.tamanhosId === tamanhosId &&
                            item.dimensoesId === dimensoesId &&
                            item.estampasId === estampasId &&
                            item.generoId === generoId &&
                            item.materiaisId === materiaisId &&
                            item.pesosId === pesosId &&
                            item.voltagemId === voltagemId) {
                            return { ...item, quantidade: item.quantidade + quantidade }; // Atualiza a quantidade
                        }
                        return item; // Caso contrário, mantém o item como está
                    });
                }
            });
    } catch (err) {
        console.error("Não foi possível adicionar item ao carrinho", err);
    }
};

const excluirItemCarrinho = async (itemId) => {
    try{
        await axios.delete(`http://localhost:5000/cart/${itemId}`,{withCredentials:true})
        setCarrinhoItens((prev) => {return prev.filter((item) => {return item.id !== itemId })});
    }
    catch(err){
        console.error("Não foi possível excluir o item do carrinho");
    }
}
const editarQuantidadeItemCarrinho = async (novaQuantidade,itemId,atualizacoes) => {
    try{
        await axios.put(`http://localhost:5000/cart/${itemId}`,{
        quantidade:Number(novaQuantidade),
        ...atualizacoes
        
        });
        setCarrinhoItens((prev) => {
            return prev.map((item) => {
                return item.id === itemId ? {...item, quantidade:novaQuantidade,...atualizacoes} : item;
            })
        });
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
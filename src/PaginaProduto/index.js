import { useParams } from 'react-router-dom';
import './styles.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

function PaginaProduto(){
    const { id} = useParams();
    const [produto,setProduto] = useState(null);

    const buscarProduto = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/produto/${id}`);
            setProduto(resposta.data.produto);
        }
        catch(err){
            console.log("Erro ao buscar produto");
        }
    }
    useEffect(() => {
        buscarProduto();
    },[])

    return (
        <div>
            {produto ? (
                <>
                    <h1>{produto.nome}</h1>
                    <img src={produto.imagem} alt={produto.nome} />
                    <p>{produto.preco}</p>
                    <p>{produto.descricao}</p>
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );  
}

export default PaginaProduto;
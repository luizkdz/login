import './styles.css';
import Card from '../card/index.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function SessaoProdutos() { 
    const navigate = useNavigate();
    const redirectProduct = (id) => {
        navigate(`/produto/${id}`)
    }

    const [produtos,setProdutos] = useState([]);

    const fetchProducts = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/produtos");
            setProdutos(resposta.data);
        }
        catch(err){
            console.log("Erro ao buscar produtos", err);
        }

    }

    useEffect(() => {
        fetchProducts();
    },[])
    
    return (
        <div className="secao-produtos">
            <div className="container-produtos">
            <h1>Em oferta</h1>
            <div className="container-cards-produtos">
            {produtos.map((item) => (
                
                <Card 
                    key={item.nome} 
                    imagem={item.imagem} 
                    nome={item.nome} 
                    preco={item.preco} 
                    descricao={item.descricao}
                onClick = {() => {redirectProduct(item.id)}}
                />
            ))}</div>
        </div>
        </div>
    );
}

export default SessaoProdutos;
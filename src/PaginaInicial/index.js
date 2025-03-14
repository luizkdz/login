import axios from 'axios';
import { useEffect,useState } from 'react';
function PaginaInicial(){

    const [nome, setNome] = useState('');
    
    useEffect(() => {
        const pickName = async () => {
            try{
                const resposta = await axios.get("http://localhost:5000/paginainicial", {include:true}, {withCredentials: true});
                setNome(resposta.data.nome);
            }
            catch(error){
                console.log(error);
            }
        };
        pickName();
    },[]);
    return (
        <div>
            <h1>Bem vindo, {nome} </h1>
        </div>
)}

export default PaginaInicial;
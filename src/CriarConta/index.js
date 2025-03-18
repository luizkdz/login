import { useState } from "react";
import axios from "axios";
function CriarConta(){

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha,setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const resposta = await axios.post("http://localhost:5000/cadastrar", {nome, email, senha}, {include:true}, {withCredentials: true});
            alert(resposta.data);
        }
        catch(err){
            throw new Error("Erro");
        }
    
    }
    
    return (
    <div>
        <form onSubmit={handleSubmit}>
        <input placeholder = "Nome" type = "nome" required onChange={(e) => setNome(e.target.value)}></input>
        <input placeholder = "Email" type = "email" required onChange={(e) => setEmail(e.target.value)}></input>
        <input placeholder = "Senha" required onChange={(e) => setSenha(e.target.value)}></input>
        <button type="submit">Cadastrar</button>
        </form>
    </div>

)}



export default CriarConta;
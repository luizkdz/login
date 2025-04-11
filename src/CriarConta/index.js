import { useState } from "react";
import axios from "axios";
import './styles.css';
import Header from '../componentes/header/index.js'
import Footer from "../componentes/footer/index.js";
function CriarConta(){

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha,setSenha] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const resposta = await axios.post("http://localhost:5000/cadastrar", {nome, email, senha}, {include:true}, {withCredentials: true});
            alert(resposta.data);
            window.location.href = "/";
        }
        catch(err){
            alert(err.response?.data);
        }
    
    }
    const handleBack = () => {
        window.location.href= "/";
    }
    
    return (
    <div className="pagina-toda">
        <Header/>
        <div className="container-card">
            <div className="card">
            <img src="../images/logo.svg" alt="logo"/>  
        <form onSubmit={handleSubmit}>
            <div className="container-criarConta">
        <input placeholder = "Nome" type = "nome" required onChange={(e) => setNome(e.target.value)}></input>
        <input placeholder = "Email" type = "email" required onChange={(e) => setEmail(e.target.value)}></input>
        <input placeholder = "Senha" required onChange={(e) => setSenha(e.target.value)}></input>
        <button type="submit">Cadastrar</button>
         <button onClick={handleBack}>Voltar</button>
        </div>
        </form>
       
        
    </div>
    </div>
    <Footer/>
    </div>

)}



export default CriarConta;
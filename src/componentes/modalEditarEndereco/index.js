import './styles.css';

import { useEffect, useState } from 'react';
import './styles.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ModalEditarEndereco({enderecoId,handleNext,handleMostrarModalComoPagar,handleMostrarReviseEConfirme,setSecaoMeusEnderecos,setAdicionarNovoEndereco,handleBack,setAtualizarEnderecos,atualizarEnderecos}) {
    
    const [cep,setCep] = useState("");
    const [rua, setRua] = useState("")
    const [numero, setNumero] = useState("")
    const [complemento, setComplemento] = useState("")
    const [informacoesAdicionais, setInformacoesAdicionais] = useState("")
    const [tipoDoLocal, setTipoDoLocal] = useState(null);
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [bairro,setBairro] = useState("");
    const [cidade,setCidade] = useState("");
    const [estado,setEstado] = useState("");
    const [erroCep, setErroCep] = useState("");
    const location = useLocation();


const carregarInformacoesEditarEndereco = async (enderecoId) => {
    try{
        const resposta = await axios.get(`http://localhost:5000/enderecos/${enderecoId}`,{withCredentials:true});
            setCep(resposta.data.cep);
            setRua(resposta.data.logradouro);
            setNumero(resposta.data.numero);
            setComplemento(resposta.data.complemento);
            setBairro(resposta.data.bairro);
            setCidade(resposta.data.cidade);
            setEstado(resposta.data.estado);
            setTelefone(resposta.data.telefone);
            setNome(resposta.data.nome);
            setInformacoesAdicionais(resposta.data.informacoes_adicionais);
            setTipoDoLocal(resposta.data.tipo_do_local);
    }
    catch(err){
        console.error("Não foi possivel carregar as informações");
    }
}

useEffect(() => {
    if(enderecoId){
        carregarInformacoesEditarEndereco(enderecoId);
    }
},[]);

    const calcularCidadeEstado = async (cep) => {
    const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    
    if (resposta.data && resposta.data.localidade && resposta.data.estado) {
    setCidade(resposta.data.localidade);
    setEstado(resposta.data.uf);
    setErroCep("");
    setBairro(resposta.data.bairro);
    setRua(resposta.data.logradouro);
}
else{
    setErroCep("Digite um CEP válido.Tente novamente");
}
}

const handleSalvarEndereçoEditado = async () => {
    try{
        await axios.put(`http://localhost:5000/salvar-endereco/${enderecoId}`,{
            cep,
            rua,
            numero,
            complemento,
            informacoesAdicionais,
            tipoDoLocal,
            nome,
            telefone,
            bairro,
            cidade,
            estado,
        }, {withCredentials:true}
        )
        setAtualizarEnderecos(!atualizarEnderecos);
        handleBack(); 
    }
    catch(err){
        console.error("Não foi possivel salvar o endereço")
    }
}


    return (
        
        <div style={{alignItems:"center"}}className="titulo-forma-entrega">
            <form> 
                    <p style={{fontSize:"24px"}}>Editar endereço</p>
                    <div style={{position:"relative"}}className="card-forma-entrega">
                        
                        <div style={{flexDirection:"column",gap:"5px",alignItems:"start"}}className="container-card-forma-entrega">
                        <div>
                        <p>CEP</p>
                        <input minLength={8} maxLength={8} value = {cep} onBlur={() => {if(cep.length < 8){setErroCep("CEP deve ter 8 dígitos") } else if(/^\d{8}$/.test(cep)){
                            calcularCidadeEstado(cep)}
                    }} onChange={(e) =>{setCep(e.target.value)}} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}}/>
                            {erroCep && <p style={{color:"red"}}>{erroCep}</p>}
                            </div> 
                            {estado && cidade ? <div style={{alignItems:"center",display:"flex", gap:"10px"}}>
                            <img src="/images/gps.png" style={{width:"16px",height:"16px"}}/>
                            <div style={{gap:"20px"}}className="container-texto-forma-entrega">
                            <p>{estado}, {cidade} {bairro ? `,${bairro}` : ""}</p>
                            </div>
                            </div> : ""} 
                            <div style={{display:"flex",gap:"20px"}}>
                            <div>
                            <p>Rua / Avenida</p>
                            <input value = {rua} onChange={(e) => setRua(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}}/>
                            </div>
                            <div>
                            <p>Número</p>
                            <input value = {numero} onChange={(e) => setNumero(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}}/>
                            </div>
                            </div>
                            <div>
                            <p>Complemento(opcional)</p>
                            <input value = {complemento} onChange={(e) => setComplemento(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}}/>
                            </div>
                            <p>Bairro</p>
                            <input value = {bairro} onChange={(e) => setBairro(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}}/>
                            </div>
                            <div>
                            <p>Informações adicionais</p>
                            <textarea value = {informacoesAdicionais} onChange={(e) => setInformacoesAdicionais(e.target.value)} style={{resize:"none",border:"1px solid #c1c1c1",borderRadius:"6px",height:"100px",width:"600px",padding:"10px"}} placeholder="Descrição da fachada, pontos de refêrencia, informações de segurança, etc"/>
                            </div>
                            <div>
                            <p>Este é o seu trabalho ou sua casa?</p>
                            <div style={{display:"flex",flexDirection:"column",gap:"20px",paddingTop:"10px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                            <input value = {tipoDoLocal} checked = {tipoDoLocal === "casa"} onChange={() => setTipoDoLocal("casa")} type="radio" style={{width:"20px",height:"20px"}}/>
                            <img src="/images/home.png" style={{width:"25px",height:"25px"}} />
                            <p>Casa</p>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                            <input value = {tipoDoLocal} checked= {tipoDoLocal === "comercial"} onChange = {() => setTipoDoLocal("comercial")} type="radio" style={{width:"20px",height:"20px"}}/>
                            <img src="/images/comercial.png" style={{width:"25px",height:"25px"}} />
                            <p>Comercial</p>
                            </div>
                            </div>
                            <div style={{marginTop:"20px"}}>
                            <p>Dados de contato</p>
                            <p style={{fontSize:"14px",color:"rgba(0, 0, 0, .55)"}}>Se houver algum problema no envio, você receberá uma ligação nesse número.</p>
                            
                            </div>
                            <div style={{marginTop:"20px",display:"flex",flexDirection:"column",gap:"20px"}}>
                            <div>
                            <p>Nome e sobrenome</p>
                            <input value = {nome} onChange={(e) => setNome(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"600px",padding:"10px"}}/>
                            </div>
                            <div>
                            <p>Telefone de contato</p>
                            <input value = {telefone} onChange={(e) => setTelefone(e.target.value)} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"600px",padding:"10px"}}/>
                            </div>
                            </div>
                            
                            </div>
                            
                        </div>
                        
                        <div style={{display:"flex",flexDirection:"column",alignItems:"end"}}>
                        <button type="submit" style={{position:"static", marginBottom:"20px",backgroundColor:"rgb(52, 131, 250)",border:"none"}} className="botao-continuar-forma-entrega" onClick={() => {if(location.pathname === "/checkout"){
                            handleSalvarEndereçoEditado();
                        }
                            }}>Salvar</button>
                        
                        </div>
                        </form>
                    </div>
    )
}

export default ModalEditarEndereco;
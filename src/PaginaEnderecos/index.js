import axios from 'axios';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import { useEffect, useRef, useState } from 'react';
import ModalAdicionarEndereco from '../componentes/modalAdicionarEndereco';
import ModalEditarEndereco from '../componentes/modalEditarEndereco';
import React from 'react'
function PaginaEnderecos() {
    const [enderecos,setEnderecos] = useState([]);
    const [adicionarNovoEndereco, setAdicionarNovoEndereco] = useState(false);
    const [secaoMeusEnderecos, setSecaoMeusEnderecos] = useState(false);
    const [mostrarModalEditarEndereco,setMostrarModalEditarEndereco] = useState(false);
    const [enderecoId, setEnderecoId] = useState(null)
    const [step,setStep] = React.useState(1);
    const isPoppingState = useRef(false);

    const [mostrarEditarEndereco,setMostrarEditarEndereco] = useState(false);

    const handleMostrarModalEditarEndereco = async (enderecoId) => {
        setEnderecoId(enderecoId);
        setMostrarModalEditarEndereco(true);
        setSecaoMeusEnderecos(false);
    }
    
    
    const handleAdicionarNovoEndereco = () => {
        setSecaoMeusEnderecos(false);
        setAdicionarNovoEndereco(true);
    }

    const handleExcluirEndereco = async (enderecoId) => {
        try{
            await axios.delete(`http://localhost:5000/enderecos/${enderecoId}`,{withCredentials:true});
        }
        catch(err){
            console.error("Não foi possivel excluir o endereço");
        }
    }

    const handleTornarPadrao = async (enderecoId) => {
        try{
            await axios.put(`http://localhost:5000/enderecos/${enderecoId}`,{},{withCredentials:true})
        }
        catch(err){
            console.error("Não foi possivel tornar endereço padrão");
        }
    }

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };
    const handleBack = () => {
        setStep((prev) => prev - 1);
    };
    const fetchEnderecos = async () => {
        const resposta = await axios.get("http://localhost:5000/enderecos",{withCredentials:true});
        setEnderecos(resposta.data);
    }
    useEffect(() => {
            if (!isPoppingState.current) {
                window.history.pushState({ step }, '');
            } else {
                isPoppingState.current = false;
            }
        }, [step]);
        
        useEffect(() => {
            const onPopState = (event) => {
                if (event.state) {
                    isPoppingState.current = true;
                    setStep(event.state.step);
                }
            };
        
            window.addEventListener('popstate', onPopState);
            return () => {
                window.removeEventListener('popstate', onPopState);
            };
            
        }, []);
        useEffect(() => {
            console.log(`step atualizado para`, step);
        
            if (step === 1) {
               setSecaoMeusEnderecos(true);
            } else if (step === 2 && !mostrarEditarEndereco) {
                setAdicionarNovoEndereco(true);
                setSecaoMeusEnderecos(false);
            } else if (step === 2 && mostrarEditarEndereco) {
                setMostrarModalEditarEndereco(true);
                setSecaoMeusEnderecos(false);   
            }

        }, [step]);
    

    useEffect(() => {
        fetchEnderecos();
    },[enderecos]);

    return(
        <div className="pagina-toda-pagina-enderecos">
            <Header props="p"/>
            <div className="secao-meus-enderecos">
                {step === 1 ? <div style={{margin:"0 auto",display:"flex",flexDirection:"column",gap:"30px"}}>
                <div style={{paddingTop:"20px",paddingBottom:"20px"}}>
                <h2>Endereço de entrega</h2>
                </div>
                <p>Endereço padrão</p>
                    {enderecos.filter((item) => {return item.padrao === 1}).map((item) => {
                        return (
                            <div>
                    <div className="card-meus-enderecos">
                    <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                    <img src={item.tipo_do_local === "casa" ? `/images/home.png`: `/images/comercial.png`} style={{width:"50px",height:"50px"}}/>
                        <div>
                        <p>{item.nome_destinatario}</p>
                        
                        
                        <p>{item.logradouro} {item.numero} - {item.complemento ? `complemento:${item.complemento}` : ""} - {item.bairro} - {item.cidade}/{item.estado}</p>
                        </div>
                        <p>CEP:{item.cep}</p>
                        </div>
                        <div style={{display:"flex",gap:"30px"}}>
                            <p onClick={() => {handleTornarPadrao(item.id_endereco)}} style={{display: item.padrao ? "none" : "block",cursor:"pointer",color:"rgb(0, 134, 255)"}}>Tornar padrão</p>
                            <p onClick={() => {{handleNext();setMostrarEditarEndereco(true);handleMostrarModalEditarEndereco(item.id_endereco);}}} style={{cursor:"pointer",color:"rgb(0, 134, 255)"}}>Editar</p>
                            <p onClick={() => {handleExcluirEndereco(item.id_endereco)}}style={{cursor:"pointer",color:"rgb(0, 134, 255)"}}>Excluir</p>
                        </div>
                    </div>
                    </div>
                        )
                    })}
                    <p>Outros endereços</p>
                    {enderecos.filter((item) => {return item.padrao !== 1}).map((item) => {return (
                        <div>   
                        {item.padrao ? <p>Endereço padrão</p>:""}
                        
                        <div className="card-meus-enderecos">
                        <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                        <img src={item.tipo_do_local === "casa" ? `/images/home.png`: `/images/comercial.png`} style={{width:"50px",height:"50px"}}/>
                            <div>
                            <p>{item.nome_destinatario}</p>
                            
                            
                            <p>{item.logradouro} {item.numero} - {item.complemento ? `complemento:${item.complemento}` : ""} - {item.bairro} - {item.cidade}/{item.estado}</p>
                            </div>
                            <p>CEP:{item.cep}</p>
                            </div>
                            <div style={{display:"flex",gap:"30px"}}>
                                <p onClick={() => {handleTornarPadrao(item.id_endereco)}} style={{display: item.padrao ? "none" : "block",color:"rgb(0, 134, 255)",cursor:"pointer"}}>Tornar padrão</p>
                                <p onClick={() => {{handleNext();setMostrarEditarEndereco(true);handleMostrarModalEditarEndereco(item.id_endereco);}}} style={{cursor:"pointer",color:"rgb(0, 134, 255)"}}>Editar</p>
                                <p onClick={() => {handleExcluirEndereco(item.id_endereco)}}style={{cursor:"pointer",color:"rgb(0, 134, 255)"}}>Excluir</p>
                            </div>
                        </div>
                        </div>

                    )})}
                <div style={{marginTop:"20px",marginBottom:"20px",display:"flex",justifyContent:"end"}}>
                <button onClick ={() => {handleNext();handleAdicionarNovoEndereco();setMostrarModalEditarEndereco(false);}} style={{padding:"10px",border:"2px solid rgb(0, 134, 255)",backgroundColor:"rgb(0, 134, 255)",borderRadius:"6px"}}><p style={{color:"white",fontWeight:"bold"}}>Adicionar novo endereço</p></button>
                </div>
                </div> : ""}
            {step === 2 && mostrarEditarEndereco ? <ModalEditarEndereco enderecoId={enderecoId} handleBack={handleBack} /> : ""}
            {step === 2 && !mostrarEditarEndereco ? <ModalAdicionarEndereco setSecaoMeusEnderecos={setSecaoMeusEnderecos} setAdicionarNovoEndereco={setAdicionarNovoEndereco} handleBack={handleBack}/> 
             : ""}
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaEnderecos
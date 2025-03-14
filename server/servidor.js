require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();


const port = 5000;


app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],credentials: true,
    allowedHeaders:["Content-type"]}),
);

app.use(cookieParser());
const bancoDeDados = [];


class User{
    constructor(nome,senha){
        this.nome = nome;
        this.senha = senha;
    }

}

app.get("/paginainicial", async(req, res) => {
    const usuario = req.cookies.usuarioLogado;
    if(usuario){
        res.status(200).json({nome: usuario})
    }
    else{
        res.status(401).json({message: "Nenhum usuário logado"});
    }
})
app.post("/login",async (req,res) => {
    const {nome , senha} = req.body;
    if(!nome || !senha){
        res.status(401).send("Usuario e senha são obrigatórios");
    }
    const encontrado = bancoDeDados.find(u => u.nome === nome && u.senha === senha);

            if(encontrado){
                res.cookie("usuarioLogado", encontrado.nome, {httpOnly: true, maxAge:3600000, sameSite: "lax"})
                res.status(200).json({message : "Logando...",nome: encontrado.nome});
                
            }
            else{
                res.status(401).json({message: "Usuario ou senha inválidos"});
            }
            
        

    }
);

app.get("/", (req, res) => {
    res.send("Servidor rodando com sucesso!");
});

app.post("/cadastrar", (req,res) => {
    const {nome,senha} = req.body;
    const user = new User(nome,senha);
    bancoDeDados.push(user);
    console.log(bancoDeDados);
    res.status(200).send("O usuario foi criado com sucesso");
})



app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});
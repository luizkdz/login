require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();


const port = 5000;


app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],credentials: true,
    allowedHeaders:["Content-type"]}),
);


let bancoDeDados = [];


class User{
    constructor(nome,senha){
        this.nome = nome;
        this.senha = senha;
    }

}
const autenticarToken = (req, res, next) => {
    const cookies = req.headers.cookie || "";
    const usuarioCookie = cookies.split("; ").find((cookie) => cookie.startsWith("token="));

    if (!usuarioCookie) {
        return res.status(401).json({ message: "Token ausente ou inválido" });
    }

    const token = decodeURIComponent(usuarioCookie.split("=")[1]);
    
    try {
        const decoded = jwt.verify(token, "segredo_seguranca");
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido" });
    }
}


app.get("/paginainicial",autenticarToken, (req, res) => {
    res.status(200).json({nome:req.usuario.nome});
})
app.post("/login",async (req,res) => {
    const {nome , senha} = req.body;
    
    const encontrado = bancoDeDados.find(u => u.nome === nome);
    
    if(!encontrado || !(await bcrypt.compare(senha,encontrado.senha))){
       return res.status(401).send("Usuario ou senha inválidos");
    }

    else{
        const token = jwt.sign({nome: encontrado.nome}, "segredo_seguranca", {expiresIn:"1h"});
        res.setHeader("Set-Cookie", `token=${encodeURIComponent(token)}; Max-Age=3600; HttpOnly; Path=/; Secure; SameSite=None`);
        res.status(200).json({message : "Logando..."});  
            }
            
    }
);

app.get("/", (req, res) => {
    res.send("Servidor rodando com sucesso!");
});

app.post("/cadastrar", async (req,res) => {
    const {nome,senha} = req.body;

    const hashedPassword = await bcrypt.hash(senha,10);

    const user = new User(nome,hashedPassword);
    bancoDeDados.push(user);
    console.log(bancoDeDados);
    res.status(200).send("O usuario foi criado com sucesso");
})

app.post("/logout", (req,res) => {
    res.setHeader("Set-Cookie",`token=; Max-Age=0; Path=/`)
    res.status(200).json({message:"Logout realizado com sucesso"});
})

app.get("/cadastrar", (req,res) => {
    res.status(200).send(bancoDeDados);
});




app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();


const port = 5000;
const emailTransporter = "luizgrfc12@gmail.com";
const senhaEmail = "So@d4everx1";
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: emailTransporter,
        pass: senhaEmail
    }
})




app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],credentials: true,
    allowedHeaders:["Content-type"]}),
);



const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"loginBd",
    port:"3306"
});


const autenticarToken = async (req, res, next) => {
    
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
    
    const [usuarios] = await db.query("SELECT * FROM USUARIOS WHERE nome = ?", [nome]);
    const encontrado = usuarios[0];
    
    if(!encontrado || !(await bcrypt.compare(senha,encontrado.senha))){
       return res.status(401).send("Usuario ou senha inválidos");
    }

    else{
        const token = jwt.sign({nome: encontrado.nome}, "segredo_seguranca", {expiresIn:"1h"});
        res.setHeader("Set-Cookie", `token=${encodeURIComponent(token)}; Max-Age=3600; HttpOnly; Path=/;`);
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

    try{
        await db.query("INSERT INTO usuarios (nome, senha) VALUES (?,?)", [nome, hashedPassword]);
    
    res.status(200).send("O usuario foi criado com sucesso");
}
catch(error){
    res.status(500).send("Erro ao cadastrar usuario");
}
});

app.post("/logout", (req,res) => {
    res.setHeader("Set-Cookie",`token=; Max-Age=0; Path=/`)
    res.status(200).json({message:"Logout realizado com sucesso"});
})

app.post("/esqueci-minha-senha",async (req,res) => {
    const {email} = req.body;
    try{
        const [usuario] = await db.query("SELECT nome from usuarios where nome = ?",[email]);
        
        if(usuario.length === 0){
            return res.status(400).json({message: "O email não está cadastrado"});
        }
        const usuarioSelecionado = usuario[0];
        await enviarEmail(usuarioSelecionado, "Restauração de senha", `Olá usuário sua senha é 123`);
        res.status(200).send({message: usuarioSelecionado});
    }
    catch(error){
        alert("Esse email não é válido");
    }
})

const enviarEmail = async (destinatario, assunto, mensagem) => {
    try{
        await transporter.sendMail({
        from: destinatario,
        to: destinatario,
        subject:assunto,
        text:mensagem
    })}
    catch(error){
        alert("Erro ao enviar email");
}
}

app.get("/cadastrar", (req,res) => {
    
});


app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});
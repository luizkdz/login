require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());


const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"loginBd",
    port:"3306"
});

const gerarTokens = async (usuarioId) => {
    const accessToken = jwt.sign({usuarioId} , "segredo_seguranca", {expiresIn:"15m"});
    const refreshToken = jwt.sign({usuarioId}, "segredo_seguranca", {expiresIn:"7d"});

    await db.query("INSERT INTO refresh_tokens (usuario_id, token) VALUES (?, ?)" , [usuarioId, refreshToken]);

    return {accessToken, refreshToken};
}



const autenticarToken = async (req, res, next) => {
    
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Token ausente ou inválido" });
    } 
    jwt.verify(token, "segredo_seguranca", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.usuarioId = decoded.usuarioId;
        next();
      });

}

app.get("/paginainicial",autenticarToken, async (req, res) => {
    const [usuarios] = await db.query("SELECT nome FROM usuarios where id = ?",[req.usuarioId]);
    res.status(200).json(usuarios[0].nome);
})
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const encontrado = usuarios[0];

    if (!encontrado || !(await bcrypt.compare(senha, encontrado.senha_hash))) {
        return res.status(401).json({message:"Usuário ou senha inválidos"});
    }

    const { accessToken, refreshToken } = await gerarTokens(encontrado.id);

    res.setHeader("Set-Cookie", `refreshToken=${encodeURIComponent(refreshToken)}; HttpOnly; Max-Age=3600`);
    res.setHeader("Set-Cookie", `usuarioNome= ${encodeURIComponent(encontrado.nome)} HttpOnly; Max-Age=3600`);
    res.json({ accessToken });
});

app.get("/", (req, res) => {
    res.send("Servidor rodando com sucesso!");
});

app.post("/cadastrar", async (req,res) => {
    const {nome, email, senha} = req.body;

    const hashedPassword = await bcrypt.hash(senha,10);

    try{
        await db.query("INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)", [nome,email, hashedPassword]);
    
    res.status(200).send("O usuario foi criado com sucesso");
}
catch(error){
    res.status(500).send("Erro ao cadastrar usuario");
}
});

app.post("/logout", (req,res) => {
    res.setHeader("Set-Cookie","refreshToken=; HttpOnl; Max-Age=0; Path=/")
    res.status(200).json({message:"Logout realizado com sucesso"});
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
app.post("/esqueci-minha-senha",async (req,res) => {
    const {email} = req.body;
    try{
        const [usuario] = await db.query("SELECT nome from usuarios where email = ?",[email]);
        
        if(usuario.length === 0){
            return res.status(400).json({message: "O email não está cadastrado"});
        }
        const usuarioSelecionado = usuario[0];
        await enviarEmail(usuarioSelecionado, "Restauração de senha", `Olá usuário sua senha é 123`);
        res.status(200).send({message: usuarioSelecionado});
    }
    catch(error){
        res.status(400).json({message:"Esse email não é válido"});
    }
})



app.get("/cadastrar", (req,res) => {
    
});


app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();


const port = 5000;
const emailTransporter = "luizgrfc12@gmail.com";
const senhaEmail = "oqbq dgxh xmks wufo";
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
    allowedHeaders:["Content-type","Authorization"]}),
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
    const accessToken = jwt.sign({usuarioId} , "segredo_seguranca", {expiresIn:"1m"});
    const refreshToken = jwt.sign({usuarioId}, "segredo_seguranca", {expiresIn:"7d"});

    await db.query("INSERT INTO refresh_tokens (usuario_id, token) VALUES (?, ?)" , [usuarioId, refreshToken]);

    return {accessToken, refreshToken};
}



const autenticarToken = async (req, res, next) => {
    
    const token = req.cookies.accessToken;
    
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
    if(usuarios.length === 0 ){
        return res.status(404).json({message: "Usuario não encontrado"});
    }
    
    res.status(200).json({nome:usuarios[0].nome});
})
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const encontrado = usuarios[0];

    if (!encontrado || !(await bcrypt.compare(senha, encontrado.senha_hash))) {
        return res.status(401).json({message:"Usuário ou senha inválidos"});
    }

    const { accessToken, refreshToken } = await gerarTokens(encontrado.id);

    res.cookie("accessToken", accessToken,{
        httpOnly:true,
        maxAge: 1 * 60 * 1000,
        
    });
    res.cookie("refreshToken", refreshToken , {
        httpOnly:true,
        maxAge:15 * 60 * 1000 * 4 * 24 * 7,
    })
    
    res.json({ accessToken });
});

app.post("/renovarsessao" , async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
       return res.status(400).json({message:"Token invalido"});
    }

    try{

    const [token] = await db.query("SELECT * from refresh_tokens where token = ?", [refreshToken]);
    
    if(token.length === 0){
        return res.status(400).json({message:"token não existe"});
    }
    const tokenCerto = token[0].token;
    
    try {
        const decoded = jwt.verify(tokenCerto, "segredo_seguranca");
        const newAccessToken = jwt.sign(
            { usuarioId: decoded.usuarioId },
            "segredo_seguranca",
            { expiresIn: "1m" }
        );
        res.cookie("accessToken", newAccessToken,{
            httpOnly:true,
            maxAge: 1 * 60 * 1000,
        })
        res.status(200).json({token:newAccessToken});
    }
    catch(erro){
        return res.status(400).json({message:"Token invalido"})
    
    }
} catch(erro){
    return res.status(500).json({message:"Erro interno do servidor"});
}
})  

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

app.post("/logout", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    res.clearCookie("accessToken", { httpOnly: true });
    db.query("DELETE FROM refresh_tokens where token = ? ", [accessToken]);
    res.status(200).json({ message: "Logout realizado com sucesso!" });
});

const enviarEmail = async (destinatario, assunto, mensagem) => {
    try{
        await transporter.sendMail({
        from: emailTransporter,
        to: destinatario,
        subject:assunto,
        text:mensagem
    })}
    catch(error){
        console.log(error);
}
}

const gerarNovaSenha = (tamanho) => {
    return crypto.randomBytes(tamanho).toString("base64").slice(0,tamanho);
}
app.post("/esqueci-minha-senha",async (req,res) => {
    const {email} = req.body;
    try{
        const [usuarioEmail] = await db.query("SELECT email from usuarios where email = ?",[email]);
        
        if(usuarioEmail.length === 0){
            return res.status(400).json({message: "O email não está cadastrado"});
        }
        const usuarioSelecionado = usuarioEmail[0];
        const novaSenha = gerarNovaSenha(12);
        const novaSenhaComHash = await bcrypt.hash(novaSenha,10);
        await db.query("UPDATE usuarios SET senha_hash = ? where email = ?",[novaSenhaComHash,usuarioSelecionado.email]);
        await enviarEmail(usuarioSelecionado.email, "Restauração de senha", `Olá usuário sua senha é ${novaSenha}`);
        res.status(200).send({message: usuarioSelecionado});
    }
    catch(error){
        res.status(400).json({message:"Esse email não é válido"});
    }
})



app.get("/cadastrar", (req,res) => {
    
});


app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});
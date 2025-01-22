"use client"

import { toast } from "react-toastify";
import "./styles.css";
import { useEffect, useState } from "react";
import { useUser } from "@/Context";

import {auth} from "../../../firebase/index.js"
import { useCreateUserWithEmailAndPassword, useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import Link from "next/link";

export default function NavBar(){

    //context
const {setUserId} = useUser();


//modal
const [openM, setOpenM] = useState(false);
const handleOpenM = () => setOpenM(true);
const handleCloseM = () => setOpenM(false);

const [openMC, setOpenMC] = useState(false);
const handleOpenMC = () => {setOpenMC(true), setOpenM(false)};
const handleCloseMC = () => setOpenMC(false);

// setar conexão
useEffect(() =>{
    const conected = localStorage.getItem('conect')
    const idUser = localStorage.getItem('userId')
    if(idUser){
       setUserId(idUser);
    }
    
    if(conected && conected === 'true'){
      setConect(true);
    }else{
      setConect(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])


  //login 
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [obj, setObj ]= useState("");

  const [conect, setConect] = useState(false);


            // criar conta
 const [
    createUserWithEmailAndPassword,
        user,
        loading,
 ] = useCreateUserWithEmailAndPassword(auth);


 const createCount = async () => {
    if(!senha || !email || !nome || !peso || !altura){
        toast.warning("Porfavor preencha todos os dados")
        return;
    }
    try{

        const userCredential = await createUserWithEmailAndPassword(email, senha);
        if(userCredential){
            const user = userCredential.user;
            const uid = user.uid;
        console.log(uid)
       try{
        const apiUrl = 'https://localhost:7148/WorkoutUser';

        const dados = {
            Id: uid,
            Name: nome,
            Email: email,
            Peso: peso,
            Altura: altura,
            Objetivo: obj
          };

          const response = await fetch(apiUrl, {
            method: 'POST', // Método HTTP
            headers: {
              'Content-Type': 'application/json', // Cabeçalho indicando que o corpo da requisição está em JSON
            },
            body: JSON.stringify(dados), // Converte o objeto para uma string JSON
          });
    
          if (!response.ok) {
            throw new Error('Erro ao enviar os dados: ' + response.statusText);
          }
    
          const responseData = await response.json();
          console.log('Dados enviados com sucesso:', responseData);
          setNome("")
          setEmail("")
          setSenha("")
          toast.success("Usuario foi criado com sucesso")
          setConect(true)
          localStorage.setItem('conect', 'true');
          localStorage.setItem('userId', uid);
          
       }catch(err){
        toast.error("Erro na criação da conta")
        console.log(err)
       }
        }else{
            toast.error("Erro na criação da conta")
        }

    }catch(error){
        toast.error("Usuario já existe ou tivemos um erro na criação");
        console.log(error)
    }
}

 // desconectar 

 const desconect = async()=>{
    
    localStorage.removeItem('conect');
    localStorage.removeItem('userId'); 
    setUserId('')
    setConect(false);
    window.location.reload();
  }


// trocar senha 
const actionCodeSettings = {
    url: 'http://localhost:3000/',
  };

const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

// login

const [
    signInWithEmailAndPassword,
    userr,
    loadingg,
  ] = useSignInWithEmailAndPassword(auth);

const login = async () => {
    if(!senha || !email){
     toast.warning("Porfavor preencha todos os dados")
     return;
    }
    try{
 
   const userCredential = await signInWithEmailAndPassword(email, senha);

   if(userCredential){
    const user = userCredential.user;
    const uid = user.uid;
    console.log(uid)
    localStorage.setItem('conect', 'true');
     setConect(true);
     toast.success("Usuario conectado com sucesso")
     localStorage.setItem('userId', uid);     
     setUserId(uid);
     setOpenM(false);

    }else{
      toast.error("Usuario não existe ou tivemos um erro no login")
    }
    }catch{
      toast.error("Usuario não existe ou tivemos um erro no login")
    }
  };

    return(
        <div className="navBar">
                       {conect?(
          <>
          <Link href={"../../User"} >
          <PersonOutlineIcon />
          </Link>
          <LogoutIcon  onClick={desconect}/>
          </>
        ):(
          <>
          <PersonOutlineIcon  onClick={handleOpenM}/>
          </>
        )}

          <Modal
        open={openM}
        onClose={handleCloseM}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box className='Modal' >
        <input type="text" placeholder='email' onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder='senha' onChange={e => setSenha(e.target.value)}/>
        <button onClick={login}>Conectar</button>
        <h3
         onClick={async () => {
          const success = await sendPasswordResetEmail(
            email,
            actionCodeSettings
          );
          if (success) {
            toast.warning('Email enviado');
          }else{
            toast.warning('Email errado ou conta inexistente')
          }
        }} style={{cursor:"pointer"}}>Esqueci a senha </h3>

        <h3 onClick={handleOpenMC}>Criar conta</h3>
     </Box>
      </Modal>

      <Modal
        open={openMC}
        onClose={handleCloseMC}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box className='Modal' >

        <input type="text" 
        placeholder='email' 
        value={email}
        onChange={e => setEmail(e.target.value)}/>

        <input 
        type="password" 
        placeholder='senha'
        value={senha}
        onChange={e => setSenha(e.target.value)} />

       <input 
        type="text" 
        placeholder='Nome'
        value={nome}
        onChange={e => setNome(e.target.value)}/>

        <input 
        type="text"
        placeholder="Objetivo"
        value={obj}
        onChange={e => setObj(e.target.value)}
        />

       <input 
        type="number"
        placeholder="peso em Kg"
        onChange={e => setPeso(Number(e.target.value))}
        />        

       <input 
        type="number"
        placeholder="altura"
        onChange={e => setAltura(Number(e.target.value))}
        />   

        <button onClick={createCount}>Criar conta</button>
     </Box>
      </Modal>
        </div>
    )
}
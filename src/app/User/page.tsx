"use client"

import Image from "next/image";
import peso from "../assets/balanca.png"
import altura from "../assets/altura.png"
import imc from "../assets/imc.png"

import braco from "../assets/body-building.png"
import pessoas from "../assets/pessoas.png"

import pesoA from "../assets/academia.png";


import "./styles.css"
import { useUser } from "@/Context";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { toast } from "react-toastify";

import Link from "next/link";



interface Exercise{
  count: number;
  desc: string;
  equipment: string;
  id: number;
  image: string;
  muscle: string;
  name: string;
  userId: string;
  video: string;
}

interface ExerciseUser{
  desc: string;
  exercise: Exercise;
  exerciseId: number;
  id: number;
  load: string;
  rep: number;
  series: number;
  traningId: number;
}

interface Training {
  count : number;
  description: string;
  exerciseUsers: ExerciseUser[];
  firstId: number;
  id: number;
  name: string;
  userId: string;
}

interface User{
  id: string;
  email: string;
  name: string;
  peso: number;
  altura: number;
  imc: number;
  objetivo: string;
  exercises: Exercise[];
  workouts: Training[];
}
export default function User (){

   const {userId} = useUser();

   const [user, setUser] = useState<User>();

   const [load, setLoad] =useState(0);

   useEffect(()=>{
    if (typeof window === "undefined") return;

     if (userId){

        const getUser = async()=>{
          const apiurl = `https://localhost:7148/WorkoutUser/${userId}`
          await fetch(apiurl).then( response => response.json())
          .then(data =>{
           setUser(data);
           console.log(data);
           })
       

        }      

        getUser();

     }

   },[userId, load]);


    //modal
     const [openMT, setOpenMT] = useState(false);
     const handleOpenMT = () => setOpenMT(true);
     const handleCloseMT = () => setOpenMT(false);

     const [name, setName] = useState("");
     const [desc, setDesc] = useState("");

    const CriarTreino = async ()=>{

        if(!name){
          toast.warning("Coloque um nome");
          return;
        }
        try{

          const apiurl = "https://localhost:7148/WorkoutTraining";
          const dados={
           userId: userId,
           name: name,
           description: desc
          };

          const response = await fetch(apiurl,{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
          });

          if (!response.ok) {
            throw new Error('Erro ao enviar os dados: ' + response.statusText);
          }

          toast.success("Treino criado com sucesso");
          handleCloseMT();
          setLoad(load + 1);
        }catch{

        }
    };


        //modal
        const [openME, setOpenME] = useState(false);
        const handleOpenME = () => setOpenME(true);
        const handleCloseME = () => setOpenME(false);

        const [nomeE, setNomeE] = useState("");
        const [descE, setDescE] = useState("");
        const [musculo, setMusculo] = useState("");
        const [equipamento, setEquipamento] = useState("");

        const [base64, setBase64] = useState("");

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setBase64(reader.result as string);
          }
        };

        const [video, setVideo] = useState<File | null>(null);

        const handleFileChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.files) {
            setVideo(event.target.files[0]);
          }
        };


        const CriarExercicio = async()=>{
          try{
             if(!nomeE || !descE || !musculo || !userId) {
              toast.warning("Preencha os dados nescessarios")
             }
            const api = "https://localhost:7148/WorkoutExercise";
            const dados = {
              Name: nomeE,
              Muscle: musculo,
              Desc: descE,
              UserId: userId,
              Equipment: equipamento,
              Image: base64
            }
          
            const response = await fetch(api,{
              method: "POST",
              headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify(dados)
            })
    
            if (!response.ok) {
              throw new Error('Erro ao enviar os dados: ' + response.statusText);
            }

            const responseData = await response.json();
            const exerciseId = responseData.id;
            toast.success("Exercicio criado com sucesso")
            console.log(responseData)
            console.log("Id do exercicio: ",exerciseId);

            if (video){    
              
              const api = `https://localhost:7148/WorkoutExercise/${exerciseId}/video`

              const formData = new FormData();
              formData.append("videoFile", video);
             try{

              const videoResponse = await fetch(api, {
                method: "POST",
                body: formData,
              });
              
      if (!videoResponse.ok) {
        throw new Error("Erro ao enviar vídeo: " + videoResponse.statusText);
      }

           toast.success("Video enviado com sucesso");    
           setBase64("");
           setDescE("");
           setMusculo("");
           setEquipamento("");
           setNomeE("");
           handleCloseME()
           setLoad(load + 1);

             }catch(err){
              toast.error("Erro ao enviar video")
              console.log(err)
             }

            }else{
              setNomeE("");
              setBase64("");
              setDescE("");
              setMusculo("");
              setEquipamento("");
              handleCloseME()
              setLoad(load + 1);

            }

            
          }catch(err){
            toast.error("Erro ao criar exercicio")
            console.log(err)
          }

        }



    return(
        <div className="User">
          {userId ?(<>
            <div className="UserContent">
            <h1>{user?.name}</h1>

            <div className="containerImageText">
            <div className="imageText">
            <Image src={peso} alt="peso" className="ImagesContet"/>
            <p>{user?.peso} kg</p>
            </div>

            <div className="imageText">
            <Image src={altura} alt="altura" className="ImagesContet"/>
            <p>{user?.altura}</p>
            </div>

            <div className="imageText">
            <Image src={imc} alt="osik" className="ImagesContet" />
            <p>peso ideal</p>
            </div>

           </div>

            </div>
        
          <div>
            <div className="Buttons">

          <button onClick={handleOpenMT}>
            <span className="button_top">
              Criar Treino
            </span>
          </button>

          <button onClick={handleOpenME}>
            <span className="button_top">
              Criar Exercicio
            </span>
          </button>

          </div>
          </div>
          <div>
            
          <Modal
        open={openME}
        onClose={handleCloseME}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box className='Modal' >
      <input type="text" placeholder="Nome do Exercicio" 
             value={nomeE} onChange={e=> setNomeE(e.target.value)}/>

      <input type="text" placeholder="Musculo" 
             value={musculo} onChange={e=> setMusculo(e.target.value)}/>

      <input type="text" placeholder="Equipamento" 
             value={equipamento} onChange={e=> setEquipamento(e.target.value)}/>

      <textarea  placeholder="Descrição"
                 value={descE} onChange={e=> setDescE(e.target.value)}/>
      <p>Imagem opcional</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br/>
      <p>Video opcional</p>
      <input type="file" accept="video/*" onChange={handleFileChangeVideo} />
      <br/>
      <button onClick={CriarExercicio}>
      Criar exercicio 
      </button>  
     </Box>

      </Modal>
       
          <Modal
        open={openMT}
        onClose={handleCloseMT}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box className='Modal' >
      <input type="text" placeholder="Nome do treino" 
             value={nomeE} onChange={e=> setName(e.target.value)}/>
      <input type="text" placeholder="Descrição"
             value={desc} onChange={e=> setDesc(e.target.value)}/>
      <br/>
      <button onClick={CriarTreino}>
      Criar treino 
      </button>  
     </Box>

      </Modal>
      {user?.workouts && user?.workouts.length < 0 ?(
        <h1 style={{fontSize:"30px", color:"#FFFF"}}>Ainda sem treinos cadastrados</h1>
      ):(<>
          <h1 style={{fontSize:"30px", color:"#FFFF"}}>Meus treinos</h1>

        {user?.workouts?.map(workout =>(
         <div className="work" key={workout.id}>

            <h2>{workout.name}</h2>

            <div className="workContent">

              <div className="imageText">
                <Image src={pesoA} alt="Peso de academia" className="workImage" />
                <p>{workout.exerciseUsers.length} exercicios</p>
              </div>

              <div className="imageText">
                <Image src={pessoas} alt="academia" className="workImage" />
                <p> {workout.count} ultilizam</p>
              </div>
            </div>
           </div>
          ))}
 </>) }

 { user?.exercises && user?.exercises.length < 0 ?(
        <h1 style={{fontSize:"30px", color:"#FFFF"}}>Ainda sem Exercicios cadastrados</h1>
      ):(<>
          <h1 style={{fontSize:"30px", color:"#FFFF"}}>Meus Exercicios</h1>
          
          {user?.exercises?.map(exer =>(
        <Link href={`/exercise/${exer.id}`}>
         <div className="work" key={exer.id}>

            <h2>{exer.name}</h2>

            <div className="workContent">

              <div className="imageText">
                <Image src={braco} alt="Peso de academia" className="workImage" />
                <p>{exer.muscle}</p>
              </div>

              <div className="imageText">
                <Image src={pessoas} alt="academia" className="workImage" />
                <p> {exer.count} ultilizam</p>
              </div>
            </div>
           </div>
           </Link>
             ))}
 </>) }
</div>
</>):(
 
 <h1 style={{fontSize:"30px", color:"#FFFF"}} >Nenhuma conta encontrada</h1>
)} 
          </div>

    )
}
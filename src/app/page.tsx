'use client'

import Link from "next/link";
import "./styles.css"

import peso from "./assets/academia.png";
import pessoas from "./assets/pessoas.png";
import braço from "./assets/body-building.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@/Context";

import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";


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

export default function Home() {
  
  const [metod, setMetod] = useState("treino");
  const [searchM, setSearch] = useState("");

  const [training , setTraining] = useState<Training[]>([]);
  const [exercise, setExercise] = useState<Exercise[]>([]);

  const [trainingS , setTrainingS] = useState<Training[]>([]);
  const [exerciseS, setExerciseS] = useState<Exercise[]>([]);
  
  const [trainingU , setTrainingU] = useState<Training[]>([]);
  const [atl, setAtl] =useState(0);

  const {userId} = useUser();
  


 useEffect(()=>{
  
  const metods = async ()=>{
    try{
      const url = "https://localhost:7148/WorkoutTraining/better";
       const response = await fetch(url).then( response => response.json())
       .then(data =>{
        setTraining(data);
        console.log(data);
        })
      }catch(err){
        console.log("1", err)
      }
    
      try{
      const url2 = "https://localhost:7148/WorkoutExercise/better";
      const response2 = await fetch(url2).then( response => response.json())
      .then(data =>{
       setExercise(data);
       console.log(data);
       })
      }catch(err){
        console.log("2", err)
      }
  
  }

   metods();

 },[]);

 useEffect(()=>{

  if(searchM !== ""){
      const search = async ()=>{

         if(metod === "treino"){
            
          await fetch(`https://localhost:7148/WorkoutTraining/name/${searchM}`).then( response => response.json())
          .then(data =>{
            setTrainingS(data);
             })
         }else{
          await fetch(`https://localhost:7148/WorkoutExercise/name/${searchM}`).then( response => response.json())
          .then(data =>{
            setExerciseS(data);
             })
         }        
        
        }
        search()
     }else{
      setTrainingS([]);
      setExerciseS([]);
     }
 },[searchM])

 useEffect(()=>{

   if(userId) {
    try{
    const getTrainingByUser = async()=>{
        const apiurl = `https://localhost:7148/WorkoutTraining/user/${userId}`
        const response = await fetch(apiurl).then(response => response.json())
        .then(data =>{
        setTrainingU(data);
        })
    };
    getTrainingByUser();
  }catch(err){
    console.log(err)
  }
  }

 },[userId, atl]);


  const addTraining = async (id: number) =>{
     if(!userId) {
       toast.warning("Se conect para isso")
       return;}
     if(trainingU.some(trai => trai.firstId == id)){
       toast.warning("Você já adicionou esse treino")
       return;} 
 
     const apiUrl = `https://localhost:7148/WorkoutTraining/user/${userId}/training/${id} `;
     
     const response = await fetch(apiUrl,{
       method:"POST",
       headers: {
         'Content-Type': 'application/json', 
       }
     })
      
     if (!response.ok) {
       toast.error("Erro ao adicionar Treino");
       console.log(response.statusText);
   }
 
   toast.success("Treino adicionado com sucesso");
   setAtl(atl + 1);
     
   }

   const [idEx, setIdEx]= useState(0);

   const [openM, setOpenM] = useState(false);
   const handleOpenM = (idEx: number) => {setOpenM(true); setIdEx(idEx);}
   const handleCloseM = () => setOpenM(false);

   const addExercicio = async (idT:number) =>{
      const dados ={
       Load : "0",
       Rep: 0,
       Series:0,
       ExerciseId: idEx,
       desc:"",
       TrainingId: idT
      };

      const apiUrl = "https://localhost:7148/WorkoutExerciseUser";

     const response = await fetch(apiUrl,{
       method: "POST",
       headers: {
         'Content-Type': 'application/json', 
       },
       body: JSON.stringify(dados)
     })

     if (!response.ok) {
         toast.error("Erro ao adicionar exercicio");
         console.log(response.statusText);
     }

     toast.success("Exercicio adicionado com sucesso");
     setAtl(atl + 1);
     handleCloseM();

   }
 

  return (
    <div className="Home">
        <Modal
          open={openM}
          onClose={handleCloseM}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='ModalH' >
            {training.length > 0 ? (
              <div>
                {trainingU.map(trai => {

                  const isExerciseIdMatch = trai.exerciseUsers.some(exe => exe.exerciseId == idEx);

                  return (
                    <div key={trai.id} className="AddExer">
                      <p>{trai.name}</p>
                      <button
                        style={{ backgroundColor: isExerciseIdMatch ? 'gray' : '#1A1A1A' }}
                        disabled={isExerciseIdMatch}
                        onClick={() => addExercicio(trai.id)}>Adicionar exercício</button>
                    </div>
                  );
                })}
              </div>
            ) : <h1>Ainda sem treinos cadastrados</h1>}

          </Box>
        </Modal>

      <h1>Workout</h1>
      <div className="Search">
        <p>Pesquisar por {metod}</p>
        <input type="text" onChange={e => setSearch(e.target.value)} value={searchM} />
        <br />
        <div className="Buttons">
          <button onClick={E=> setMetod("treino")}>
            <span className="button_top">
              Treino
            </span>
          </button>
          <button onClick={e=> setMetod("exercicio")}>
            <span className="button_top">
              Exercicio
            </span>
          </button>
        </div>

      </div>

    {trainingS.length > 0 || exerciseS.length > 0 ?(
    <>
    
    {trainingS.length > 0 ?(
<>
{trainingS.map(training => {
  const count =training.exerciseUsers.length;
  return(
  <div className="work" key={training.id}>
    {training?.userId == userId ? <></>:<AddIcon onClick={e=> addTraining(training.id)} fontSize="large" className="Add"/>}
     <Link href={`workout/${training.id}`}>
    <h2>{training.name}</h2>

    <div className="workContent">

      <div className="imageText">
        <Image src={peso} alt="Peso de academia" className="workImage" />
        <p>{count} exercicios</p>
      </div>

      <div className="imageText">
        <Image src={pessoas} alt="academia" className="workImage" />
        <p>{training.count} ultilizam</p>
      </div>
    </div> 
    </Link>
    </div>
    )})}  
    </>
    ):(
      <>
      {exerciseS.map(exercise=>(
          <div className="work" key={exercise.id}>
          {userId ? <AddIcon onClick={e=> handleOpenM(exercise.id)} fontSize="large" /> : <></>}
          <Link href={`exercise/${exercise.id}`}>
            <h2>{exercise.name}</h2>

            <div className="workContent">

              <div className="imageText">
                <Image src={braço} alt="Peso de academia" className="workImage" />
                <p>{exercise.muscle}</p>
              </div>

              <div className="imageText">
                <Image src={pessoas} alt="academia" className="workImage" />
                <p> {exercise.count} ultilizam</p>
              </div>
            </div>
          </Link>
          </div>
          ))}
      </>
    )}
    
    </>):(

      <div className="Workout">
        <h2>Treinos mais utilizados</h2>
        <div>

         {training.map(training => {
          const count =training.exerciseUsers.length;
          return(
          <div className="work" key={training.id}>
          {training?.userId == userId ? <></>:<AddIcon onClick={e=> addTraining(training.id)} fontSize="large" className="Add"/>}

            <Link href={`workout/${training.id}`}>
            <h2>{training.name}</h2>

            <div className="workContent">

              <div className="imageText">
                <Image src={peso} alt="Peso de academia" className="workImage" />
                <p>{count} exercicios</p>
              </div>

              <div className="imageText">
                <Image src={pessoas} alt="academia" className="workImage" />
                <p>{training.count} ultilizam</p>
              </div>
            </div>
            </Link>
          </div>
            )})}
        </div>

        <h2>Exercicios mais utilizados</h2>
        <div>

          {exercise.map(exercise=>(
          <div className="work" key={exercise.id}>
            {userId ? <AddIcon onClick={e=> handleOpenM(exercise.id)} fontSize="large" className="Add" /> : <></>}
           <Link href={`exercise/${exercise.id}`}>
            <h2>{exercise.name}</h2>

            <div className="workContent">

              <div className="imageText">
                <Image src={braço} alt="Peso de academia" className="workImage" />
                <p>{exercise.muscle}</p>
              </div>

              <div className="imageText">
                <Image src={pessoas} alt="academia" className="workImage" />
                <p> {exercise.count} ultilizam</p>
              </div>
            </div>
            </Link>
          </div>
          ))}
        </div>
      </div>
    ) }
    </div>
  );
}

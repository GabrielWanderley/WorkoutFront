"use client"

import Image from "next/image";
import sla from "../../assets/academia.png"

import "./stylesWork.css"
import { use, useEffect, useState } from "react";
import { useUser } from "@/Context";
import Link from "next/link";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";
import { useRouter } from 'next/navigation';


type props ={
  params: Promise<{ id: number }>;
}


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

interface Training {
  count : number;
  description: string;
  exerciseUsers: ExerciseUser[];
  firstId: number;
  id: number;
  name: string;
  userId: string;
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

export default function Workout ({ params }:props){

    const resolvedParams = use(params); 
    const { id } = resolvedParams;

    const {userId} = useUser();
    
    const [training, setTraining] = useState<Training>();

    const [userTraining, setUserTraining] = useState<Training[]>([]);
    
    const [atl, setAtl] = useState(0);

    const router = useRouter();
    

  useEffect(()=>{
    
    const getTraining = async () =>{

      const apiUrl = `https://localhost:7148/WorkoutTraining/${id}`;

       await fetch(apiUrl).then(response => response.json())
       .then(data=>{setTraining(data)});
      
    }

    if(userId){
      const getTrainingByUser = async()=>{
        const apiurl = `https://localhost:7148/WorkoutTraining/user/${userId}`
        await fetch(apiurl).then(response => response.json())
        .then(data =>{
        setUserTraining(data);
        })
    };
    getTrainingByUser();
    }

    getTraining();

  },[id, userId, atl]);


  const addTraining = async () =>{
    if(!userId) {
      toast.warning("Se conect para isso")
      return;}
    if(userTraining.some(trai => trai.firstId == id)){
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

  const [openMET, setOpenMET] = useState(false);
  const handleOpenMET = () => setOpenMET(true);
  const handleCloseMET = () => setOpenMET(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() =>{
    if(training){
    setDesc(training?.description)
    setName(training?.name)
  }
  },[training])

  const editTraining = async () =>{
      try{
       
        if(!desc && !name){
        toast.warning("Preencha todos os dados")
        return;
       }

       const apiUrl = `https://localhost:7148/WorkoutTraining/${id}`

       const dados ={
        Name : name,
        Description: desc
       }

       const response = await fetch(apiUrl,{
        method: "PUT",       
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(dados)
       });

    if (!response.ok) {
        toast.error("Erro ao alterar treino");
        console.log(response.statusText);
        handleCloseMET();
        return;
    }
  
    toast.success("Treino alterado com sucesso");
    setAtl(atl + 1);
    handleCloseMET();

      }catch(err){
        toast.error("Erro ao editar treino")
      }
  }


  const [openMDT, setOpenMDT] = useState(false);
  const handleOpenMDT = () => setOpenMDT(true);
  const handleCloseMDT = () => setOpenMDT(false);

  const deleteTraining = async ()=>{
     const apiUrl = `https://localhost:7148/WorkoutTraining/${id}`

     const response = await fetch(apiUrl,{
      method: "DELETE"
     });

     if (!response.ok) {
      toast.error("Erro ao deletar treino");
      console.log(response.statusText);
      handleCloseMDT();
      return;
  }

  toast.success("Deletado com sucesso");
  handleCloseMDT();
  router.push('/');


  }


  const [openMDE, setOpenMDE] = useState(false);
  const [exerUserId, setExerUserId] = useState(0);

  const handleOpenMDE = (id:number) => {setOpenMDE(true); setExerUserId(id); };
  const handleCloseMDE = () => setOpenMDE(false);

  const deleteExerciseUser = async ( )=>{

    const apiUrl = `https://localhost:7148/WorkoutExerciseUser/${exerUserId}`;
    const response = await fetch(apiUrl,{
      method: "DELETE"
    })  

    if (!response.ok) {
      toast.error("Erro ao deletar Exercicio");
      console.log(response.statusText);
      handleCloseMDE();
      return;
    }
    
    toast.success("Deletado com sucesso");
    setAtl(atl + 1);
    handleCloseMDE();

  }

  const [openMEE, setOpenMEE] = useState(false);
  const handleOpenMEE = (id:number) => {setOpenMEE(true); setExerUserId(id);};
  const handleCloseMEE = () => setOpenMEE(false);

  const [carga, setCarga]=useState("");
  const [rep, setRep] = useState(0);
  const [series, setSeries] = useState(0);
  const [descE, setDescE] = useState("");

  useEffect(() => {

    if(exerUserId > 0){
    const getExercicioUser = async ()=>{
    const apiUrl = `https://localhost:7148/WorkoutExerciseUser/${exerUserId}`;
    await fetch(apiUrl).then( response => response.json())
    .then(data =>{
     setCarga(data.load);
     setRep(data.rep);
     setSeries(data.series);
     setDescE(data.desc);
     })
  }
  getExercicioUser()
}
  },[exerUserId])

const editeExercicioUser = async ()=>{
  const dados ={
    Load : carga,
    Rep: rep,
    Series: series,
    desc: descE,
   };

   const apiUrl = `https://localhost:7148/WorkoutExerciseUser/${exerUserId}`;

  const response = await fetch(apiUrl,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(dados)
  })

  if (!response.ok) {
      toast.error("Erro ao editar exercicio");
      console.log(response.statusText);
  }

  toast.success("Exercicio editado com sucesso");
  setAtl(atl + 1);
  handleCloseMEE();
};

const [openMAE, setOpenMAE] = useState(false);
const handleOpenMAE = () => setOpenMAE(true);
const handleCloseMAE = () => setOpenMAE(false);

const addExercicio = async (idE : number ) =>{
  const dados ={
   Load : "0",
   Rep: 0,
   Series:0,
   ExerciseId: id,
   desc:"",
   TrainingId: idE
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
 handleCloseMAE();

}

    return(
        <div>

       <Modal
          open={openMET}
          onClose={handleCloseMET}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
          <h1>Editar treino</h1>
          <input type="text" value={name} onChange={e=> setName(e.target.value)}/>
          <textarea placeholder="Descrição" value={desc} onChange={e=> setDesc(e.target.value)}/>
          <button onClick={editTraining}>Enviar</button>
          </Box>
        </Modal>

        <Modal
          open={openMDT}
          onClose={handleCloseMDT}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
          <h1>Tem certeza que quer deletar o treino ? </h1>
          <button onClick={deleteTraining}>Sim</button>
          </Box>
        </Modal>

        <Modal
          open={openMDE}
          onClose={handleCloseMDE}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
          <h1>Tem certeza que quer retirar o exercicio ?</h1>
          <button onClick={E=> deleteExerciseUser()}>Sim</button>
          </Box>
        </Modal>

        <Modal
          open={openMEE}
          onClose={handleCloseMEE}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
          <h1>Editar exercicio</h1>
          <p>Carga</p>
          <input type="text" value={carga} onChange={e=> setCarga(e.target.value)}/>
          <p>Repetições</p>
          <input type="number" value={rep} onChange={e=> setRep(Number(e.target.value))}/>
          <p>Series</p>
          <input type="number" value={series} onChange={e=> setSeries(Number(e.target.value))}/>
          <textarea value={descE} onChange={e=> setDescE(e.target.value)}/>
          <button onClick={E=> editeExercicioUser()}>Enviar</button>
          </Box>
        </Modal>


        <Modal
          open={openMAE}
          onClose={handleCloseMAE}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
            {userTraining.length > 0 ? (
              <div>
                {userTraining.map(trai => {

                  const isExerciseIdMatch = trai.exerciseUsers.some(exe => exe.exerciseId == id);

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

            <div className="WorkoutContent">
              <div>
              
                {training?.userId == userId ? <></>:<AddIcon onClick={addTraining} fontSize="large" />}
                {training?.userId == userId ? 
                <>
                  <DeleteIcon fontSize="large" onClick={handleOpenMDT} />
                  <EditIcon fontSize="large" onClick={handleOpenMET} />
                </>:<></>}
              </div>
               <h1>{training?.name}</h1>

               <div className="works">
                
                {training && training?.exerciseUsers.length > 0 ?(
                  <>
                  {training.userId === userId ?(
                  <>
                  {training.exerciseUsers.map(exer =>{
                    const name = exer.exercise.name
                    return(
                 <div className="workW" key={exer.id}>
                {training?.userId == userId ? 
                <>
                  <DeleteIcon fontSize="large" onClick={e=>handleOpenMDE(exer.id)} />
                  <EditIcon fontSize="large" onClick={e=>handleOpenMEE(exer.id)} />
                </>:<></>}
                   <h2>{name}</h2>
                   <div className="workContent">
                   <h3>Repetições  <span>{exer.rep}</span></h3>
                   <h3>Series       <span>{exer.series}</span></h3>
                   <h3>Peso        <span>{exer.load}</span></h3>     
                   <p>{exer.desc}</p>               
                   </div>

                   <Link href={`../exercise/${exer.exerciseId}`}>
                   <p>Ver mais sobre o exercicio</p>
                   </Link>
                 </div>
                )})}
                 </>
                 ):(<>
                 {training.exerciseUsers.map(exer =>{
                  
                  const name = exer.exercise.name;
                  const desc = exer.exercise.muscle;
                  const muscle = exer.exercise.muscle;
                  const count = exer.exercise.count;

                  return(
                      <div className="work" key={exer.id}>
                        {userId ? <AddIcon onClick={handleOpenMAE} fontSize="large" /> : <></>}
                         <h2>{name}</h2>
                         <div className="workContent">
                           <h3>{muscle}</h3>
                           <h3>{count}</h3>
                           <p>{desc}</p>
                         </div>
                  <Link href={`../exercise/${exer.exerciseId}`}>
                   <p>Ver mais sobre o exercicio</p>
                   </Link>
                      </div>
                 )})}
                 
                 </>)}
                 </>
                ):(<h1>Ainda sem exercicios cadastrados</h1>)}
               </div>
            </div>
        </div>
    )
}
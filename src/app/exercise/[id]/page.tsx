"use client"


import Image from "next/image";
import imagem from "../../assets/balanca.png"

import "./styles.css"
import { use, useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from "@/Context";

import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { toast } from "react-toastify";
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
  

export default function Exercise({ params }: props){

    const resolvedParams = use(params); 
    const { id } = resolvedParams;

    const {userId} = useUser();
     
    const [atl, setAtl] = useState(0);
  
    const [exercise, setExercise] = useState<Exercise>();
    const [training, setTraining] = useState<Training[]>([]);

    const router = useRouter();

    const [nome, setNome] = useState("");
    const [desc, setDesc] = useState("");
    const [musculo, setMusculo] = useState("");
    const [equipamento, setEquipamento] = useState("");
    const [videoUrl, setVideoUrl] = useState(""); 
    const [imageUrl, setImageUrl] = useState("");


    useEffect(()=>{

        const getExercise = async()=>{
            const apiurl = `https://localhost:7148/WorkoutExercise/${id}`
            await fetch(apiurl).then( response => response.json())
            .then(data =>{
             setExercise(data);
             })
        };

        if(userId) {
        const getTrainingByUser = async()=>{
            const apiurl = `https://localhost:7148/WorkoutTraining/user/${userId}`
            await fetch(apiurl).then(response => response.json())
            .then(data =>{
            setTraining(data);
            })
        };
        getTrainingByUser();
      }
        getExercise();
    },[id, userId, atl]);


    const [openM, setOpenM] = useState(false);
    const handleOpenM = () => setOpenM(true);
    const handleCloseM = () => setOpenM(false);

    const addExercicio = async (idT : number ) =>{
       const dados ={
        Load : "0",
        Rep: 0,
        Series:0,
        ExerciseId: id,
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

    const [openMD, setOpenMD] = useState(false);
    const handleOpenMD = () => setOpenMD(true);
    const handleCloseMD = () => setOpenMD(false);

  const deletarExercicio = async() =>{
    if(exercise?.userId === userId){
     
      const apiUrl = `https://localhost:7148/WorkoutExercise/${id}`

      const response = await fetch(apiUrl,{
        method: 'DELETE'
      })

      if (!response.ok) {
        toast.error("Erro ao deletar exercicio");
        console.log(response.statusText);
    }

    toast.success("Exercicio deletado com sucesso");
    router.push('/');


    }else{
      toast.warning("Esse exercicio não é seu")
    }
  }


useEffect(() =>{
            if(exercise){
              setNome(exercise.name);
              setDesc(exercise.desc);
              setMusculo(exercise.muscle);
              setEquipamento(exercise?.equipment);
              setVideoUrl(exercise?.video);
              setImageUrl(exercise?.image);
            }
},[exercise]);


  const [openME, setOpenME] = useState(false);
  const handleOpenME = () => setOpenME(true);
  const handleCloseME = () => setOpenME(false);


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

  const editarExercicio = async ()=>{
    try{
      if(!nome || !desc || !musculo || !userId) {
        toast.warning("Preencha os dados nescessarios")
       }

       const apiUrl= `https://localhost:7148/WorkoutExercise/${id}`;

       const dados ={
        Name: nome,
        Muscle: musculo,
        Desc: desc,
        Equipment: equipamento,
        Image: imageUrl,
        Video: videoUrl
       }

       const response = await fetch(apiUrl,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(dados)
       })
         
       if (!response.ok) {
        toast.error("Erro ao deletar exercicio");
        console.log(response.statusText);
    }
    

      toast.success("Exercicio editado com sucesso");


    if(base64){
      const apiUrl= `https://localhost:7148/WorkoutExercise/${id}/image`;
      const imageResponse = await fetch(apiUrl,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64: base64 }),
      })

      if (imageResponse.ok) {
        toast.success('Imagem enviada com sucesso');
      } else {
        toast.error('Erro ao enviar a imagem');
      }
    }

    if(video){

      const api = `https://localhost:7148/WorkoutExercise/${id}/video`

      const formData = new FormData();
      formData.append("videoFile", video);
     
      const videoResponse = await fetch(api, {
        method: "POST",
        body: formData,
      });
   
      if(videoResponse.ok) {
        toast.success('Video enviado com sucesso');
        handleCloseME();
        setAtl(atl + 1);
      }else{
        toast.error('Erro ao enviar a video');
      }
      

    }else{
      handleCloseME();
      setAtl(atl + 1);
    }

    }catch(err){
      console.log(err);
      toast.error("Erro ao editar exercicio");
    }
  }

    return(
    <div>
      <div className="exercise">

        <div>
          {userId ? <AddIcon onClick={handleOpenM} fontSize="large" /> : <></>}
          {userId === exercise?.userId ? (
            <>
              <DeleteIcon fontSize="large" onClick={handleOpenMD} />
              <EditIcon fontSize="large" onClick={handleOpenME} />
            </>
          ) : <></>}
        </div>

        <Modal
          open={openM}
          onClose={handleCloseM}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
            {training.length > 0 ? (
              <div>
                {training.map(trai => {

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

        <Modal
          open={openMD}
          onClose={handleCloseMD}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
            <h1>Tem certeza que deseja deletar</h1>
            <button onClick={deletarExercicio}>Deletar</button>
          </Box>
        </Modal>


        <Modal
          open={openME}
          onClose={handleCloseME}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='Modal' >
            <h1>Alterar exercicio</h1>
            <input type="text" placeholder="Nome do Exercicio"
              value={nome} onChange={e => setNome(e.target.value)} />

            <input type="text" placeholder="Musculo"
              value={musculo} onChange={e => setMusculo(e.target.value)} />

            <input type="text" placeholder="Equipamento"
              value={equipamento} onChange={e => setEquipamento(e.target.value)} />

            <textarea placeholder="Descrição"
              value={desc} onChange={e => setDesc(e.target.value)} />
            <p>Imagem opcional</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <p>Video opcional</p>
            <input type="file" accept="video/*" onChange={handleFileChangeVideo} />
            <br />
            <button onClick={editarExercicio}>
              Editar exercicio
            </button>
          </Box>
        </Modal>

        <h1>{exercise?.name}</h1>
        {exercise?.image ? <Image className="image" src={exercise?.image} alt="" width={400} height={300} style={{ width: "400px", height: "300px" }} /> : (<></>)}

        {exercise?.video ?
          <video width="600" height="400" controls className="image">
            <source src={exercise.video} type="video/mp4" />
            <source src={exercise.video} type="video/ogg" />
            Seu navegador não suporta a tag de vídeo.
          </video>
          : <></>}

        <h3>Musculo: <span>{exercise?.muscle}</span></h3>
        <h3>Equipamento: <span>{exercise?.equipment}</span></h3>

        <h2>Descrição</h2>
        <div className="exerciseText">
          <p>{exercise?.desc}</p>
        </div>

      </div>
    </div>
  )
}
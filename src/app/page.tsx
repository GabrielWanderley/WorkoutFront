'use client'

import Link from "next/link";
import "./styles.css"

import peso from "./assets/academia.png";
import pessoas from "./assets/pessoas.png";
import braço from "./assets/body-building.png";
import Image from "next/image";
import { useEffect, useState } from "react";

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


 useEffect(()=>{
  if (typeof window === "undefined") return;
  const metods = async ()=>{
    
    
      const url = "https://localhost:7148/WorkoutTraining/better";
       await fetch(url).then( response => response.json())
       .then(data =>{
        setTraining(data);
        console.log(data);
        })
    
      const url2 = "https://localhost:7148/WorkoutExercise/better";
      await fetch(url2).then( response => response.json())
      .then(data =>{
       setExercise(data);
       console.log(data);
       })
  
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
            console.log(data,"oi");
             })
         }else{
          await fetch(`https://localhost:7148/WorkoutExercise/name/${searchM}`).then( response => response.json())
          .then(data =>{
            setExerciseS(data);
            console.log(data);
             })
         }        
        
        }
        search()
     }else{
      setTrainingS([]);
      setExerciseS([]);
     }
 },[searchM])

  return (
    <div className="Home">
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
    </div>
    )})}  
    </>
    ):(
      <>
      {exerciseS.map(exercise=>(
          <div className="work" key={exercise.id}>

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

          </div>
            )})}
        </div>

        <h2>Exercicios mais utilizados</h2>
        <div>

          {exercise.map(exercise=>(
          <div className="work" key={exercise.id}>

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

          </div>
          ))}
        </div>
      </div>
    ) }
    </div>
  );
}

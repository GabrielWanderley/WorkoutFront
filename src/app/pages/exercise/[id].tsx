"use client"

import Image from "next/image";
import imagem from "../assets/balanca.png"

import "./styles.css"

export default function Exercise(){
    return(
        <div>
             <div className="exercise">
              
              <h1>Remada Curvada</h1>
              <Image className="image" src={imagem} alt=""/>
              <Image className="image" src={imagem} alt=""/>
              
              <h3>Musculo: <span>Costas</span></h3>
              <h3>Equipamento: <span>Barra</span></h3>
               
                <h2>Descrição</h2>
                <div className="exerciseText">
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorum praesentium voluptatibus fuga libero enim harum repellendus dolor! Soluta odio aperiam impedit quibusdam, harum placeat eum numquam exercitationem quidem maiores!</p>
                </div>

             </div>
        </div>
    )
}
"use client"

import Image from "next/image";
import sla from "../assets/academia.png"

import "./styles.css"
export default function Workout (){
    return(
        <div>
            <div className="WorkoutContent">
               <h1>Costas</h1>

               <div className="works">
                
                 <div className="work">
                   <h2>Remada curvada</h2>
                   <Image src={sla} alt="" className="imageWork"/>
                   <div className="workContent">
                   <h3>Repetições  <span>12</span></h3>
                   <h3>Series       <span>4</span></h3>
                   <h3>Peso        <span>30kg</span></h3>     
                   <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore nisi, iste iure minus quia aliquam quasi placeat eveniet error eligendi, libero autem nesciunt doloremque corrupti ad quae neque magnam sunt?</p>               
                   </div>

                   <p>Ver mais sobre o exercicio</p>
                 </div>

               </div>
            </div>
        </div>
    )
}
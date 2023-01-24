
import { useEffect, useState } from "react";

import "./CardProfile.css";
import { useAuth } from "../../context/authContext";
import api from "../../utils/api";
export function CardProfile({cardName, allData, connections, action}) {
  const [relationType, setRelationType] = useState('default');

  
  async function setNewRealtion(remove=false) {
    if(relationType === 'default'){
      alert('Selecione um parâmetro de Vinculação ou Desvinculação!');
      document.getElementById('relationType')?.focus();
      return;
    }
    try {
      let inputValues = {entityName: cardName, relationType:relationType , operation: remove == false? "add": "remove"}
      const response = await api.put(`/relation?userName=${data.userName}`,inputValues);
      action()

    } catch (err) {
      console.log(err);
      // setIsLoaded(true);
    }
  }
  async function setNewRealtionClient(remove=false) {
    try {
      let inputValues = {entityName: cardName, relationType:"client" , operation: remove == false? "add": "remove"}
      const response = await api.put(`/relation?userName=${data.userName}`,inputValues);
      action()

    } catch (err) {
      console.log(err);

    }
  }

  const { data } = useAuth()
  console.log(allData)
  return (
          <article className="articleCard">
            {cardName}
            {Object.keys(allData.public).map((key) => (
              `${" "}${key} : ${allData.public[key]}`
              ))}
            {allData.person == true && data.person == true ? (
            <div className="typeOfConnections">
                <select 
          name="relationType" 
          id="relationType"
          defaultValue="default"
          onChange={(e)=>setRelationType(e.target.value)}
        >
          <option value="default" hidden disabled>Buscar por</option>
          <option value="friendShip">Amizade</option>
          <option value="family">Familia</option>
          <option value="acquaintance">Conhecido</option>
        </select>
        <div className="column">
        <button type="button" onClick={()=>setNewRealtion()}>Vincular</button>
        <button type="button" onClick={()=>setNewRealtion(true)}>Desvincular</button>
        </div>
              </div>)
            :(<div className="typeOfConnections">
            <button onClick={()=> setNewRealtionClient()} type="button
            ">Vincular Cliente</button>
            <button type="button" onClick={()=>setNewRealtionClient(true)}>Desvincular Cliente</button>
           
          </div>)}
          </article>

  );
}

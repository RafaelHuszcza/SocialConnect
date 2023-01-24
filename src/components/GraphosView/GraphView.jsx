
import React, { useRef, useEffect, useState } from "react";

import { Box, Modal } from "@mui/material";

import "./GraphView.css";
import { useAuth } from "../../context/authContext";
import api from "../../utils/api";


export function GraphView() {
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState("");
  const [dataGraph, setDataGraph] = useState([]);
  const [loadedImg, setLoadedImg] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const handleCloseModal = () => {
    
    setOpen(false);
    setDataGraph([]);
  };
  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "4px",
    boxShadow: 24,
    p: 2,
  };
  const { data } = useAuth()
  const formRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      fetch(`http://127.0.0.1:3000/graph/?userName=${data.userName}&levels=${levels}`, {
    method: 'GET',
}).then(response => {
    console.log("ss")
    return response.blob()
}).then(blob => {
    let objectURL = URL.createObjectURL(blob)
    setLoadedImg(true)
    setImgUrl(objectURL);
})

      // let params = {params : {userName: data.userName , levels: levels}}
      // const response = await api.get(`graph/?userName=${data.userName}`);
      // setLoadedImg(True)
      // setImgUrl(response.data);

    } catch (err) {
        console.log(err);
    
  }
  }
  
  return (
    <>
    <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ ...styleModal }} className="boxModal"style={{ width: "80vw", height: "80vh" }}>
        <form
             
              id="submitGraph"
              onSubmit={onSubmit}
              ref={formRef}
            ><label> Selecione os Níveis caso deseje focar no seu Perfil
              <input type="number" onChange={(e)=>setLevels(e.target.value)}></input>
              </label>
              </form>
          {loadedImg? (
            <img   
            className="image" src={imgUrl}/>
          ): null}
        
         <button
           form="submitGraph"
           type="submit"

         >
           Gerar Grafo
         </button>
      
        </Box>
      </Modal>
    
    <div className="absoluteGraph">
          <button onClick={() => setOpen(true)} >Ver Grafos</button>
          </div>
          </>
  );
}

import React, { useRef, useEffect, useState } from "react";

import "./Graph.css";
import { useAuth } from "../../context/authContext";
import api from "../../utils/api";

export function Graph() {
  const [levels, setLevels] = useState("");
  const [loadedImg, setLoadedImg] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const { data } = useAuth();
  const formRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = {
        userName: data.userName,
        levels: levels >= 0 ? levels : undefined,
      };
      const response = await api
        .get(`graph`, { params, responseType: "blob" })
        .then((response) => {
          const objectURL = URL.createObjectURL(new Blob([response.data]));
          setLoadedImg(true);
          setImgUrl(objectURL);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="mainGraph">
      <form className="mainGraphForm" onSubmit={onSubmit} ref={formRef}>
        <label className="mainGraphLabel">
          Selecione os Níveis caso deseje focar no seu Perfil
        </label>
        <input
          className="mainGraphInput"
          type="number"
          onChange={(e) => setLevels(e.target.value)}
        ></input>

        <button className="mainGraphButton" type="submit">
          Gerar Grafo
        </button>
      </form>
      {loadedImg ? <img className="graphImage" src={imgUrl} /> : null}
    </main>
  );
}

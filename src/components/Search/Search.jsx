import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Search.css";
import { useAuth } from "../../context/authContext";
import { CardProfile } from "../CardProfile/CardProfile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Search() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const [cardsEntities, setCardsEntities] = useState([]);
  const [cardsEntitiesConnect, setCardsEntitiesConnect] = useState([]);

  const [search, setSearch] = useState("");
  const [searchKey, setSearchKey] = useState("default");

  const { data } = useAuth();

  async function loadEntities(typeSearch) {
    if (search === "") {
      alert("Digite ao menos uma letra!");
      document.getElementById("search")?.focus();
      return;
    }

    if (searchKey === "default") {
      alert("Selecione um parâmetro de busca!");
      document.getElementById("searchKey")?.focus();
      return;
    }
    try {
      let params = {
        params: {
          searchKey: searchKey,
          search: search,
          userName: data.userName,
        },
      };
      console.log(params);
      const response = await api.get("/entities", params);

      function noConnected(connect) {
        return connect.connections == null;
      }
      function connected(connect) {
        return connect.connections != null;
      }

      setCardsEntities(response.data.entities.filter(noConnected));
      setCardsEntitiesConnect(response.data.entities.filter(connected));
      toast(
        `Sua busca encontrou ${response.data.entities.length} resultado(s)`
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="mainSearch">
      <section className="search">
        <div className="searchDiv">
          <input
            className="searchDivInput"
            type="text"
            placeholder="Busque por perfis"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="searchDivSelect"
            name="searchKey"
            id="searchKey"
            defaultValue="default"
            onChange={(e) => setSearchKey(e.target.value)}
          >
            <option value="default" hidden disabled>
              Buscar por
            </option>
            <option value="userName">Usuário</option>
            <option value="age">Idade</option>
            <option value="name">Nome</option>
          </select>
          <button
            className="searchDivButton"
            type="button"
            onClick={() => loadEntities()}
          >
            Pesquisar
          </button>
        </div>

        <div className="cardsSearch">
          {cardsEntitiesConnect.map((card, index) => (
            <CardProfile key={index} cardName={card.userName} allData={card} />
          ))}

          {cardsEntities.map((card, index) => (
            <CardProfile key={index} cardName={card.userName} allData={card} />
          ))}
        </div>
      </section>
    </main>
  );
}

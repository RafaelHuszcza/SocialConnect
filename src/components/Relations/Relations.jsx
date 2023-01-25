import { useState, useEffect } from "react";

import api from "../../utils/api";
import "./Relations.css";
import { useAuth } from "../../context/authContext";
import Oval from "react-loading-icons/dist/esm/components/oval";

export function Relations() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const { data } = useAuth();
  async function loadRelations() {
    try {
      let params = { params: { userName: data.userName } };
      const response = await api.get("/relations", params);
      setCards(response.data.relations);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
      setIsLoaded(true);
    }
  }
  useEffect(() => {
    loadRelations();
  }, []);

  return (
    <main className="mainRelations">
      <section className="relations">
        {!isLoaded ? (
          <div>
            <Oval />
          </div>
        ) : null}

        {isLoaded
          ? cards.map((card, index) => (
              <article className="article" key={index}>
                <p>{card[0].userName}</p>
                <p>{card[1]}</p>
              </article>
            ))
          : null}
      </section>
    </main>
  );
}

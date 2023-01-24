

import { Box, Modal } from "@mui/material";
import { useState, useRef ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Dashboard.css";
import { useAuth } from "../../context/authContext";
import Oval from "react-loading-icons/dist/esm/components/oval";
import { CardProfile } from "../CardProfile/CardProfile";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GraphView } from "../GraphosView/GraphView";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";


export function Dashboard({ title }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const [cardsEntities, setCardsEntities] = useState([]);
  const [cardsEntitiesConnect, setCardsEntitiesConnect] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchKey, setSearchKey] = useState('default');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const formRef = useRef();
  const { data, signOut, signIn} = useAuth()
  async function loadRelations() {
    try {
      let params = {params : {userName: data.userName }}
      const response = await api.get("/relations", params);
      setCards(response.data.relations);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
      setIsLoaded(true);
    }
  }
  async function loadEntities(typeSearch) {
    if(search === ''){
      alert('Digite ao menos uma letra!');
      document.getElementById('search')?.focus();
      return;
    }  

    if(searchKey === 'default'){
      alert('Selecione um parâmetro de busca!');
      document.getElementById('searchKey')?.focus();
      return;
    }  
    try {
      let params = {params : {searchKey: searchKey , search: search , userName: data.userName, typeSearch: typeSearch}}
      const response = await api.get("/entities", params);

      function noConnected(connect) {
        return connect.connections == null;
      }
      function connected(connect) {
        return connect.connections != null;
      }
      
      setCardsEntities(response.data.entities.filter(noConnected));
      setCardsEntitiesConnect(response.data.entities.filter(connected));
      toast(`Sua busca encontrou ${response.data.entities.length} resultado(s)`);
    } catch (err) {
      console.log(err);
    }
  }
  const relaod = () => {
     setToggle(!toggle)
  }
  useEffect(() => {
    loadRelations()
  }, [toggle]);

  const handleCloseModal = () => {
    
    setOpen(false);

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
  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmiting(true);
    const inputValues = [...formRef.current.elements].reduce(
      (total, { name, value }) => {
        if (name) return { ...total, [name]: value };
        return total;
      },
      {}
    );
    try {

      const schema = yup.object().shape({
        password: yup.string().required("É necessário inserir uma Senha"),
        user: yup
          .string()
          .required("É necessário inserir uma Usuário"),
        person: yup.string(),
        name: yup.string().required("É necessário inserir um Nome"),
        age: yup.string().required("É necessário inserir uma idade"),
      });

      await schema.validate(inputValues);
      let newValues = {...inputValues}
      
      delete newValues["name"] 
      delete newValues["age"] 
      
      let ageCheckbox = document.getElementById("age-checkbox")
      let nameCheckbox = document.getElementById("name-checkbox")

      let isPrivate = ageCheckbox.checked? { age : inputValues["age"]} : {}
    
      isPrivate = nameCheckbox.checked? {...isPrivate,name: inputValues["name"]}: {...isPrivate}
      let isPublic = ageCheckbox.checked? {} : { age: inputValues["age"]}
      isPublic = nameCheckbox.checked? {...isPublic} : {...isPublic, name: inputValues["name"]}

      const toBoolean = (value) => (value == "true" ? true : false);
      newValues.person = toBoolean(newValues.person)
      delete newValues["age-checkbox"] 
      delete newValues["name-checkbox"]
      newValues["data"] = {public: isPublic, private: isPrivate}

      const response = await api.put(`/edit?userName=${data.userName}`, newValues);
      setIsSubmiting(false);
      let valuesToSet = {...newValues}
      valuesToSet["userName"]= valuesToSet["user"]
      valuesToSet["private"]= valuesToSet["data"]["private"]
      valuesToSet["public"]= valuesToSet["data"]["public"]
      delete  valuesToSet["user"]
      delete  valuesToSet["data"]
      signIn(valuesToSet);
      navigate("/Login");
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.errors[0]);
      } else {
        setError("");
        toast("Usuário Não Encontrado");
      }
      setIsSubmiting(false);
    }
  }

  return (
    <>
    <GraphView/>
    <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ ...styleModal }} className="boxModal"style={{ width: "80vw", height: "80vh" }}>
        <form className="form" onSubmit={onSubmit} ref={formRef}>
          <h2>Registrar</h2>
          <input name="user" type="text" placeholder="Insira seu Usuário" defaultValue={data.userName}/>
          <input name="password" type="password" placeholder="Insira sua senha Nova ou a antiga"/>
          <label> Organização ou pessoa?
          <select name="person"  defaultValue={data.person} disabled>
          <option value={true}>Pessoa</option>
          <option value={false}>Organização</option>
        </select>
          </label>
          <div className="private">
          <input defaultValue={data.private?.name?data.private?.name: data.public?.name} name="name" type="text" placeholder="Nome que deseja ser chamado"/>
          <label>privada?
          <input defaultChecked={data.private?.name? true: false} id="name-checkbox"  name="name-checkbox" type="checkbox" />
          </label>
          </div>
          <div className="private" >
          <input defaultValue={data.private?.age?data.private?.age: data.public?.age} name="age" type="text" placeholder="Idade"/>
          <label>privada?
          <input  defaultChecked={data.private?.age? true: false}  id="age-checkbox" name="age-checkbox" type="checkbox"/>
          </label>
          </div>
            {error ? (
              <small>{error}</small>
            ) : null}

            <button type="submit" >
              {isSubmiting ? <Oval/>: null}
              {!isSubmiting ? "Editar" : null}
            </button>

          </form>
      
        </Box>
    </Modal>
    <header className="header"> SocialConnect  <div><UserOutlined className="logout" onClick={()=>setOpen(true)} /> <LogoutOutlined className="logout" onClick={()=>{ console.log("oi"), signOut() }  } /> </div></header>
    <main className="mainDashboard">
      
    <section className="search">
    <div className="searchDiv">

          <input 
            type="text" 
            placeholder='Busque por perfis'
            id='search'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        <select 
          name="searchKey" 
          id="searchKey"
          defaultValue="default"
          onChange={(e)=>setSearchKey(e.target.value)}
        >
          <option value="default" hidden disabled>Buscar por</option>
          <option value="user">Usuário</option>
          <option value="age">Idade</option>
          <option value="name">Nome</option>

        </select>
        <button type="button" onClick={()=>loadEntities("1")}>Pesquisar  1</button>
      </div>
      <div className="buttonsSearch">
      <button type="button" onClick={()=>loadEntities("2")}>Pesquisar 2</button>
      <button type="button" onClick={()=>loadEntities("3")}>Pesquisar 3</button>
      </div>
      <div className="cardsSearch">
             {cardsEntitiesConnect.map((card,index) => (
              
         <CardProfile key={index} cardName={card.userName} allData={card} connections={card.connections} action={relaod} />
))}
      {/* {cardsEntitiesConnect.map((card,index) => (
          <article className="article" key={index}>
            <p>{card.userName}</p>
          </article>
))} */}
{cardsEntities.map((card,index) => (
          <CardProfile key={index} cardName={card.userName} allData={card} connections={card.connections} action={relaod} />
))}
</div>
    </section>
      <section className="relations">

        {!isLoaded ? (
          <div >
            <Oval />
          </div>
        ):null }

        {isLoaded ? 
          cards.map((card,index) => (
          <article className="article" key={index}>
            <p>{card[0].userName}</p>
            <p>{card[1]}</p>
          </article>
        ))
        :null}
      
      </section>
    </main>
    <footer className="footer"> Todos Os Direitos Reservados SocialConnect</footer>
    </>
  );
}

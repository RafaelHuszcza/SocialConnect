

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Header.css";
import { useAuth } from "../../context/authContext";
import { Box, Modal } from "@mui/material";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import Oval from "react-loading-icons/dist/esm/components/oval";
import * as yup from "yup";
import { ValidationError } from "yup";
import  Logo from "../../Assets/Logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const formRef = useRef();

  const { data, signOut, signIn} = useAuth()

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
        userName: yup
          .string()
          .required("É necessário inserir um Nome de Usuário"),
        accountType: yup.string(),
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

      delete newValues["age-checkbox"] 
      delete newValues["name-checkbox"]
      newValues["data"] = {public: isPublic, private: isPrivate}
      console.log(newValues)

      const response = await api.put(`/edit?userName=${data.userName}`, newValues);
      setIsSubmiting(false);
      signIn(newValues);
      handleCloseModal();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.errors[0]);
      } else {
        setError("");
      }
      setIsSubmiting(false);
    }
  }

  return (
    
    
    <header className="header">  
    
    <Modal open={open} onClose={handleCloseModal}>
    <Box sx={{ ...styleModal }} className="boxModal"style={{ width: "50vw", height: "90vh" }}>
    <section className="edit">
    <form className="formEdit" onSubmit={onSubmit} ref={formRef}>
      <h2>Editar usuário</h2>
      <input name="userName" type="text" placeholder="Insira seu Usuário" defaultValue={data.userName} disabled/>
      <input name="password" type="password" placeholder="Insira sua senha Nova ou a antiga"/>
      <label> Organização ou Pessoa?
      <select name="accountType"  defaultValue={data.accountType} disabled>
      <option value="person">Pessoa</option>
      <option value="organization">Organização</option>
    </select>
      </label>
      <div className="privateEdit">
      <input defaultValue={data.data?.private?.name? data.data?.private?.name: data.data?.public?.name} name="name" type="text" placeholder="Nome que deseja ser chamado"/>
      <div className="privateEditCheckbox">
      <label>Privado?</label>
      <input defaultChecked={data.data?.private?.name? true: false} id="name-checkbox"  name="name-checkbox" type="checkbox" />
      </div>
      
      </div>
      <div className="privateEdit" >
      <input defaultValue={data.data?.private?.age?data.data?.private?.age: data.data?.public?.age} name="age" type="text" placeholder="Idade"/>
      <div className="privateEditCheckbox">
      <label>Privado?</label>
      <input  defaultChecked={data.data?.private?.age? true: false}  id="age-checkbox" name="age-checkbox" type="checkbox"/>
      
      </div>
      </div>
        {error ? (
          <small>{error}</small>
        ) : null}

        <button type="submit" >
          {isSubmiting ? <Oval/>: null}
          {!isSubmiting ? "Editar" : null}
        </button>

      </form>
      </section>
  
    </Box>
</Modal>
<img className="image" src={Logo} alt="Logo"/> 
<div className="menus"><a onClick={()=>navigate("/relations")}>Relações</a> <a onClick={()=>navigate("/search")} >Busca</a> <a onClick={()=>navigate("/graph")} >Gerar Grafo</a></div>
<div><UserOutlined className="logout" onClick={()=>setOpen(true)} /> <LogoutOutlined className="logout" onClick={()=>{ signOut() }  } /> </div></header>

  );
}

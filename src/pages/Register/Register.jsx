import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import * as yup from "yup";
import { ValidationError } from "yup";
import api from "../../utils/api";
import  "./Register.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Oval from "react-loading-icons/dist/esm/components/oval";

export const Register = () => {
  const [error, setError] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();

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
      const response = await api.post("signup", newValues);

      setIsSubmiting(false);
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
    <main className="mainRegister">
      <section className="register">
          <form onSubmit={onSubmit} ref={formRef}>
          <h2>Registrar</h2>
          <input name="userName" type="text" placeholder="Insira seu Usuário"/>
          <input name="password" type="password" placeholder="Insira sua senha"/>
          <label> Organização ou Pessoa?
          <select name="accountType"  defaultValue="person" >
          <option value="person">Pessoa</option>
          <option value="organization">Organização</option>
        </select>
          </label>
          <div  className="private">
          <input name="name" type="text" placeholder="Nome que deseja ser chamado"/>
          <label>privada?
          <input id="name-checkbox"  name="name-checkbox" type="checkbox" />
          </label>
          </div>
          <div className="private" >
          <input name="age" type="text" placeholder="Idade"/>
          <label>privada?
          <input id="age-checkbox" name="age-checkbox" type="checkbox"/>
          </label>
          </div>
            {error ? (
              <small>{error}</small>
            ) : null}

            <button type="submit" >
              {isSubmiting ? <Oval/>: null}
              {!isSubmiting ? "Cadastrar" : null}
            </button>
            <a className="loginNavigation" onClick={()=> navigate("/login")}> Logar</a>

          </form>

      </section>
    </main>
  );
};

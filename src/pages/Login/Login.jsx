import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";


import * as yup from "yup";
import { ValidationError } from "yup";


import api from "../../utils/api";

import  "./Login.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Oval from "react-loading-icons/dist/esm/components/oval";

export const Login = () => {
  const [error, setError] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { signIn } = useAuth();
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
          .required("É necessário inserir uma Usuário"),
      });

      await schema.validate(inputValues);
      const response = await api.post("login", inputValues);
      setIsSubmiting(false);
      signIn(response.data);
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
    <main className="mainLogin">
      <section className="login">
          <form onSubmit={onSubmit} ref={formRef}>
          <h2>Login</h2>
          <input name="userName" type="text" placeholder="Insira seu Usuário"/>
          <input name="password" type="password" placeholder="Insira sua senha"/>
            {error ? (
              <small>{error}</small>
            ) : null}

            <button type="submit" >
              {isSubmiting ? <Oval/>: null}
              {!isSubmiting ? "Entrar" : null}
            </button>
            <a className="registerNavigation" onClick={()=> navigate("/register")}> Registrar-se</a>
          </form>
            
      </section>
    </main>
  );
};

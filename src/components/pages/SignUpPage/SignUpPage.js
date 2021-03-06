import React, { useEffect, useState } from "react";
import logo from "../../../assets/resource/Logo_Provicional.png";
import img1 from "../../../assets/resource/sign.svg";
import axios from "axios";
import Cookies from "universal-cookie";
import loading from "../../../assets/resource/loading.svg"
const cookie = new Cookies();



const SignUpPage = () => {
  
  const [isVisibleDato, setIsVisibleDato] = useState("hidden");
  const [dato, setDato] = useState("");
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    mail: "",
    password: "",
    password2: "",

  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  const handlePassWord2 = (e) => {
    if (form.password === e.target.value) {
      setDato("");
      setIsVisibleDato("hidden");
      handleChange(e);
    } else {
      setDato("Las contraseñas no coinciden");
      setIsVisibleDato("visible");
    }    
  }  
  const handleChecked = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    });
  }


  const handleSubmit = (event) => {
  event.preventDefault();
  //check if inputs are undefined
  if (form.name === undefined || form.lastname === undefined || form.mail === undefined || form.password === undefined || form.password2 === undefined ){
    alert("Por favor llene todos los campos");
    return true;
  } else if(form.name === "" || form.lastname === "" || form.mail === "" || form.password === "" || form.password2 === ""){
    alert("Por favor llene todos los campos");
    return true;
  } else if (form.password !== form.password2) {
    alert("Las contraseñas no coinciden");
    return true;
  }else if(!isValidEmail(form.mail)){
    alert("Por favor ingrese un correo valido");
    return true;
  }else if(isUTM(form.mail)){
    setCargando(true);
    setDato("");
    setIsVisibleDato("hidden");    
    setDato("Su cuenta de dominio utm ya está habilitada, solo realice el login");
    setIsVisibleDato("visible");
    setCargando(false);
    return true;    
  }
  else{
    setCargando(true);
    setDato("");
    setIsVisibleDato("hidden");    
    setDato("El registro de usuario no está disponible");
    setIsVisibleDato("visible");
    setCargando(false);
    return true;
  }

  setCargando(true);
  setCargando(true);
  setDato("");
  setIsVisibleDato("hidden");

  axios
    .post(`${process.env.REACT_APP_API_URL}/signup`, {
      name: form.name,
      lastname: form.lastname,
      mail: form.mail,
      password: form.password,
    },
    {
      headers: {
        'token': process.env.REACT_APP_SECRET_TOKEN
    }
    }).then((response) => {
      if (response.data.res === "USER EXITS") {
        setDato("El usuario ya existe");
        setIsVisibleDato("visible");
        setCargando(false);
        setInterval(() => {
          setDato("");
          setIsVisibleDato("hidden");
        }, 10000);
      } else if(response.data.res === "ERROR"){
        setDato("Hubo un error al conectar con el servidor");
        setIsVisibleDato("");
        setCargando(false);
        setInterval(() => {
          setDato("");
          setIsVisibleDato("hidden");
        }, 10000);

      } else {
        console.log(response);
        var user = response.data.res;
        cookie.set("_id", user._id, { path: "/" });
        cookie.set("name", user.name, { path: "/" });
        cookie.set("lastname", user.lastname, { path: "/" });
        cookie.set("mail", user.mail, { path: "/" });
        cookie.set("status", user.status, { path: "/" });
        
        if(user.status === 'Active'){
          window.location.href = "./dashboard";
        }else{
          window.location.href = "./pendingAccount";
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  useEffect(() => {
    
  })

    return (
      <div className=" ">
        <div className="flex h-screen w-screen ">
          <div className=" lg:w-1/3 md:w-screen">
            <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-2">
                <div>
                <a href="/">
                  <img
                    className="mx-auto h-12 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                  </a>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Registro
                  </h2>
                  <p className="mt-2 text-center text-sm text-gray-600">
                    O
                    <a
                      href="/signin"
                      className="font-medium ml-2 text-green-600 hover:text-green-500"
                    >
                      Iniciar sesión
                    </a>
                  </p>
                </div>
                <div className={isVisibleDato}>
                  <h2 className="text-md text-red-500">{dato}</h2>
                </div>
                <form className=" space-y-4" action="#" method="POST">
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={form.username}
                        onChange={handleChange}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                        placeholder="Nombres"                        
                      />
                    </div>
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Lastname
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        autoComplete="lastname"
                        required
                        value={form.lastname}
                        onChange={handleChange}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                        placeholder="Apellidos"
                      />
                    </div>
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        name="mail"
                        type="email"
                        pattern="[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}"
                        autoComplete="email"
                        required
                        onChange={handleChange}
                        value={form.mail}
                        className=" border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-yellow-500 focus:border-yellow-500  focus:z-10 sm:text-sm appearance-none rounded-none relative block w-full px-3 py-2 border rounded-t-md focus:outline-none "
                        placeholder="Correo electrónico"                        
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        value={form.password}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                        placeholder="Contraseña"                        
                      />
                    </div>                    
                    <div>
                      <label htmlFor="password2" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password2"
                        name="password2"
                        type="password"
                        autoComplete="current-password2"
                        onChange={handleChange}
                        value={form.password2}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                        placeholder="Contraseña"                        
                      />
                    </div>                    
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        onChange={handleChecked}
                        value={form.remember}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Recuerdame
                      </label>
                    </div>
{/* 
                    <div className="text-sm">
                      <a
                        href=""
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        Olvidaste tu contraseña?
                      </a>
                    </div> */}
                  </div>
                  {cargando && <div className="flex items-center justify-center"><img src={loading} width={50} alt="cargando"></img></div>}
                  <div>
                    <button
                      type="submit"
                      disabled={cargando}
                      onClick={handleSubmit}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                          focus:ring-yellow-400"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-yellow-600 group-hover:text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 hidden md:block ">
            <div className="min-h-screen flex-col flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div>
                <img src={img1} width="400" alt="aprende ingles"></img>
              </div>
              <div>
                <h3 className="text-lg p-2 font-semibold italic">
                  Aprender otro idioma es como convertirse en otra persona,
                  <br />
                  <span className="text-gray-500 font-normal italic">
                    Haruki Murakami
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}


//is valid email
function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//es gmail domain
const isUTM = (email) => {
  const domain = email.split("@")[1];
  return domain === "utm.edu.ec";  
};


export default SignUpPage

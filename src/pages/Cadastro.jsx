import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import visibilityIcon from '../assets/svg/Ícone olho.svg'
import logoAzul from '../assets/images/LogoAzul.png'


function Cadastro() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {name, email, password} = formData
  const [errors, setErrors] = useState({})
  const [touched, setTouchedFields] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [passwordVerify, setPasswordVerify] = useState('')
  const [passwordVisibily, setPasswordVisibily] = useState('false')
 
  
  // A cada alteracao do formulario a funcao atualiza o estado dos campos
  const onChange = (e) => {
    const fieldName = e.target.id
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value
    }))
  }

  const passwordVerifyOnChange = (e) => {
    setPasswordVerify(e.target.value)
  }
  // Seta o estado do campo do formulario como tocado e a partir de entao, caso haja erro, o erro passa a ser mostrado
  const onBlur = (e) => {
    const fieldName = e.target.id
    setTouchedFields((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }))
  }
  // A cada alteracao do estado do formulario a funcao dedntro do useEffect e chamada e assim e verificado a existencia de erros dentro de cada campo
  useEffect(() => {
    setErrors(validate(formData))
  },[formData])

  //Funcao com as regras de validacao e a menssagem de erro relacionada a esta regra para cada campo do form
  const validate = (values) => {
    const errors = {}
    if (!checkEmailIsValid(values.email)) {
      errors.email = 'Este email nao e valido'
    }
    if (values.name.length < 3 ) {
      errors.name = 'O nome precisa ter mais que tres letras'
    }
    if (!checkPasswordIsValid(values.password)) {
      errors.password = 'A senha precisa ter uma letra minuscula e uma letra mmaiuscula'
    }
    if (values.password.length < 6) {
      errors.password = 'A senha precisa ter mais que 6 caracteres'
    }
    return errors
  }

  
  //Funcoes de validacao
  const checkEmailIsValid = (currentEmail) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(currentEmail)
  }

  const checkPasswordIsValid = (currentPassword) => {
    return currentPassword.search(/[a-z]/) >= 0 && currentPassword.search(/[A-Z]/) >= 0;
  }
  //fim funcoes de validacao
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    console.log(formData)
    if (password === passwordVerify) {
      try {
        const auth = getAuth()
        console.log(auth)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log(userCredential)
        const user = userCredential.user
        
        updateProfile(auth.currentUser, {
          displayName: name,
        })
        
        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()
        
        await setDoc(doc(db, 'users', user.uid), formDataCopy)
        setIsLoading(false)
        navigate('/perfil')
        
      } catch (error) {
        console.log(error)
        setIsLoading(false)
        toast.error('Algo de errado aconteceu com o registro')
      }
    } else {
      setIsLoading(false)
      setErrors((prevState) => ({
        ...prevState,
        passwordVerify: 'As senhas nao coincidem'
      }))
    }
  }

  return (
    <>
      <div className="container__content patas forma3 fade-in">
        <button className='logo__title' onClick={() => {navigate('/home')}}><img src={logoAzul} alt='logo adopet branca' width='200px'/> </button>
        <p className='text__content'>Ainda nao tem cadastro?</p>
        <p className='text__content'>Entao antes de buscar o seu melhor amigo precisamos de alguns dados.</p>
        <form onSubmit={onSubmit}>
          <label className='input-user' htmlFor='email'>Email</label>
          <input
            type='email'
            className='input-user'
            placeholder='escolha seu melhor email'
            id='email'
            value={email}
            onBlur={onBlur}
            onChange={onChange}
          />
          {errors.email && touched.email && <span className='errorMessage'>{errors.email}</span>}
          <label className='input-user' htmlFor='name'>Nome</label>
          <input
            type='text'
            className='input-user'
            placeholder='Digiite seu nome completo'
            id='name'
            value={name}
            onBlur={onBlur}
            onChange={onChange}
          />
          {errors.name && touched.name && <span className='errorMessage'>{errors.name}</span>}
          <div className='input-password'>
            <label className='input-user' htmlFor='password'>Senha</label>
            <input
              type={passwordVisibily ? 'text' : 'password'}
              className='input-user'
              placeholder='Crie uma senha'
              id='password'
              value={password}
              onBlur={onBlur}
              onChange={onChange}
              />
              <img className='visibilityIcon' src={visibilityIcon} onClick={() => setPasswordVisibily((prevState) => (!prevState))} alt='repita a senha criada acima'/>
              {errors.password && touched.password && <span className='errorMessage'>{errors.password}</span>}
          </div>
          <div className='input-password'>
            <label className='input-user' htmlFor='passwordVerify'>Confirme sua senha</label>
            <input
              type={passwordVisibily ? 'text' : 'password'}
              className='input-user'
              placeholder='Repita a senha criada acima'
              id='passwordVerify'
              value={passwordVerify}
              onChange={passwordVerifyOnChange}
              />
              <img className='visibilityIcon' src={visibilityIcon} onClick={() => setPasswordVisibily((prevState) => (!prevState))} alt='visibility icon for password'/>
              {errors.passwordVerify && <span className='errorMessage'>{errors.passwordVerify}</span>}
          </div>
          <button  style={{
          margin: '40px auto'}} 
          type='submit' 
          className='btn__btn-primary'>{isLoading ? '...' : 'Cadastrar'}</button>
        </form>
      </div>
    </>
  )
}

export default Cadastro
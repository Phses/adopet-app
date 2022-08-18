import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {toast} from 'react-toastify'
import visibilityIcon from '../assets/svg/Ícone olho.svg'
import logoAzul from '../assets/images/LogoAzul.png'

function LogIn() {
  const [showError, setShowError] = useState({
    errorType: '',
    errorMessage: ''
  })
  const {errorType, errorMessage} = showError
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const {email, password} = formData
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  
  const onChange = (e) => {
    if (errorType === e.target.id) {
      setShowError({
        errorType: '',
        errorMessage: ''
      })
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (email === '' || password === '') {
      if (email === '') {
        setShowError({
          errorType: 'email',
          errorMessage: 'Este campo nao pode estar vazio'
        })
      } else {
        setShowError({
          errorType: 'password',
          errorMessage: 'Este campo nao pode estar vazio'
        })
      }
    } else {
        setIsLoading(true)
        try {
          const auth = getAuth()
          
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
            )
            if (userCredential.user) {
              setIsLoading(false)
              navigate('/home')
            }
          } catch (error) {
            setIsLoading(false)
            toast.error('Usuario nao cadastrado')
          }
      }
    }
      return (
    <div className="container__content patas forma3 fade-in">
        <button className='logo__title' onClick={() => {navigate('/home')}}><img src={logoAzul} alt='logo adopet branca' width='200px'/> </button>
        <p className='text__content'>Ja tem conta? Faca seu login</p>
        <form onSubmit={onSubmit}>
          <label className='input-user' htmlFor='email'>Email</label>
          <input
            type='email'
            className='input-user'
            placeholder='Insira seu email'
            id='email'
            value={email}
            onChange={onChange}
          />
          {(errorType === 'email') && <p className='errorMessage'>{errorMessage}</p>}
          <div className='input-password'>
            <label className='input-user' htmlFor='password'>Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className='input-user'
              placeholder='Crie uma senha'
              id='password'
              value={password}
              onChange={onChange}
              />
              <img className='visibilityIcon' src={visibilityIcon} onClick={() => setShowPassword((prevState) => (!prevState))} alt='icon'/>
              {(errorType === 'password') && <p className='errorMessage'>{errorMessage}</p>}
          </div>
          <button  style={{
          margin: '40px auto 240px auto'}} 
          type='submit' 
          className='btn__btn-primary'>{isLoading ? '...' : 'Entrar'}</button>
        </form>
    </div>
  )
}

export default LogIn
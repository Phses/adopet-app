import React from 'react'
import {useNavigate} from 'react-router-dom'
import LogoWhite from '../assets/images/Logo.png'
import Ilustracao1 from '../assets/images/Ilustração 1.png'

function Inicial() {
  const navigate = useNavigate()
  return (
    <>
      <div className='container background__color'>
        <div className='container__content'>
          <button className='logo__title' onClick={() => {navigate('/home')}}><img src={LogoWhite} alt='logo adopet branca' width='200px'/> </button>
          <h2>Boas-vindas</h2>
          <p className='initial__content'>Que tal mudar sua vida adotando seu novo melhor amigo?</p>
          <button className='btn__btn-primary' onClick={() => {navigate('/log-in')}}>Ja tenho conta</button>
          <button className='btn__btn-primary' onClick={() => {navigate('/cadastro')}}>Quero me cadastrar</button>
          <img className='ilustracao1' src={Ilustracao1} alt='ilustracao cachorro e gato lado a lado'/>
        </div>
      </div>
    </>
  )
}

export default Inicial
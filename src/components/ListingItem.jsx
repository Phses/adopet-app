
import { useEffect } from 'react'
import {Link} from 'react-router-dom'
import iconeMessage from '../assets/svg/ícone mensagem.svg'

function ListingItem({id, data}) {
  useEffect(() => {
    console.log(data)
  },[data])
  return (
    <li className='pet-item'>
      <div className='col'>
        <img className='pet-item__image' src={data.imgUrls} alt={`Foto ${data.name}`}/>
      </div>
      <div className='col'>
        <p className='pet-item__name'>{data.name}</p>
        <ul className='pet-item__characters'>
          <li>{data.age} anos</li>
          <li>{data.size}</li>
          <li>{data.temperament}</li>
        </ul>
        <p className='pet-item__location'>{data.location}</p>
        <Link to={`/message/${data.userRef}`} className='pet-item__message'>
          <img className='message-icon' src={iconeMessage} alt='Message icon'/>
          <small>Fale com responsavel</small>
        </Link>
      </div>
    </li>
  )
}

export default ListingItem
import {useState, useEffect} from 'react'
import {  Link, useNavigate, useLocation } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {db} from '../firebase.config'
import {ReactComponent as HomeIcon} from '../assets/svg/Casa.svg'
import {ReactComponent as MensageIcon} from '../assets/svg/Mensagens.svg'
import {ReactComponent as PersonIcon} from '../assets/svg/personOutlineIcon.svg'
import Logo from '../assets/images/Logo.png'
function Navbar() {
  const [srcImg, setSrcImg] = useState('') 
  const [loggedIn, setLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const auth = getAuth()
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setLoggedIn(true)
        setSrcImg(user.photoURL)
      } else {
        setLoggedIn(false)
        setSrcImg('')
      }
    })
  },[])

  const pathMatchRoute = (route) => {
    if(route === location.pathname) {
      return true
    }
  }

  return (
    <>
      <header>
          <nav className='navBar'>
            <ul className='navBar__list'>
              <li className='navBar__item' onClick={() => navigate('/')}>
                <img className='logo' src={Logo}/>
              </li>
              <li className='navBar__item' onClick={() => navigate('/home')}>
                <HomeIcon width='20px' height='20px'/>
              </li>
              <li className='navBar__item' onClick={() => navigate('/mensagem')}>
                <MensageIcon width='20px' height='20px'/>
              </li>
              {pathMatchRoute('/home') && <li className='navBar__item pushRight' onClick={() => navigate('/Perfil')}>
                {loggedIn ? 
                  <div className='photo-box-navBar'>
                    <img className='photo' src={srcImg}/>
                  </div> :
                  <div className='circleIcon'>
                    <PersonIcon  width='30px' height='30px' fill='#36D6AD'/>
                   </div>}
              </li>} 
              {pathMatchRoute('/mensagem') && <li className='navBar__item pushRight' onClick={() => navigate('/Perfil')}>
              {loggedIn ? 
                <div className='photo-box-navBar'>
                  <img className='photo' src=''/>
                </div> :
                <div className='circleIcon'>
                  <PersonIcon  width='30px' height='30px' fill='#36D6AD'/>
                 </div>}
              </li>} 
              {pathMatchRoute('/perfil') && <li className='navBar__item pushRight' onClick={() => navigate('/Perfil')}>
              {loggedIn ? 
                  <div className='photo-box-navBar'>
                    <img className='photo' src=''/>
                  </div> :
                  <div className='circleIcon'>
                    <PersonIcon  width='30px' height='30px' fill='#36D6AD'/>
                   </div>}
              </li> }
            </ul>
          </nav>
      </header>
    </>
  )
}

export default Navbar
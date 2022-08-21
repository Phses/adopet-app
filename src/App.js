import './index.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Inicial from './pages/Inicial'
import LogIn from './pages/LogIn'
import Mensagem from './pages/Mensagem'
import Perfil from './pages/Perfil'
import CreateListing from './pages/CreateListing';
import PrivateRoute from './components/PrivateRoute';
import Menssagens from './pages/Menssagens';

function App() {
  return (
    <>
      <Router>
        <div className='wrapper'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Inicial />}/>
            <Route path='/cadastro' element={<Cadastro />}/>
            <Route path='/log-in' element={<LogIn />}/>
            <Route path='/mensagem' element={<Mensagem />}/>
            <Route path='/perfil' element={<PrivateRoute />}>
              <Route path='/perfil' element={<Perfil/>}/> 
            </Route>
            <Route path='/home' element={<Home />}/>
            <Route path='/create-listing' element={<CreateListing />}/>
            <Route path='/mensagens-recebidas' element={<Menssagens />}/>
          </Routes>
          <Footer/>
          </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;

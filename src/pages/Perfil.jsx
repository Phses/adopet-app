import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {getAuth, updateProfile, signOut} from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {db} from '../firebase.config'
import {ReactComponent as PersonIcon } from '../assets/svg/personOutlineIcon.svg'
import { toast } from 'react-toastify'
import {v4 as uuidv4} from 'uuid'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Spinner from '../components/Spinner'

function Perfil() {
  // path perfil so e acecssado se o usurio estiver logado, por isso eu nao faco verificao do login e pego a ref do usuario pelo firebase
  const auth = getAuth()
  const user = auth.currentUser;
  //estados do componente
  const [changeDetails, setChangeDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.displayName,
    fotoUrl: user.photoURL,
    telefone: user.phoneNumber,
    foto: '',
    cidade: '',
    sobre: '',
  })
  const {name, foto, fotoUrl, telefone, cidade, sobre} = formData
  const navigate = useNavigate()


// buscar dados do perfil do usuario que estao no firestore, que nao estao presentes no user
  useEffect( () => {
    const fethUserData = async () => {

      setLoading(true)
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        //setei o estado para cada informacao talvez tinha um jeito mens repetitivo de fazer isso, fiz assim para evitar undefined
        const data = docSnap.data()
        console.log(data.cidade)
        if(data.cidade) {
          setFormData((prevState) => ({
            ...prevState,
            cidade: data.cidade,
          }))
        }
        if(data.telefone) {
          setFormData((prevState) => ({
            ...prevState,
            telefone: data.telefone,
          }))
        }
        if(data.sobre) {
          setFormData((prevState) => ({
            ...prevState,
            sobre: data.sobre,
          }))
        }
      } else {
        console.log('Deu ruim')
      }
      setLoading(false)
    }
    fethUserData()

  },[user.uid])

  //funcao para formatar os numeros do campo telefone, gera um warning (value prop on inpt should not be null)
  const numberFormat = (value) => {
    //so aceita numeros
    const currentValue = value.replace(/\D/g,'')
    const valueLength = currentValue.length
    
    if(valueLength < 3) {
      return currentValue
    }
    if(valueLength < 7) {
      return `(${currentValue.slice(0,2)}) ${currentValue.slice(2)}`
    }
    //retornar formato (xx) xxxxx - xxxx
    return `(${currentValue.slice(0,2)}) ${currentValue.slice(2,7)} - ${currentValue.slice(7,11)}`
  }

  
  const userSignOut = () => {
    setLoading(true)
    signOut(auth).then(() => {
      setLoading(false)
      navigate('/')
    }).catch((error) => {
      setLoading(false)
      toast.error('Algo deu errado')
      console.log(error)
    })
  }
  
  const onMutate = (e) => {
    //input type file
    if(e.target.files) {
      console.log(e.target.files[0])
      setFormData((prevState) => ({
        ...prevState,
        foto: e.target.files[0]
      }))
    }
    //input phone
    if(e.target.id === 'telefone') {
      console.log('ta certo')
      setFormData((prevState) => ({
        ...prevState,
        telefone: numberFormat(e.target.value)
        }))
    }
    //input type text
    if (e.target.id !== 'telefone' && !e.target.files){
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
      }))
    }
    
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if(foto.length > 1) {
      setLoading(false)
      toast.error('E necessario apenas uma imagem')
    }

    
      const storageFoto = async (fotos) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = `${uuidv4()}-${fotos.name}-${user.uid}`
    
          const storageRef = ref(storage, 'image/'+fileName)
    
          const uploadTask = uploadBytesResumable(storageRef, fotos)

          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default: break
            }
          }, 
           (error) => {
            reject(error)
           },
           () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            });
           }
          )
        })
      }

      let url = await storageFoto(foto).catch((error) => {
        setLoading(false)
        toast.error('Algo deu errado no upload da imagem')
        console.log(error)
        //Sem o return nao funciona
        return
      })
      
      setFormData((prevState) => ({
        ...prevState,
        fotoUrl: url
      }))


      await updateProfile(user, {displayName: formData.name, photoURL: url}
      ).catch((error) => {
        toast.error('Erro ao atualizar dados do usuario')
        console.log(error)
        return
      })

      const copyForUpdateDocs = {
        ...formData
      }

      delete copyForUpdateDocs.foto

      const userRef = doc(db, 'users', auth.currentUser.uid)

      await updateDoc(userRef, copyForUpdateDocs)

      setLoading(false)
      toast.success('Usuario atualizado')
      setChangeDetails((prevState) => !prevState)
    console.log(formData)
  }
  //Invocar um event hendler sem passar uma funcao causa um erro de too many re-renders

  if (loading) {
    return <Spinner />
  }
  return (
    <div className='container__content'>
      <p className='text__content'>Esse e o perfil que aparece para responsaveis ou ONGs que recebem sua mensagem</p>
      <h1 className='title'>Perfil</h1>
      <div className='change-information-content'>
        <p className='text__content'>Deseja alterar suas informacoes?</p>
        <button onClick={() => {setChangeDetails((prevState) => !prevState)}}className='btn_change-informations'>Alterar perfil</button>
      </div>
      <main id='profile'>
        <form className='form__profile' onSubmit={onSubmit}>
          <div className='profile__photo-container'>
            <label className='input-label' htmlFor='foto'>Foto</label>
            <div className='photo-box'>
              {fotoUrl ?
              <img className='profile__photo' src={fotoUrl}/> : <PersonIcon width='80px' heigth='80px' fill='#3772FF' /> }
            </div>
            <input 
            type='file'
            id='foto'
            className='input-photo'
            accept='.jpg,.png,.jpeg'
            onChange={onMutate}
            />
            <small className='photo-info'>Clique na foto para editar</small>
          </div>

          <label className='input-label' htmlFor='name'>Nome</label>
          <input 
          type='text' 
          id='name'
          className={!changeDetails ? 'input-name' : 'input-name-active'}
          disabled={!changeDetails}
          value={name}
          onChange={onMutate}/>

          <label className='input-label' htmlFor='telefone'>Telefone</label>
          <input 
          type='text'
          id='telefone'
          className={!changeDetails ? 'input-phone' : 'input-phone-active'}
          disabled={!changeDetails}
          value={telefone}
          onChange={onMutate}
          />

          <label className='input-label' htmlFor='cidade'>Cidade</label>
          <input 
          id='cidade'
          type='text'
          className={!changeDetails ? 'input-city' : 'input-city-active'}
          disabled={!changeDetails}
          value={cidade}
          onChange={onMutate}/>

          <div className="lorem50"></div>
          
          <label className='input-label' htmlFor='sobre'>Sobre</label>
          <textarea 
          type='text'
          id='sobre'
          rows='5'
          minLength='50'
          maxLength='250'
          className={!changeDetails ? 'input-about' : 'input-about-active'}
          
          disabled={!changeDetails}
          value={sobre}
          onChange={onMutate}/>

          <button style={{margin: '20px auto'}} className='btn__btn-primary' type='submit'>Salvar</button>
        </form>
        <div className='logout__area'>
          <Link to='/menssagens-recebidas'> 
            <div className='btn__btn-secondary'>Ver suas mensagens</div>
          </Link>
          <button onClick={userSignOut}className='btn__btn-secondary'>Sair</button>
        </div>
      </main>
    </div>
  )
}

export default Perfil
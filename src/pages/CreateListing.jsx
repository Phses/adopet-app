import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
}from 'firebase/storage'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import {v4 as uuidv4} from 'uuid'
import { resolvePath, useNavigate } from 'react-router-dom'

function CreateListing() {
  const [formData, setFormData] = useState({
    age: 0,
    image: '',
    location: '',
    name: '',
    size: '',
    temperament: '',
  })
  const {age, image, location, name, size, temperament} = formData
  const [loading, setLoading] = useState(false)

  const auth = getAuth()
  const navigate = useNavigate()
  //Prevenir aviso de memory leak,
  //useRef cria uma referencia em um objeto e o valor current, esse valor pode ser alterado sem que haja renderizacao.
  const isMounted = useRef(true)

  useEffect(() => {
    if(isMounted) {
      //Observador do obejto Auth para identificar o usuario atual
      onAuthStateChanged(auth, (user) => {
        if(user) {
          //usuario logado
          setFormData({...formData, useRef: user.uid})
        } else {
          //usuario nao logado redirecionar
          navigate('/log-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
  },[isMounted])

  // Fix memory leak warning
  // https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks


  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (image.length > 1) {
      setLoading(false)
      toast.error('E necessario apenas uma imagem')
    }

    //Salvar imagens no firebase

    const storeImage = async (images) => {
    return new Promise((resolve, reject) => {
    const storage = getStorage()

    const fileName = `${auth.currentUser.uid}-${images.name}-${uuidv4()}`

        //cria uma ref para o caminho da imagem
    const storageRef = ref(storage, 'image/' + fileName)

    //upload do arquivo

    const uploadTask = uploadBytesResumable(storageRef, images)
        
    //registrar 3 obervadores
    // 1 - 'state_chenged', e chamado a cada mudanca do stado
    // 2 - error, chamado caso haja falha
    // 3 - completion, caso haja sucesso
    uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    console.log('Upload is' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
          default:
            break
        }
        }, (error) => {
          reject(error)
        },
        () => {
          //Executar caso haja sucecsso no upload
          getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
            resolve(dowloadURL)
          })
        }
      )
      })
    }

    const imgUrls = await storeImage(image).catch(() => {
      setLoading(false)
      toast.error('Houve um problema no upload da imagem')
      return
    })

    console.log(imgUrls)
    
    console.log(formData)
    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      imgUrls,
    }

    delete formDataCopy.image

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success('Pet salvo')
    navigate('/home')
  }

  const onMutate = (e) => {
    //Text
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
    //Files
    if(e.target.files) {
      console.log(e.target.files)
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }))
    }
  }
  return (
    <div className='container__content'>
      <p className='text__content'>Cadastre um pet para que ele encontre um lar</p>
      <main>
        <form onSubmit={onSubmit}>
          <label className='input-label' htmlFor='name'>Nome</label>
          <input
            type='text'
            className='input-pet'
            placeholder='Digite o nome do pet'
            id='name'
            value={name}
            onChange={onMutate}
            />
          <label className='input-label' htmlFor='age'>Idade</label>
          <input
            type='number'
            className='input-pet'
            id='age'
            min='1'
            max='12'
            value={age}
            onChange={onMutate}
            required
            />
          <label className='input-label' htmlFor='size'>Tamanho</label>
          <input
            type='text'
            className='input-pet'
            id='size'
            placeholder='Qual o tamnaho do pet'
            value={size}
            onChange={onMutate}
            required
            />
          <label className='input-label' htmlFor='location'>Localizacao</label>
          <textarea
            type='text'
            className='input-pet__localizacao'
            id='location'
            placeholder='Qual a localizacao do pet'
            value={location}
            onChange={onMutate}
            required
            />
          <label className='input-label' htmlFor='image'>Imagens</label>
          <input
            type='file'
            className='input-file'
            id='image'
            max='1'
            accept='.jpg,.png,.jpeg'
            required
            onChange={onMutate}
            />
          <button style={{margin: '20px 0'}} type='submit' className='btn__btn-primary'>Cadastrar</button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing
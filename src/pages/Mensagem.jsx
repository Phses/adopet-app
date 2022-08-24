import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {getAuth} from 'firebase/auth'
import {doc, getDoc, addDoc, collection,serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'


function Mensagem() {
  const [sendingMesage, setSendingMesage]  = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    petName: '',
    mensage: ''
  })
  const {name, phone, petName, mensage} = formData
  const auth = getAuth()
  const user = auth.currentUser
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", params.listingId)
        console.log(params.listingId)
        const docSnap = await getDoc(docRef)
        
      if(docSnap.exists()) {
        const listingData = docSnap.data()
        if(listingData.userRef === user.uid) {
          toast.error('Voce nao pode enviar mensagem para este usuario')
          navigate('/')
          return
        }
        setUserId(listingData.userRef)
        if(listingData.name) {
          setFormData((prevState) => ({
            ...prevState,
            petName: listingData.name
          }))
        }
      }
        
      } catch (error) {
        setLoading(false)
        toast.error('Erro ao buscar dados')
        console.log(error)
      }
      setLoading(false)
    }
    fetchListing()
    console.log(user)
    setFormData((prevState) => ({
      ...prevState,
      name: user.displayName
    }))
  },[user.displayName, params.listingId])
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const dataCopy = formData
    dataCopy.timestamp = serverTimestamp()
    const usersCollectionRef = collection(db, "users")
    await addDoc(collection(usersCollectionRef, userId,"mensagens"), {
      dataCopy
    }).then(() => {
      setLoading(false)
      toast.success('Mensagem enviada')
      navigate('/')
    }).catch((error) => {
      setLoading(false)
      toast.error('Erro ao enviar a mensagem')
      console.log(error)
    })
  }

  const onMutate = (e) => {
    if(e.target.id === 'phone') {
      setFormData((prevState) => ({
        ...prevState,
        phone: phoneNumberFormat(e.target.value)
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
      }))
    }
  }

  function phoneNumberFormat(phoneNumber) {
    const currentValue = phoneNumber.replace(/\D/g, '')

    if(currentValue.length <= 2) {
      return currentValue
    }
    if(currentValue.length <= 7 ) {
      return `(${currentValue.slice(0,2)}) ${currentValue.slice(2)}`
    }
    if(currentValue.length > 7) {
      return `(${currentValue.slice(0,2)}) ${currentValue.slice(2,7)} - ${currentValue.slice(7,11)}`
    }

  } 
  if(loading) {
    return <Spinner/>
  }
  return (
    <div className='container__content'>
      <p className='text__content'>
        Envie uma menssagem para a pessoa ou instituicao que esta cuidando do animal.
      </p>
      <main id='mensagem'>
        <form id='form-mensage' onSubmit={onSubmit}>
          <label htmlFor='name' className='input-label'>Nome</label>
          <input
          type='text'
          id='name'
          value={name} 
          className='input-user'
          onChange={onMutate}
          required/>
          
          <label htmlFor='phone' className='input-label'>Telefone</label>
          <input
          type='text'
          id='phone'
          value={phone} 
          className='input-user'
          onChange={onMutate}
          required/>

          <label htmlFor='petName' className='input-label'>Nome do animal</label>
          <input
          type='text'
          id='petName'
          value={petName} 
          className='input-user'
          onChange={onMutate}
          required/>

          <label htmlFor='mensage' className='input-label'>Mensagem</label>
          <textarea
          type='text'
          id='mensage' 
          className='input-message'
          rows='5'
          value={mensage}
          minLength='20'
          maxLength='250'
          onChange={onMutate}
          required/>

          <button type='submit' style={{margin: '20px auto'}} className='btn__btn-primary'>{sendingMesage ? 'Enviando...':'Enviar'}</button>
        </form>
      </main>
    </div>
  )
}

export default Mensagem
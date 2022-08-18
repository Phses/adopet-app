import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'



function Home() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    // Buscar dados no bd do firebase
    const fetchListings = async () => {
      try {
        //Pegar referencia da colecao
        const listingsRef = collection(db,'listings')
        // executar a busca pela ref e nome da colecao e salva a resposta na variavael querySnap
        const querySnap = await getDocs(collection(db, "listings"))
        //Doc.data() acessa o objeto com os dados salvos no db
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        console.log(listings)
        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error('Houve um problema na busca dos items')
      }
    }
    fetchListings()
  },[])
  
  return (
    <div className="container__content fade-in">
      <p className='text-content'>Ola! Veja os amigos disponiveis para adocao!</p>

      {loading ? (<Spinner />) : listings &&listings.length > 0 ? (
        <>
          <main>
            <ul className='availablePets'>
              {listings.map((item) => (
                <ListingItem id={item.id} data={item.data} key={item.id}/>
              ))}
            </ul>
          </main>
          <section className='addPet'>
              <p className='text-content'>Conhece um pet que precise de um lar?</p>
              <button 
              onClick={() => {
                navigate('/create-listing')
              }}
              className='btn__btn-primary'>Adicionar pet</button>
          </section>
        </>) : 
      
      (<p>Nao ha animais disponiveis</p>)}

    </div>
  )
}

export default Home
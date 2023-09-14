import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, startAfter, where, orderBy, getDocs ,limit ,query } from "firebase/firestore"
import { db } from "../../firebase.config" 
import {toast} from 'react-toastify'
import Spinner from "../../components/Spinner/Spinner"
import ListingItem from "../../components/ListingItem/ListingItem"

function Category() {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async ()=> {
            try {
                //get reference
                const listingsRef = collection(db, 'listings')
                
                // set query !!important ...
                const q = query(listingsRef,where('type','==',params.categoryName), orderBy('timestamp','desc'),limit(10))
                
                //execute query 
                const snapQuery = await getDocs(q)

                let listings = []

                snapQuery.forEach((doc) => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
                
            } catch (error) {
                console.log(error)
                toast.error('could not load listings.')
            }
        }
        fetchListings()
    },[params.categoryName])

    return  (
        <div className="category">
            <header className="pageHeader">
                <p>{params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}</p>
            </header>
            {loading ? <Spinner/> 
            : listings && listings.length > 0 ? ( 
            <>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing)=> 
                            <ListingItem 
                            key={listing.id} 
                            listing={listing.data} 
                            id={listing.id}/>
                        )}
                    </ul>
                </main>

            
            
            </>)
            :  <p>there are no listings for {params.categoryName}</p>}
        </div>
    )
}

export default Category

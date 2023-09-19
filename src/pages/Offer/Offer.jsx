import { useEffect, useState } from "react";
import {
  collection,
  startAfter,
  where,
  orderBy,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";
import ListingItem from "../../components/ListingItem/ListingItem";

function Offer() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //get reference
        const listingsRef = collection(db, "listings");

        // set query !!important ...
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //execute query
        const snapQuery = await getDocs(q);

        let listings = [];

        snapQuery.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("could not load offers.");
      }
    };
    fetchListings();
  }, []);

  //load more
  const onFetchMoreListings = async () => {
    try {
      //get reference
      const listingsRef = collection(db, "listings");

      // set query !!important ...
      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      //execute query
      const snapQuery = await getDocs(q);
      const lastVisible = snapQuery.docs[snapQuery.docs.length - 1];

      if (!lastVisible) return toast.error("there are no more listings.");

      lastVisible && setLastFetchedListing(lastVisible);

      let listings = [];

      snapQuery.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevListing) => [...prevListing, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("could not load listings.");
    }
  };

  return (
    <div className='category'>
      <header className='pageHeader'>
        <p>Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          <p className='loadMore' onClick={onFetchMoreListings}>
            Load more
          </p>
        </>
      ) : (
        <p> currrently there are no offers to display</p>
      )}
    </div>
  );
}

export default Offer;

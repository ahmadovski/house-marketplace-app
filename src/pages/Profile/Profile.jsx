import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../../components/ListingItem/ListingItem";
import Spinner from "../../components/Spinner/Spinner";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../../assets/svg/homeIcon.svg";

function Profile() {
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      let listings = [];
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);
      querySnap.docs.forEach((doc) =>
        listings.push({
          id: doc.id,
          data: doc.data(),
        })
      );
      setListings(listings);
    };

    fetchListings();
    setLoading(false);
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in fb
        await updateProfile(auth.currentUser, { displayName: name });
        //update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(" sorry! we could not update the user details");
    }
  };

  const onDelete = async (listingId) => {
    window.confirm("Are you sure?");

    const listingRef = doc(db, "listings", listingId);
    const docSnap = await deleteDoc(listingRef);
    const updatedListing = listings.filter(
      (listing) => listing.id !== listingId
    );
    setListings(updatedListing);
    toast.success("listing deleted successfully");
  };

  if (loading) return <Spinner />;

  return (
    <div className='profile '>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='buttun' className='logOut' onClick={onLogout}>
          {" "}
          logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='personalDetailsText'>Profile Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              change && onSubmit();
              setChange((prevValue) => !prevValue);
            }}
          >
            {change ? "done" : "change"}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              className={change ? "profileNameActive" : "profileName"}
              onChange={onChange}
              value={name}
              id='name'
              disabled={!change}
            />

            <input
              type='text'
              className={change ? "profileEmailActive" : "profileEmail"}
              onChange={onChange}
              value={email}
              id='email'
              disabled={!change}
            />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>sell or rent your home</p>
          <img src={arrowRight} alt='arrow' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;

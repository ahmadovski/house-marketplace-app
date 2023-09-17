import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    offer: false,
    furnished: false,
    address: "",
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    offer,
    furnished,
    address,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();

  const navigate = useNavigate();

  //upload to firebase storage
  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();

      const userCredential = auth.currentUser;
      const fileName = `${userCredential.uid}-${image.name}-${uuidv4()}`;

      const storageRef = ref(storage, `images/` + fileName);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  //submit
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("discounted price should be lower than regular price.");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("sorry ,cant upload more than 6 images");
      return;
    }

    let geolocation = {},
      location;

    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/map/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );
      const data = response.json();
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("please enter a valid address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    //FileList to Array
    const imagesArray = [...images];
    //store all images and get urls
    const imgUrls = await Promise.all(
      imagesArray.map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("could not upload images");
      return;
    });

    //clean up form data for storage
    const formDataCopy = {
      ...formData,
      geolocation,
      location,
      imgUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.address;
    delete formDataCopy.images;
    location && (formDataCopy.location = location);
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    //add doc to db
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("listing added successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  //like onChange
  const onMutate = (e) => {
    //boolean inputs
    let bool = null;
    if (e.target.value === "true" || e.target.value === "false")
      //prettier-ignore
      bool = (e.target.value === "true");

    //text, numbers and booleans
    if (!e.target.files)
      setFormData((prevValue) => ({
        ...prevValue,
        [e.target.id]: bool ?? e.target.value,

        // same as this (if null then do right side)
        // [e.target.id]: (bool !== null ? bool : e.target.value ),
      }));

    //files
    if (e.target.files)
      setFormData((prevValue) => ({
        ...prevValue,
        //prettier-ignore
        [e.target.id]: e.target.files,
      }));
  };
  // const isMounted = true
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({
          ...formData,
          userRef: user.uid,
        });
      } else {
        navigate("/sign-in");
      }
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sale / Rent</label>
          <div className='formButtons'>
            <button
              className={type == "sale" ? "formButtonActive" : "formButton"}
              type='button'
              onClick={onMutate}
              id='type'
              value='sale'
            >
              Sale
            </button>
            <button
              className={type == "rent" ? "formButtonActive" : "formButton"}
              type='button'
              onClick={onMutate}
              id='type'
              value='rent'
            >
              Rent
            </button>
          </div>
          <label className='formLabel'>Name</label>
          <input
            type='text'
            onChange={onMutate}
            className='formInputName'
            maxLength='32'
            minLength='10'
            value={name}
            id='name'
            required
          />
          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                type='number'
                className='formInputSmall'
                value={bedrooms}
                id='bedrooms'
                onChange={onMutate}
                required
                min='1'
                max='50'
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                type='number'
                className='formInputSmall'
                value={bathrooms}
                id='bathrooms'
                onChange={onMutate}
                required
                min='1'
                max='50'
              />
            </div>
          </div>
          <label className='formLabel'>Parking spot</label>
          <div className='fromButtons flex'>
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type='button'
              value={true}
              id='parking'
              onClick={onMutate}
            >
              yes
            </button>
            <button
              className={
                //prettier-ignore
                (!parking && parking !== null) ? "formButtonActive" : "formButton"
              }
              type='button'
              value={false}
              id='parking'
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Furnished</label>
          <div className='fromButtons flex'>
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type='button'
              value={true}
              id='furnished'
              onClick={onMutate}
            >
              yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type='button'
              value={false}
              id='furnished'
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Address</label>
          <input
            type='text'
            className='formInputAddress'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />
          {!geoLocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  type='number'
                  className='formInputSmall'
                  value={latitude}
                  id='latitude'
                  onChange={onMutate}
                />
              </div>

              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  type='number'
                  className='formInputSmall'
                  value={longitude}
                  id='longitude'
                  onChange={onMutate}
                />
              </div>
            </div>
          )}
          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              type='button'
              className={offer ? "formButtonActive" : "formButton"}
              value={true}
              onClick={onMutate}
              id='offer'
            >
              Yes
            </button>
            <button
              type='button'
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              value={false}
              onClick={onMutate}
              id='offer'
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              type='number'
              className='formInputSmall'
              id='regularPrice'
              value={regularPrice}
              required
              onChange={onMutate}
              min='50'
              max='750000000'
            />
            {type === "rent" && <p className='formPriceText'>$/ month</p>}
          </div>
          {offer && (
            <div>
              <label className='formLabel'>Discounted Price</label>
              <div className='formPriceDiv'>
                <input
                  type='number'
                  className='formInputSmall'
                  id='discountedPrice'
                  value={discountedPrice}
                  required
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                />
                {type === "rent" && <p className='formPriceText'>$/ month</p>}
              </div>
            </div>
          )}
          <label className='formLabel'>Upload images</label>
          <input
            type='file'
            // value={images}
            id='images'
            className='formInputFile'
            onChange={onMutate}
            required
            max='6'
            multiple
            accept='.jpg,.png,.jpeg'
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;

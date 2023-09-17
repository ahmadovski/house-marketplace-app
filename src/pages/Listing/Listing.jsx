import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.config";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import shareIcon from "../../assets/svg/shareIcon.svg";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Listing() {
  // when initial state is set to null sometimes we get an error on reloads...idk why
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const navigate = useNavigate();
  const param = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // console.log("try");
        const docRef = doc(db, "listings", param.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
        return;
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("could not load listing.");
        return;
      }
    };

    fetchListing();
  }, [param]);

  const testImageUrl =
    " https://t3.ftcdn.net/jpg/01/62/06/40/360_F_162064034_HI2YEgV7km3HMy0rccQczKH2vvpI4OnB.jpg";

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        scrollbar={{ draggable: true }}
        pagination={{ clickable: true }}
        slidesPerView={1}
      >
        {listing.imgUrls.map((url, index) => {
          // if (url === listing.imgUrls[index]) console.log("its the same");
          return (
            <SwiperSlide key={index}>
              <div className='swiper-container'>
                <div
                  className='swiperSlideDiv'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='share icon' />
      </div>
      {shareLinkCopied && <p className='linkCopied'> Link Copied!</p>}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>

          <p className='listingLocationTitle'>Location</p>

          {/* map */}

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
              className='primaryButton'
            >
              Contact Landlord
            </Link>
          )}
        </ul>
      </div>
    </main>
  );
}

export default Listing;

//

// https://t3.ftcdn.net/jpg/01/62/06/40/360_F_162064034_HI2YEgV7km3HMy0rccQczKH2vvpI4OnB.jpg

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase.config";
import Spinner from "../Spinner/Spinner";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { toast } from "react-toastify";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      let listings = [];

      try {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
        const querySnap = await getDocs(q);
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
          setListing(listings);
          console.log(listings);
          setLoading(false);
          return;
        });
      } catch (error) {
        console.log(error);
        toast.error("could not load listings.");
        setLoading(false);
        return;
      }
    };

    fetchListing();
  }, []);

  if (loading) return <Spinner />;

  return (
    listing && (
      <>
        <p className='exploreHeading'>Recomended</p>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listing.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div className='swiper-container'>
                <div
                  className='swiperSlideDiv'
                  style={{
                    background: `url(${data.imgUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  ${data.discountedPrice ?? data.regularPrice}
                  {data.type === "rent" ? "/ month" : ""}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;

'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ReviewsCarousel({ courseId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem(`course-${courseId}-reviews`) || '[]');
    setReviews(storedReviews);
  }, [courseId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    rtl: true
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-2 top-1/2 z-10 p-2 bg-white rounded-full shadow-md"
      >
        <FaChevronLeft className="text-gray-600" />
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-2 top-1/2 z-10 p-2 bg-white rounded-full shadow-md"
      >
        <FaChevronRight className="text-gray-600" />
      </button>
    );
  }

  return (
    <div className="mt-8 relative">
      <h3 className="text-xl font-semibold mb-6">آراء المتدربين</h3>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">لا توجد تقييمات حتى الآن</p>
      ) : (
        <Slider {...settings} className="px-8">
          {reviews.map((review) => (
            <div key={review.id} className="p-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <FaQuoteRight className="text-2xl text-gray-300 mt-1" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {review.anonymous ? 'مستخدم مجهول' : 'متدرب'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="mt-3 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-300" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
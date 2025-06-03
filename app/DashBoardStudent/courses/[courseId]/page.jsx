"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import CourseHeader from '../../components/CourseHeader';
import RatingSystem from '../../components/RatingSystem';
import ReviewForm from '../../components/ReviewForm';

export default function CourseReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // في الواقع سيكون جلب البيانات من API
    const fetchData = async () => {
      const mockCourse = {
        id: params.id,
        name: "دورة React المتقدمة",
        instructor: "أحمد محمد",
        rating: 4.7,
        totalReviews: 128
      };
      
      const mockReviews = JSON.parse(localStorage.getItem(`course-${params.id}-reviews`)) || [];
      
      setCourse(mockCourse);
      setReviews(mockReviews);
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 mb-6"
      >
        <FiArrowRight className="ml-1" /> العودة إلى الدورة
      </button>

      <CourseHeader 
        title={course.name}
        subtitle={`تقييمات الدورة (${course.totalReviews})`}
      />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-6">
          {/* نموذج إضافة تقييم جديد */}
          <ReviewForm courseId={params.id} />

          {/* قائمة التقييمات */}
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              لا توجد تقييمات حتى الآن
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{review.anonymous ? 'مستخدم مجهول' : 'متدرب'}</h4>
                      <div className="flex items-center mt-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={i < review.rating ? 'fill-current' : ''} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4">
            <h3 className="text-xl font-bold mb-4">التقييم العام</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl font-bold mr-4">{course.rating}</div>
              <div>
                <RatingSystem 
                  courseId={params.id} 
                  initialRating={course.rating} 
                  editable={false}
                  size={24}
                />
                <div className="text-gray-500 mt-1">
                  {course.totalReviews} تقييم
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center">
                  <div className="w-10 text-gray-600">{stars}</div>
                  <FiStar className="text-yellow-500 mx-2" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${(stars / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
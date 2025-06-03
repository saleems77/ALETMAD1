'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiStar, FiClock, FiFilter, FiEye,
  FiMessageCircle, FiShare2, FiUser,
  FiUsers, FiFileText, FiShoppingCart,
  FiPercent, FiHeart, FiChevronUp,
  FiChevronDown, FiPlay, FiVideo,
  FiBookOpen, FiDollarSign, FiTag,
  FiArrowLeft, FiInfo, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { checkAuth } from '@/store/slices/authSlice';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const colors = {
  primary: '#008DCB',
  secondary: '#0D1012',
  danger: '#E2101E',
  gray: '#999999',
  lightGray: '#F5F5F5',
};
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <path d="M0 0h48v1H0z" fill="rgba(209,213,219,0.3)" transform="translate(0 0.5)" />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
const DetailItem = ({ icon, label, value, multiLine = false }) => (
  <div className="flex gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      {multiLine ? (
        <div className="text-sm text-gray-700 whitespace-pre-line">{value}</div>
      ) : (
        <div className="text-sm text-gray-700">{value}</div>
      )}
    </div>
  </div>
);

const CourseCard = ({
  course,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onHover,
  onHoverEnd,
  colors,
  t,
  language
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={onViewDetails}
    >
      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        {course.coverImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${course.coverImage?.url}`}
            alt={course.courseName}
            width={400}
            height={300}
            className="object-cover w-full h-full"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`}
            unoptimized={process.env.NODE_ENV !== 'production'} // أضف هذا السطر للتطوير المحلي
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <FiBookOpen className="text-3xl text-gray-400" />
          </div>
        )}

        {/* Course Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {course.isFree && (
            <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs">
              {t?.courses?.free}
            </span>
          )}
          {course.hasEntryTest && (
            <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs">
              {t?.courses?.entryTest}
            </span>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold" style={{ color: colors.secondary }}>
            {course.courseName}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(course.id);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiHeart className={`text-xl ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-2 mb-4">
          <FiUser className="text-gray-500" />
          <span className="text-sm" style={{ color: colors.gray }}>
            {course.instructor}
          </span>
        </div>

        {/* Course Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" />
            <span style={{ color: colors.gray }}>4.8 (1.2k)</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-gray-500" />
            <span style={{ color: colors.gray }}>{course.studentsEnrolled}+</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {course.isFree ? (
              <span className="text-lg font-bold" style={{ color: colors.primary }}>
                {t?.courses?.free}
              </span>
            ) : (
              <>
                <span className="text-lg font-bold" style={{ color: colors.primary }}>
                  ${course.price.toFixed(2)}
                </span>
                <span className="line-through text-gray-400">${(course.price * 1.2).toFixed(2)}</span>
              </>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            <FiShoppingCart />
            {course.isFree ? t?.courses?.enrollNow : t?.courses?.buyNow}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CoursesPage = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { user, isAuthenticated, jwt } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, tracksRes] = await Promise.all([
          axios.get(`${API_URL}/courses`, {
            params: {
              populate: {
                coverImage: '*',
                track: '*',
                users_permissions_user: '*',
                videos: '*',
                entry_test: '*'
              }
            }
          }),
          axios.get(`${API_URL}/tracks`)
        ]);

        const formattedCourses = coursesRes.data.data.map(course => ({
          id: course.id,
          ...course,
          courseName: course.courseName || 'لا يوجد اسم',

          track: course.track?.data || null,
          coverImage: course.coverImage || null,
          studentsEnrolled: course.studentsEnrolled || 0,
          duration: course.duration || 0,
          price: parseFloat(course.price) || 0,
          instructor: course.users_permissions_user?.username || 'Unknown Instructor',
        }));

        setCourses(formattedCourses);
       setTracks(tracksRes.data.data.map(track => ({
  id: track.id,
  name: track.name || 'غير محدد',
  numOfCourse: track.numOfCourse || 0
}))); setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('courseFavorites') || '[]');
    setFavorites(saved);
    
  }, []);

  const handleCourseHover = (course, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: language === 'ar' ? rect.right + 20 : rect.left - 320,
      y: rect.top
    });
    setHoveredCourse(course);
  };

  const toggleFavorite = (courseId) => {
    setFavorites(prev => {
      const next = prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId];
      localStorage.setItem('courseFavorites', JSON.stringify(next));
      return next;
    });
  };

  const filteredCourses = courses.filter(course =>
  (!selectedTrack || course.track?.name === selectedTrack) &&
  (
    course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  )
);

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return b.studentsEnrolled - a.studentsEnrolled;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 text-red-500">
      {t?.courses?.errorLoading} {error}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
    >
      {/* Search and Filters Section */}
      <div className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/3 relative">
              <input
                type="text"
                placeholder={t?.courses?.searchPlaceholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#008DCB] bg-white text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl transition-colors"
                  style={{
                    backgroundColor: showFilters ? colors.primary : colors.lightGray,
                    color: showFilters ? colors.white : colors.secondary
                  }}
                >
                  <FiFilter className="text-lg" />
                  {t?.courses?.filters}
                  {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-4 min-w-[300px]"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
                            {t?.courses?.trackLabel}
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#008DCB]"
                            style={{ borderColor: colors.gray }}
                            value={selectedTrack || ''}
                            onChange={(e) => setSelectedTrack(e.target.value || null)}
                          >
                            <option value="">{t?.courses?.allTracks}</option>
                            {tracks.map(track => (
                              <option key={track.name} value={track.name}>
                                {track.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
                            {t?.courses?.sortBy}
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#008DCB]"
                            style={{ borderColor: colors.gray }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                          >
                            <option value="popularity">{t?.courses?.sortOptions?.popularity}</option>
                            <option value="price">{t?.courses?.sortOptions?.price}</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide w-full">
            {tracks.map(track => (
              <button
    key={track.id}
                onClick={() => setSelectedTrack(
                  selectedTrack === track.name ? null : track.name
                )}
                className={`flex-shrink-0 px-6 py-3 rounded-full mx-2 transition-colors ${selectedTrack === track.name
                  ? 'bg-[#008DCB] text-white'
                  : 'bg-[#F5F5F5] text-[#0D1012] hover:bg-[#008DCB]/20'
                  }`}
              >
                <span className="block text-sm font-medium">{track.name}</span>
                <span className="text-xs text-gray-500">{track.numOfCourse}+ {t?.courses?.courses}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">{t?.courses?.results}:</span>
            <span className="font-medium" style={{ color: colors.primary }}>
              {sortedCourses.length} {t?.courses?.courses}
            </span>
          </div>
          <div className="relative">
            <select
              className="bg-white pl-4 pr-8 py-2.5 rounded-lg border-2 border-gray-200 appearance-none focus:outline-none focus:border-[#008DCB]"
              style={{ borderColor: colors.gray }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">{t?.courses?.sortOptions?.popularity}</option>
              <option value="price">{t?.courses?.sortOptions?.price}</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isFavorite={favorites.includes(course.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={() => setSelectedCourse(course)}
              onHover={(e) => handleCourseHover(course, e)}
              onHoverEnd={() => setHoveredCourse(null)}
              colors={colors}
              t={t}
              language={language}
            />
          ))}
        </div>

        {/* Hover Preview */}
        <AnimatePresence>
          {hoveredCourse && (
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
              className="fixed z-50 bg-white shadow-2xl rounded-xl p-4 w-80"
              style={{
                left: `${previewPosition.x}px`,
                top: `${previewPosition.y}px`,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.secondary }}>
                {hoveredCourse.courseName}
              </h3>
              <div className="space-y-3">
                <DetailItem
                  icon={<FiInfo style={{ color: colors.primary }} />}
                  label={t?.courses?.requirements}
                  value={hoveredCourse.requirements}
                  multiLine
                />
                <DetailItem
                  icon={<FiUsers style={{ color: colors.primary }} />}
                  label={t?.courses?.targetAudience}
                  value={hoveredCourse.targetAudience}
                />
                <DetailItem
                  icon={<FiClock style={{ color: colors.primary }} />}
                  label={t?.courses?.duration}
                  value={`${hoveredCourse.duration} ${t?.courses?.hours}`}
                />
                <DetailItem
                  icon={<FiFileText style={{ color: colors.primary }} />}
                  label={t?.courses?.learningObjectives}
                  value={hoveredCourse.learningObjectives}
                  multiLine
                />
                <DetailItem
                  icon={<FiVideo style={{ color: colors.primary }} />}
                  label={t?.courses?.videos}
                  value={hoveredCourse.videos?.length || 0}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {sortedCourses.length === 0 && (
          <div className="text-center py-12" style={{ color: colors.gray }}>
            <div className="text-2xl mb-4">😞 {t?.courses?.noResults}</div>
            <button
              onClick={() => {
                setSelectedTrack(null);
                setSearchQuery('');
              }}
              className="hover:underline"
              style={{ color: colors.primary }}
            >
              {t?.courses?.resetFilters}
            </button>
          </div>
        )}

        {/* Course Details Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="mb-6 hover:text-[#008DCB] transition-colors"
                style={{ color: colors.secondary }}
              >
                <FiArrowLeft className="text-2xl" />
              </button>
              <div className="space-y-6">
                <div className="relative h-64 rounded-xl overflow-hidden">
                  {selectedCourse.coverImage?.attributes?.url ? (
                    <Image
                      src={`${API_URL}${selectedCourse.coverImage.attributes.url}`}
                      alt={selectedCourse.courseName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <FiBookOpen className="text-3xl text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                  {selectedCourse.courseName}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                      <FiUser className="w-full h-full p-2 text-gray-500" />
                    </div>
                    <span className="font-medium" style={{ color: colors.secondary }}>
                      {selectedCourse.instructor}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DetailItem
                    icon={<FiClock style={{ color: colors.primary }} />} // Ensure this is closed with />
                    label={t?.courses?.duration} // This line now works if optional chaining is supported
                  />
                  <DetailItem
                    icon={<FiUsers style={{ color: colors.primary }} />}
                    label={t && t.courses && t.courses.students}
                    value={selectedCourse.studentsEnrolled}
                  />
                  <DetailItem
                    icon={<FiTag style={{ color: colors.primary }} />}
                    label={t && t.courses && t.courses.level}
                    value={selectedCourse.targetAudience}
                  />
                </div>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>
                    {t?.courses?.learningObjectives}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {selectedCourse.learningObjectives}
                  </p>
                </div>
                <div className="sticky bottom-0 bg-white pt-6 border-t" style={{ borderColor: colors.lightGray }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${selectedCourse.isFree ? 'text-[#008DCB]' : ''}`}>
                        {selectedCourse.isFree ? t?.courses?.free : `$${selectedCourse.price.toFixed(2)}`}
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                      style={{ backgroundColor: colors.primary, color: colors.white }}
                    >
                      <FiShoppingCart />
                      {selectedCourse.isFree ? t?.courses?.enrollNow : t?.courses?.subscribeNow}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        style={{ backgroundColor: colors.primary, color: colors.white }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiChevronUp className="text-2xl" />
      </motion.button>
    </div>
  );
};

export default CoursesPage;
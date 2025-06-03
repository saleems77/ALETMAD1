// app/courses/manage/[id]/page.jsx
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  TrashIcon, 
  PencilIcon, 
  VideoCameraIcon, 
  DocumentIcon, 
  BookOpenIcon, 
  ClockIcon,
  PlayIcon,PlusIcon 
} from '@heroicons/react/24/outline';

// نظام الألوان حسب النسب المحددة
const colors = {
  primary: {
    blue: '#008DCB',
    red: '#E2101E',
    yellow: '#F9D011'
  },
  neutral: {
    black: '#0D1012',
    gray: '#999999',
    white: '#FFFFFF'
  }
};

const CourseManagement = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${id}?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
          }
        );
        setCourse(response.data.data);
      } catch (error) {
        toast.error('فشل في تحميل بيانات الدورة');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEdit = (section) => {
    router.push(`/courses/edit/${id}?section=${section}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );
      toast.success('تم حذف الدورة بنجاح');
      router.push('/mycourses');
    } catch (error) {
      toast.error('فشل في حذف الدورة');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.neutral.white }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary.blue }}></div>
    </div>
  );

  if (!course) return (
    <div className="text-center py-8" style={{ color: colors.primary.red, backgroundColor: colors.neutral.white }}>
      <BookOpenIcon className="w-12 h-12 mx-auto mb-4" />
      <p className="text-xl font-semibold">لم يتم العثور على الدورة المطلوبة</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.neutral.white }}>
      {/* شريط الإجراءات العلوي */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 py-4 px-6 flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium"
          style={{ color: colors.primary.blue }}
        >
          &larr; العودة للقائمة
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => handleEdit('general')}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-md"
            style={{ 
              backgroundColor: colors.primary.blue,
              color: colors.neutral.white
            }}
          >
            <PencilIcon className="w-5 h-5" />
            تعديل الدورة
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-md"
            style={{ 
              backgroundColor: colors.primary.red,
              color: colors.neutral.white
            }}
          >
            <TrashIcon className="w-5 h-5" />
            حذف الدورة
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-xl" style={{ backgroundColor: colors.neutral.white, border: `2px solid ${colors.neutral.gray}20` }}>
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary.blue }}>
            <BookOpenIcon className="w-8 h-8" style={{ color: colors.neutral.white }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.neutral.black }}>
              {course.courseName}
            </h1>
            <p className="text-sm mt-2" style={{ color: colors.neutral.gray }}>
              آخر تحديث: {new Date(course.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* بطاقات المعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <InfoCard 
            icon={<ClockIcon className="w-6 h-6" />}
            title="تاريخ الإنشاء"
            value={new Date(course.createdAt).toLocaleDateString()}
            color={colors.primary.blue}
          />
          <InfoCard 
            icon={<PlayIcon className="w-6 h-6" />}
            title="عدد الفيديوهات"
            value={course.videos.length}
            color={colors.primary.yellow}
          />
          <InfoCard 
            icon={<DocumentIcon className="w-6 h-6" />}
            title="عدد المرفقات"
            value={course.attachments.length}
            color={colors.primary.red}
          />
        </div>

        {/* أقسام المحتوى */}
        <ContentSection 
          title="فيديوهات الدورة"
          icon={<VideoCameraIcon className="w-6 h-6" />}
          color={colors.primary.blue}
          onEdit={() => handleEdit('videos')}
        >
          {course.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.videos.map((video) => (
                <VideoCard 
                  key={video.id}
                  video={video}
                  onPreview={() => setSelectedVideo(video)}
                  onEdit={() => handleEdit(`video-${video.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="لا توجد فيديوهات مضافة"
              action={() => handleEdit('videos')}
              actionText="إضافة فيديو"
            />
          )}
        </ContentSection>

        <ContentSection 
          title="المرفقات"
          icon={<DocumentIcon className="w-6 h-6" />}
          color={colors.primary.blue}
          onEdit={() => handleEdit('attachments')}
        >
          {course.attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.attachments.map((attachment) => (
                <AttachmentCard 
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="لا توجد مرفقات مضافة"
              action={() => handleEdit('attachments')}
              actionText="إضافة مرفق"
            />
          )}
        </ContentSection>

        {/* الأقسام النصية */}
        <TextSection 
          title="أهداف التعلم"
          content={course.learningObjectives}
          onEdit={() => handleEdit('objectives')}
        />
        
        <TextSection 
          title="المتطلبات الأساسية"
          content={course.requirements}
          onEdit={() => handleEdit('requirements')}
        />
        
        <TextSection 
          title="الجمهور المستهدف"
          content={course.targetAudience}
          onEdit={() => handleEdit('audience')}
        />

        {/* نافذة معاينة الفيديو */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <video 
                controls 
                className="w-full rounded-lg"
                src={selectedVideo.url}
              />
            </div>
          </div>
        )}

        {/* نافذة تأكيد الحذف */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3>
              <p className="mb-6">هل أنت متأكد من رغبتك في حذف هذه الدورة بشكل دائم؟</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: colors.primary.red }}
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// المكونات المساعدة
const InfoCard = ({ icon, title, value, color }) => (
  <div className="p-6 rounded-xl flex items-center gap-4" style={{ backgroundColor: color + '10', border: `1px solid ${color}20` }}>
    <div className="p-3 rounded-lg" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm" style={{ color: colors.neutral.gray }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: colors.neutral.black }}>{value}</p>
    </div>
  </div>
);

const ContentSection = ({ title, icon, children, color, onEdit }) => (
  <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: colors.neutral.white, border: `1px solid ${color}20` }}>
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div style={{ color: color }}>{icon}</div>
        <h2 className="text-xl font-bold" style={{ color: colors.neutral.black }}>{title}</h2>
      </div>
      <button 
        onClick={onEdit}
        className="flex items-center gap-2 text-sm"
        style={{ color: colors.primary.blue }}
      >
        <PencilIcon className="w-4 h-4" />
        تعديل
      </button>
    </div>
    {children}
  </div>
);

const VideoCard = ({ video, onPreview, onEdit }) => (
  <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative aspect-video bg-gray-100 cursor-pointer" onClick={onPreview}>
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayIcon className="w-12 h-12 text-white opacity-75" />
      </div>
     
    </div>
    <div className="p-4">
      <h3 className="font-medium mb-2" style={{ color: colors.neutral.black }}>
        {video.title}
      </h3>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm" style={{ color: colors.neutral.gray }}>
          <ClockIcon className="w-4 h-4" />
          <span>{video.duration} دقيقة</span>
        </div>
        <button 
          onClick={onEdit}
          className="text-sm flex items-center gap-1"
          style={{ color: colors.primary.blue }}
        >
          <PencilIcon className="w-4 h-4" />
          تعديل
        </button>
      </div>
    </div>
  </div>
);

const AttachmentCard = ({ attachment }) => (
  <div className="p-4 rounded-lg border flex items-center justify-between hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-3">
      <DocumentIcon className="w-6 h-6" style={{ color: colors.primary.blue }} />
      <div>
        <h3 className="font-medium" style={{ color: colors.neutral.black }}>
          {attachment.name}
        </h3>
        <p className="text-sm" style={{ color: colors.neutral.gray }}>
        </p>
      </div>
    </div>
    <a
      download
      className="text-sm px-3 py-1 rounded-md transition-colors"
      style={{ 
        backgroundColor: colors.primary.blue,
        color: colors.neutral.white 
      }}
    >
      تحميل
    </a>
  </div>
);

const TextSection = ({ title, content, onEdit }) => (
  <div className="mb-6 p-6 rounded-xl border">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold" style={{ color: colors.neutral.black }}>{title}</h3>
      <button 
        onClick={onEdit}
        className="text-sm flex items-center gap-1"
        style={{ color: colors.primary.blue }}
      >
        <PencilIcon className="w-4 h-4" />
        تعديل
      </button>
    </div>
    <div className="prose max-w-none" style={{ color: colors.neutral.gray }}>
      {content}
    </div>
  </div>
);

const EmptyState = ({ message, action, actionText }) => (
  <div className="text-center py-8 rounded-lg border-2 border-dashed">
    <p className="mb-4" style={{ color: colors.neutral.gray }}>{message}</p>
    <button
      onClick={action}
      className="px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
      style={{ 
        backgroundColor: colors.primary.blue,
        color: colors.neutral.white 
      }}
    >
      <PlusIcon className="w-4 h-4" />
      {actionText}
    </button>
  </div>
);

// دالة مساعدة لاستخراج YouTube ID


export default CourseManagement;
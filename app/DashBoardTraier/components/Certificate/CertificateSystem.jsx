"use client"
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  FormControlLabel,
  Checkbox,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Skeleton,
  Modal
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PictureAsPdf,
  ShoppingCart,
  CheckCircle,
  MonetizationOn,
  Search,
  FilterList,
  DateRange,
  Close,
  Download,
  Share,
  Visibility,
  LinkedIn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import qs from 'qs';

// ثيم مخصص
const themeColors = {
  primary: '#008DCB',
  secondary: '#0D1012',
  error: '#E2101E',
  warning: '#F9D011',
  info: '#999999',
  success: '#4CAF50',
  background: '#FFFFFF',
};

// ستايلات مخصصة
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
  },
}));

const PreviewModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .modal-content': {
    backgroundColor: themeColors.background,
    padding: theme.spacing(4),
    borderRadius: '16px',
    width: '80%',
    maxWidth: '800px',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
}));

export default function CertificateSystem({ courseId, courseName, onBackToCourses }) {
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
const [isDeleting, setIsDeleting] = useState(null); // تخزين ID الشهادة المحذوفة

  // حالة النموذج
  const [openDialog, setOpenDialog] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editData, setEditData] = useState(null);
  
  // بيانات الشهادة
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    instructorShare: '',
    duration: '30 يوم',
    content: '',
    isDefault: false
  });
  
  // تصفية البيانات
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  
  // حالة الإشعارات
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // حالة التحميل
  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState(null);
  const [purchasedCertificates, setPurchasedCertificates] = useState([]);
  const [purchasedLoading, setPurchasedLoading] = useState(true);
const [isDownloading, setIsDownloading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // تحميل بيانات الكورس والشهادات
  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token || !courseId) return;
      
      // جلب بيانات الكورس مع الشهادات
      const query = qs.stringify({
        populate: ['certificates']
      }, { encodeValuesOnly: true });
      
      const response = await fetch(`${API_URL}/courses/${courseId}?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('فشل جلب بيانات الكورس');
      const data = await response.json();
      
      // تحديث بيانات الكورس
      const courseData = {
        id: data.documentId,
        title: data.courseName,
        price: data.price || 0,
        image: data.coverImage?.url || 'https://source.unsplash.com/random/800x600?web',
        students: data.participants?.length || 0,
        certificates: data.certificates?.data?.map(cert => ({
          id: cert.documentId,
          ...cert
        })) || []
      };
      
      setCourseDetails(courseData);
      setLoading(false);
    } catch (err) {
      console.error('خطأ في جلب بيانات الكورس:', err);
      setLoading(false);
    }
  };

  // جلب الشهادات المشتراة
  const fetchPurchasedCertificates = async () => {
    try {
          setPurchasedLoading(true); // تفعيل مؤشر التحميل
      const token = localStorage.getItem("jwt");
      if (!token || !courseId) return;
      
      // الفلترة حسب الدورة
      const query = qs.stringify({
        filters: {
          course: { documentId: { $eq: courseId } }
        }
      }, { encodeValuesOnly: true });
      
      const response = await fetch(`${API_URL}/certificates?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('فشل جلب الشهادات المشتراة');
      const data = await response.json();
      
      // تحديث البيانات
      setPurchasedCertificates(data.data.map(cert => ({
        id: cert.documentId,
        courseId: courseId,
        date: cert.publishedAt || new Date().toISOString(),
        status: 'مكتمل',
        paymentMethod: 'بطاقة ائتمان',
        transactionId: `TX${Math.floor(Math.random() * 1000000)}`,
        certificateUrl: '#',  
        ...cert
      })));
    } catch (err) {
      console.error('خطأ في جلب الشهادات المشتراة:', err);
    }finally {
    setPurchasedLoading(false); // إيقاف مؤشر التحميل
  }
  };

  useEffect(() => {
    fetchCourseData();
    fetchPurchasedCertificates();
  }, [courseId]);

  // معاينة الشهادة
  const handlePreviewOpen = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewOpen(true);
  };

  // توليد PDF للشهادة
  const generatePdf = async (content, studentName = 'الطالب') => {
    try {
          setIsDownloading(true); // تفعيل مؤشر التحميل

      // استبدال اسم الطالب في المحتوى
      const personalizedContent = content.replace(/\[الاسم\]/g, studentName);
      
      // إنشاء عنصر مؤقت لعرض المحتوى
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = personalizedContent;
      document.body.appendChild(tempDiv);
      
      // تحويل HTML إلى صورة
      const canvas = await html2canvas(tempDiv);
      const imgData = canvas.toDataURL('image/png');
      
      // إنشاء PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentName}-شهادة.pdf`);
      
      // إزالة العنصر المؤقت
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error('خطأ في إنشاء PDF:', err);
      setSnackbar({ 
        open: true, 
        message: 'فشل إنشاء الشهادة', 
        severity: 'error' 
      });
    }finally {
    setIsDownloading(false); // إيقاف مؤشر التحميل
    document.body.removeChild(tempDiv);
  }
  };

  // تحميل الشهادة كملف HTML
  const handleDownload = (certificate) => {
    const blob = new Blob([certificate.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // مشاركة على لينكدإن
  const handleShareLinkedIn = (certificate) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(certificate.name)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // إدارة النموذج
  // إدارة النموذج - fixed version
// إدارة النموذج - fixed version
const handleDialogOpen = (isDefaultCertificate = false, certificate = null) => {
  const defaultContent = `
    <div style="text-align: center; padding: 2rem; border: 2px solid #008DCB; border-radius: 16px;"> 
      <h1 style="color: #008DCB;">شهادة إتمام الدورة</h1>
      <p style="font-size: 1.2rem;">تم منح هذه الشهادة لـ [الاسم]</p>
      <p style="font-size: 1.1rem;">في دورة ${courseName}</p>
      <div style="margin: 2rem 0;">
        <img src="https://source.unsplash.com/random/200x200?badge" 
             alt="شعار" 
             style="width: 150px; height: 150px;"/>
      </div>
      <div style="display: flex; justify-content: space-around; margin-top: 2rem;">
        <div>
          <p>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
          <p>رقم الشهادة: CERT-${Date.now()}</p>
        </div>
      </div>
    </div>
  `;
  
  if (certificate) {
    // عند تعديل شهادة موجودة
    setEditData(certificate);
    
    // تهيئة بيانات النموذج ببيانات الشهادة
    setFormData({
      name: certificate.name || '',
      price: certificate.price !== undefined && certificate.price !== null ? certificate.price.toString() : '',
      instructorShare: certificate.instructorShare !== undefined && certificate.instructorShare !== null ? certificate.instructorShare.toString() : '',
      duration: certificate.duration || '30 يوم',
      content: certificate.content || defaultContent,
      isDefault: certificate.isDefault || false
    });
  } else {
    // عند إنشاء شهادة جديدة
    setEditData(null);
    
    // تهيئة بيانات النموذج حسب نوع الشهادة (الافتراضية أو الاختيارية)
    setFormData({ 
      name: '', 
      price: isDefaultCertificate ? '0' : '', 
      instructorShare: '',
      duration: '30 يوم',
      content: defaultContent,
      isDefault: isDefaultCertificate
    });
  }
  
  setOpenDialog(true);
};
// إرسال النموذج (إضافة/تعديل شهادة) - fixed version
// تعديل بيانات الشهادة - fixed version
const handleSubmit = async () => {
  try {
        setIsSubmitting(true); // تفعيل مؤشر التحميل

    const token = localStorage.getItem("jwt");
    if (!token || !courseId) throw new Error('بيانات غير كافية');
    
    // التأكد من أن السعر يكون 0 للشهادة الافتراضية
    const finalData = {
      ...formData,
      price: formData.isDefault ? 0 : parseFloat(formData.price) || 0,
      instructorShare: parseFloat(formData.instructorShare) || 70
    };
    
    const certificateData = {
      data: {
        ...finalData,
        course: courseId  // ربط الشهادة بالدورة
      }
    };
    
    // استخدام المسار الصحيح مع "/api/"
    const endpoint = editData 
      ? `${API_URL}/certificates/${editData.documentId}` 
      : `${API_URL}/certificates`;
    const method = editData ? 'PUT' : 'POST';
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(certificateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(editData ? 
        `فشل تحديث الشهادة: ${errorData.error?.message || response.statusText}` : 
        `فشل إضافة الشهادة: ${errorData.error?.message || response.statusText}`
      );
    }
    
    const result = await response.json();
    
    // تحديث بيانات الكورس بعد العملية
    if (editData) {
      setCourseDetails({
        ...courseDetails,
        certificates: courseDetails.certificates.map(c => 
          c.id === editData.id ? result.data : c
        )
      });
    } else {
      setCourseDetails({
        ...courseDetails,
        certificates: [...courseDetails.certificates, result.data]
      });
    }
    
    // إظهار رسالة نجاح
    setSnackbar({ 
      open: true, 
      message: editData ? 'تم تحديث الشهادة بنجاح' : 'تم إضافة الشهادة بنجاح',
      severity: 'success'
    });
    
    setOpenDialog(false);
  } catch (err) {
    console.error(editData ? 'خطأ في تحديث الشهادة:' : 'خطأ في إضافة الشهادة:', err);
    setSnackbar({ 
      open: true, 
      message: editData ? 'فشل تحديث الشهادة' : 'فشل إضافة الشهادة',
      severity: 'error'
    });
  }finally {
    setIsSubmitting(false); // إيقاف مؤشر التحميل
  }
};
  // حذف شهادة
  const handleDelete = async (certificateId) => {
    try {
          setIsDeleting(certificateId); // تفعيل مؤشر التحميل للشهادة المحددة

      const token = localStorage.getItem("jwt");
      if (!token || !certificateId) throw new Error('بيانات غير كافية');
      
      const response = await fetch(`${API_URL}/certificates/${certificateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل حذف الشهادة');
      
      // تحديث قائمة الشهادات
      setCourseDetails({
        ...courseDetails,
        certificates: courseDetails.certificates.filter(c => c.id !== certificateId)
      });
      
      setSnackbar({ 
        open: true, 
        message: 'تم حذف الشهادة بنجاح',
        severity: 'success'
      });
    } catch (err) {
      console.error('خطأ في حذف الشهادة:', err);
      setSnackbar({ 
        open: true, 
        message: 'فشل حذف الشهادة',
        severity: 'error'
      });
    }finally {
    setIsDeleting(null); // إيقاف مؤشر التحميل
  }
  };

  // حساب نسبة المنصة
  const calculatePlatformShare = (price, instructorShare) => {
    return price * (100 - instructorShare) / 100;
  };

  // التصفية
  const filteredCertificates = courseDetails?.certificates?.filter(cert =>
    cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cert.content?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // مكون مساعد لعرض الشهادة
  const CertificateItem = ({ certificate, isMobile, handleDialogOpen, handleDelete, handlePreviewOpen }) => (
  <Paper key={certificate.id} sx={{ 
    mb: 2, 
    p: 2, 
    borderRadius: '12px', 
    border: `1px solid ${themeColors.info}20`, 
    backgroundColor: themeColors.background,
    boxShadow: certificate.isDefault ? '0 0 0 2px #e3f2fd' : 'none' 
  }}>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 2,
      backgroundColor: certificate.isDefault ? '#e3f2fd' : 'transparent',
      p: 1,
      borderRadius: 1
    }}>
      <Box>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          color: themeColors.secondary 
        }}>
          {certificate.name}
        </Typography>
        <Typography variant="caption" sx={{ 
          color: themeColors.info 
        }}>
          {certificate.isDefault ? 'شهادة افتراضية' : 'شهادة إضافية'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          onClick={() => handleDialogOpen(certificate.isDefault, certificate)} 
          sx={{ color: themeColors.primary }}
        >
          <Edit />
        </IconButton>
        <IconButton 
  onClick={() => handleDelete(certificate.id)} 
  disabled={isDeleting === certificate.id} // تعطيل الزر أثناء الحذف
  sx={{ color: themeColors.error }}
>
  {isDeleting === certificate.id ? (
    <CircularProgress size={24} color="inherit" /> // مؤشر التحميل
  ) : (
    <Delete />
  )}
</IconButton>
      </Box>
    </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '8px', 
            backgroundColor: themeColors.success + '10', 
            textAlign: 'center' 
          }}>
            <Typography variant="caption" sx={{ 
              color: themeColors.info, 
              display: 'block', 
              mb: 0.5 
            }}>
              نسبة المدرب
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              color: themeColors.success, 
              fontWeight: 700 
            }}>
              {certificate.instructorShare || 70}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '8px', 
            backgroundColor: themeColors.info + '10', 
            textAlign: 'center' 
          }}>
            <Typography variant="caption" sx={{ 
              color: themeColors.info, 
              display: 'block', 
              mb: 0.5 
            }}>
              السعر
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              color: themeColors.info, 
              fontWeight: 700 
            }}>
              {certificate.price !== undefined && certificate.price !== null ? certificate.price : 0}$
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        {!certificate.isDefault && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            sx={{ 
              backgroundColor: themeColors.primary, 
              color: themeColors.background, 
              borderRadius: '8px', 
              py: 1, 
              '&:hover': { backgroundColor: '#006699' }  
            }}
          >
            شراء الشهادة (${certificate.price !== undefined && certificate.price !== null ? certificate.price : 49})
          </Button>
        )}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Visibility />}
          sx={{ 
            borderColor: themeColors.info, 
            color: themeColors.secondary, 
            borderRadius: '8px', 
            py: 1 
          }}
          onClick={() => handlePreviewOpen(certificate)}
        >
          معاينة الشهادة
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      backgroundColor: themeColors.background, 
      minHeight: '100vh' 
    }}>
      {/* معاينة الشهادة */}
      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <div className="modal-content">
          <IconButton
            sx={{ position: 'absolute', right: 16, top: 16 }}
            onClick={() => setPreviewOpen(false)}
          >
            <Close />
          </IconButton>
          {selectedCertificate && (
            <div dangerouslySetInnerHTML={{ __html: selectedCertificate.content }} />
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => generatePdf(selectedCertificate.content, user?.username)}
                disabled={isDownloading} // تعطيل الزر أثناء التحميل
  endIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : null} // مؤشر التحميل

              sx={{ backgroundColor: themeColors.primary }}
            >
              تنزيل PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<LinkedIn />}
              sx={{ backgroundColor: '#0077B5' }} 
              onClick={() => handleShareLinkedIn(selectedCertificate)}
            >
              مشاركة على لينكدإن
            </Button>
          </Box>
        </div>
      </PreviewModal>

      {/* شريط التحكم */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 2, 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: themeColors.secondary,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CheckCircle sx={{ color: themeColors.primary, fontSize: '2.5rem' }} />
          نظام إدارة الشهادات
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن شهادة..."
            InputProps={{ startAdornment: <Search sx={{ color: themeColors.info, mr: 1 }} /> }}
            sx={{ 
              width: isMobile ? '100%' : 300, 
              '& .MuiOutlinedInput-root': { borderRadius: '12px' } 
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ 
              borderRadius: '12px', 
              px: 3, 
              backgroundColor: themeColors.primary, 
              '&:hover': { backgroundColor: '#006699' } 
            }}
            onClick={() => handleDialogOpen()}
          >
            إضافة شهادة إلى الدورة
          </Button>
        </Box>
      </Box>

      {/* قائمة الدورة */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        ) : courseDetails ? (
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3, 
                  position: 'relative' 
                }}>
                  <Avatar 
                    src={courseDetails.image} 
                    variant="rounded"
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '12px', 
                      boxShadow: 2 
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: themeColors.secondary 
                    }}>
                      {courseDetails.title}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mt: 0.5 
                    }}>
                      <Chip 
                        label={`السعر: ${courseDetails.price} $`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: themeColors.warning,
                          color: themeColors.background,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          padding: 1
                        }} 
                      />
                      <Box sx={{ 
                        color: themeColors.info, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5 
                      }}>
                        <DateRange fontSize="small" /> {courseDetails.students} طالب
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* قسم الشهادات الافتراضية */}
                <Typography variant="h6" sx={{ 
                  mt: 3, 
                  mb: 2, 
                  color: themeColors.primary,
                  fontWeight: 700,
                  borderBottom: `2px solid ${themeColors.primary}`,
                  pb: 1
                }}>
                  <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  الشهادة الافتراضية (مضمنة في سعر الكورس)
                </Typography>
                
                {filteredCertificates.filter(c => c.isDefault).length > 0 ? (
                  filteredCertificates
                    .filter(c => c.isDefault)
                    .map((certificate) => (
                      <CertificateItem 
                        key={certificate.id} 
                        certificate={certificate} 
                        isMobile={isMobile}
                        handleDialogOpen={handleDialogOpen}
                        handleDelete={handleDelete}
                        handlePreviewOpen={handlePreviewOpen}
                      />
                    ))
                ) : (
                  <Paper sx={{ 
                    p: 2, 
                    mb: 3, 
                    textAlign: 'center',
                    backgroundColor: themeColors.info + '10',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="body2" sx={{ color: themeColors.info }}>
                      لا توجد شهادة افتراضية لهذه الدورة
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleDialogOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      إضافة شهادة افتراضية
                    </Button>
                  </Paper>
                )}

                {/* قسم الشهادات الإضافية */}
                <Typography variant="h6" sx={{ 
                  mt: 4, 
                  mb: 2, 
                  color: themeColors.primary,
                  fontWeight: 700,
                  borderBottom: `2px solid ${themeColors.primary}`,
                  pb: 1
                }}>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  شهادات إضافية (يمكن شراؤها)
                </Typography>
                
                {filteredCertificates.filter(c => !c.isDefault).length > 0 ? (
                  filteredCertificates
                    .filter(c => !c.isDefault)
                    .map((certificate) => (
                      <CertificateItem 
                        key={certificate.id} 
                        certificate={certificate} 
                        isMobile={isMobile}
                        handleDialogOpen={handleDialogOpen}
                        handleDelete={handleDelete}
                        handlePreviewOpen={handlePreviewOpen}
                      />
                    ))
                ) : (
                  <Paper sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: themeColors.info + '10',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="body2" sx={{ color: themeColors.info }}>
                      لا توجد شهادات إضافية لهذه الدورة
                    </Typography>
                  </Paper>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => handleDialogOpen(false)}
                  sx={{
                    mt: 2,
                    borderRadius: '8px',
                    py: 1.5,
                    borderColor: themeColors.info + '40',
                    color: themeColors.secondary,
                    '&:hover': { 
                      borderColor: themeColors.primary, 
                      backgroundColor: themeColors.primary + '10' 
                    }
                  }}
                >
                  إضافة شهادة إختيارية بسعر
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ p: 2, color: themeColors.info }}>
              لا توجد بيانات الدورة
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* الشهادات المشتراة */}
      <Paper sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: '16px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3 
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: themeColors.secondary 
          }}>
            <MonetizationOn sx={{ 
              color: themeColors.success, 
              mr: 1, 
              verticalAlign: 'middle' 
            }} />
            الشهادات المشتراة
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: isMobile ? 2 : 0 
          }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ borderRadius: '8px' }}
                label="الحالة"
              >
                <MenuItem value="الكل">الكل</MenuItem>
                <MenuItem value="مكتمل">مكتمل</MenuItem>
                <MenuItem value="معلق">معلق</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              startIcon={<FilterList />} 
              sx={{ borderRadius: '8px' }}
            >
              ترتيب حسب التاريخ
            </Button>
          </Box>
        </Box>
        
        {purchasedCertificates.length > 0 ? (
          purchasedCertificates.map((certificate) => (
            <StyledCard key={certificate.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: 2, 
                  flexWrap: 'wrap' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={courseDetails?.image || 'https://source.unsplash.com/random/800x600?web'} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, borderRadius: '8px' }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: themeColors.secondary 
                      }}>
                        {certificate.name}
                      </Typography>
                      <Box sx={{ 
                        color: themeColors.info, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                      }}>
                        <span>{courseDetails?.title}</span>
                        <Divider orientation="vertical" flexItem />
                        <span>{certificate.date}</span>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={certificate.status || 'مكتمل'} 
                      sx={{ 
                        backgroundColor: 
                          certificate.status === 'مكتمل' ? themeColors.success :
                          certificate.status === 'معلق' ? themeColors.warning :
                          themeColors.error,
                        color: themeColors.background,
                        borderRadius: '20px',
                        padding: 1
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton sx={{ color: themeColors.primary }} onClick={() => handlePreviewOpen(certificate)}>
                        <Visibility />
                      </IconButton>
                      <IconButton sx={{ color: themeColors.info }} onClick={() => handleDownload(certificate)}>
                        <Download />
                      </IconButton>
                      <IconButton sx={{ color: '#0077B5' }} onClick={() => handleShareLinkedIn(certificate)}>   
                        <LinkedIn />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  borderRadius: '8px', 
                  backgroundColor: themeColors.info + '08', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      طريقة الدفع
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.secondary }}>
                      {certificate.paymentMethod || 'بطاقة ائتمان'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      رقم المعاملة
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.secondary }}>
                      {certificate.transactionId || 'TX123456'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      المبلغ
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: themeColors.success, 
                      fontWeight: 700 
                    }}>
                      ${certificate.price !== undefined && certificate.price !== null ? certificate.price : 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          ))
        ) : (
          <Typography sx={{ p: 2, color: themeColors.info }}>
            لا توجد شهادات مشتراة لهذه الدورة
          </Typography>
        )}
      </Paper>

      {/* نموذج إضافة/تعديل الشهادات */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${themeColors.info}20`,
          pb: 2,
        }}>
          {editData ? 'تعديل الشهادة' : 'شهادة جديدة'}
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم الشهادة"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="السعر ($)"
                type="number"
                value={formData.isDefault ? 0 : formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={formData.isDefault}
                InputProps={{ 
                  startAdornment: <MonetizationOn sx={{ color: themeColors.info, mr: 1 }} /> 
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نسبة المدرب (%)"
                type="number"
                value={formData.instructorShare}
                onChange={(e) => setFormData({ ...formData, instructorShare: e.target.value })}
                InputProps={{ 
                  endAdornment: <Typography variant="body2" sx={{ color: themeColors.info }}>%</Typography> 
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>مدة الشهادة</InputLabel>
                <Select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  label="مدة الشهادة"
                >
                  <MenuItem value="30 يوم">30 يوم</MenuItem>
                  <MenuItem value="60 يوم">60 يوم</MenuItem>
                  <MenuItem value="90 يوم">90 يوم</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="محتوى الشهادة (HTML)"
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                helperText="يمكنك استخدام [الاسم] كمكان فارغ لاسم الطالب"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isDefault: e.target.checked,
                      price: e.target.checked ? 0 : formData.price || ''
                    })}
                  />
                }
                label="شهادة افتراضية (مضمنة في سعر الكورس)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 3, 
          borderTop: `1px solid ${themeColors.info}20`, 
          pt: 2 
        }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            sx={{ 
              borderRadius: '8px', 
              color: themeColors.secondary, 
              borderColor: themeColors.info 
            }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
              disabled={isSubmitting} // تعطيل الزر أثناء التحميل
  endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null} // مؤشر التحميل

            sx={{ 
              borderRadius: '8px', 
              backgroundColor: themeColors.primary, 
              color: themeColors.background, 
              px: 4, 
              '&:hover': { backgroundColor: '#006699' } 
            }}
          >
            {editData ? 'حفظ التعديلات' : 'إضافة الشهادة'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* الإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Paper sx={{
          p: 2,
          borderRadius: '8px',
          backgroundColor: snackbar.severity === 'success' ? themeColors.success + '20' : themeColors.error + '20',
          border: `1px solid ${snackbar.severity === 'success' ? themeColors.success : themeColors.error}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <CheckCircle sx={{ 
            color: snackbar.severity === 'success' ? themeColors.success : themeColors.error 
          }} />
          <Typography variant="body2" sx={{ color: themeColors.secondary }}>
            {snackbar.message}
          </Typography>
        </Paper>
      </Snackbar>
    </Box>
  );
}
"use client"
import React, { useState, useEffect } from 'react';
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
  LinearProgress,
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

// بيانات وهمية
const dummyData = {
  courses: [
    {
      id: 1,
      title: 'دورة تطوير الويب المتقدم',
      category: 'تطوير الويب',
      price: 299,
      image: 'https://source.unsplash.com/random/800x600?web',
      rating: 4.8,
      students: 1250,
      certificates: [
        { 
          id: 1, 
          name: 'الشهادة الأساسية', 
          price: 49, 
          instructorShare: 70, 
          duration: '30 يوم',
          content: '<div style="text-align: center; padding: 2rem; border: 2px solid #008DCB; border-radius: 16px;"><h1 style="color: #008DCB;">شهادة إتمام الدورة</h1><p style="font-size: 1.2rem;">تم منح هذه الشهادة لـ [الاسم]</p><p style="font-size: 1.1rem;">في دورة تطوير الويب المتقدم</p><div style="margin: 2rem 0;"><img src="https://source.unsplash.com/random/200x200?badge" alt="شعار" style="width: 150px; height: 150px;"/></div><div style="display: flex; justify-content: space-around; margin-top: 2rem;"><div><p>التاريخ: 2024-03-15</p><p>رقم الشهادة: CERT-12345</p></div></div></div>'
        }
      ]
    }
  ],
  purchasedCertificates: [
    { 
      id: 1, 
      courseId: 1, 
      date: '2024-03-15', 
      status: 'مكتمل',
      certificateUrl: '#',
      paymentMethod: 'بطاقة ائتمان',
      transactionId: 'TX123456'
    }
  ]
};

const CertificateSystem = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    instructorShare: '',
    duration: '30 يوم',
    content: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // معاينة الشهادة
  const handlePreviewOpen = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewOpen(true);
  };

  // تحميل الشهادة
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
  const handleDialogOpen = (courseId, certificate = null) => {
    setSelectedCourse(courseId);
    if (certificate) {
      setEditData(certificate);
      setFormData(certificate);
    } else {
      setEditData(null);
      setFormData({ 
        name: '', 
        price: '', 
        instructorShare: '', 
        duration: '30 يوم',
        content: ''
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    const updatedCourses = dummyData.courses.map(course => {
      if (course.id === selectedCourse) {
        const certificates = editData 
          ? course.certificates.map(c => c.id === editData.id ? formData : c)
          : [...course.certificates, { ...formData, id: Date.now() }];
        
        return { ...course, certificates };
      }
      return course;
    });
    
    dummyData.courses = updatedCourses;
    setSnackbar({ 
      open: true, 
      message: editData ? 'تم تحديث الشهادة بنجاح' : 'تم إضافة الشهادة بنجاح',
      severity: 'success'
    });
    setOpenDialog(false);
  };

  const handleDelete = (courseId, certificateId) => {
    const updatedCourses = dummyData.courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          certificates: course.certificates.filter(c => c.id !== certificateId)
        };
      }
      return course;
    });
    
    dummyData.courses = updatedCourses;
    setSnackbar({ open: true, message: 'تم حذف الشهادة بنجاح', severity: 'success' });
  };

  const calculatePlatformShare = (price, instructorShare) => {
    return price * (100 - instructorShare) / 100;
  };

  const filteredCourses = dummyData.courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertificates = dummyData.purchasedCertificates.filter(cert =>
    filterStatus === 'الكل' ? true : cert.status === filterStatus
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: themeColors.background, minHeight: '100vh' }}>
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
              onClick={() => handleDownload(selectedCertificate)}
              sx={{ backgroundColor: themeColors.primary }}
            >
              تحميل
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
      <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ color: themeColors.secondary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle sx={{ color: themeColors.primary, fontSize: '2.5rem' }} />
          نظام إدارة الشهادات
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن دورة..."
            InputProps={{ startAdornment: <Search sx={{ color: themeColors.info, mr: 1 }} /> }}
            sx={{ width: isMobile ? '100%' : 300, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: '12px', px: 3, backgroundColor: themeColors.primary, '&:hover': { backgroundColor: '#006699' } }}
            onClick={() => handleDialogOpen(1)}
          >
            دورة جديدة
          </Button>
        </Box>
      </Box>

      {/* قائمة الدورات */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(2)).map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
            </Grid>
          ))
        ) : filteredCourses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, position: 'relative' }}>
                  <Avatar 
                    src={course.image} 
                    variant="rounded"
                    sx={{ width: 80, height: 80, borderRadius: '12px', boxShadow: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: themeColors.secondary }}>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={course.category} 
                        size="small" 
                        sx={{ backgroundColor: themeColors.info + '20', color: themeColors.secondary }} 
                      />
                      <Box sx={{ color: themeColors.info, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DateRange fontSize="small" /> {course.students} طالب
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    label={`$${course.price}`}
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: themeColors.warning,
                      color: themeColors.background,
                      fontWeight: 700,
                      fontSize: '1rem',
                      padding: 1,
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                {course.certificates.map((certificate) => (
                  <Paper key={certificate.id} sx={{ mb: 2, p: 2, borderRadius: '12px', border: `1px solid ${themeColors.info}20`, backgroundColor: themeColors.background }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors.secondary }}>
                        {certificate.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleDialogOpen(course.id, certificate)} sx={{ color: themeColors.primary }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(course.id, certificate.id)} sx={{ color: themeColors.error }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: themeColors.success + '10', textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: themeColors.info, display: 'block', mb: 0.5 }}>
                            المدرب
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: themeColors.success, fontWeight: 700 }}>
                            {certificate.instructorShare}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: themeColors.info + '10', textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: themeColors.info, display: 'block', mb: 0.5 }}>
                            المنصة
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: themeColors.info, fontWeight: 700 }}>
                            {100 - certificate.instructorShare}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        sx={{ backgroundColor: themeColors.primary, color: themeColors.background, borderRadius: '8px', py: 1, '&:hover': { backgroundColor: '#006699' } }}
                      >
                        شراء الشهادة (${certificate.price})
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Visibility />}
                        sx={{ borderColor: themeColors.info, color: themeColors.secondary, borderRadius: '8px', py: 1 }}
                        onClick={() => handlePreviewOpen(certificate)}
                      >
                        معاينة الشهادة
                      </Button>
                    </Box>
                  </Paper>
                ))}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => handleDialogOpen(course.id)}
                  sx={{
                    mt: 2,
                    borderRadius: '8px',
                    py: 1.5,
                    borderColor: themeColors.info + '40',
                    color: themeColors.secondary,
                    '&:hover': { borderColor: themeColors.primary, backgroundColor: themeColors.primary + '10' }
                  }}
                >
                  إضافة شهادة جديدة
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* الشهادات المشتراة */}
      <Paper sx={{ mt: 4, p: 3, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: themeColors.secondary }}>
            <MonetizationOn sx={{ color: themeColors.success, mr: 1, verticalAlign: 'middle' }} />
            الشهادات المشتراة
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: isMobile ? 2 : 0 }}>
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
            <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
              ترتيب حسب التاريخ
            </Button>
          </Box>
        </Box>

        {filteredCertificates.map((certificate) => {
          const course = dummyData.courses.find(c => c.id === certificate.courseId);
          const certDetails = course?.certificates.find(c => c.id === certificate.id);

          return (
            <StyledCard key={certificate.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={course.image} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, borderRadius: '8px' }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors.secondary }}>
                        {certDetails?.name}
                      </Typography>
                      <Box sx={{ color: themeColors.info, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{course.title}</span>
                        <Divider orientation="vertical" flexItem />
                        <span>{certificate.date}</span>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: isMobile ? 2 : 0 }}>
                    <Chip 
                      label={certificate.status} 
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
                      <IconButton sx={{ color: themeColors.primary }} onClick={() => handlePreviewOpen(certDetails)}>
                        <Visibility />
                      </IconButton>
                      <IconButton sx={{ color: themeColors.info }} onClick={() => handleDownload(certDetails)}>
                        <Download />
                      </IconButton>
                      <IconButton sx={{ color: '#0077B5' }} onClick={() => handleShareLinkedIn(certDetails)}>
                        <LinkedIn />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, p: 2, borderRadius: '8px', backgroundColor: themeColors.info + '08', display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      طريقة الدفع
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.secondary }}>
                      {certificate.paymentMethod}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      رقم المعاملة
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.secondary }}>
                      {certificate.transactionId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: themeColors.info }}>
                      المبلغ
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.success, fontWeight: 700 }}>
                      ${certDetails?.price}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          )})}
      </Paper>

      {/* نموذج إضافة/تعديل الشهادات */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${themeColors.info}20`, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editData ? 'تعديل الشهادة' : 'شهادة جديدة'}
          </Typography>
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                InputProps={{ startAdornment: <MonetizationOn sx={{ color: themeColors.info, mr: 1 }} /> }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نسبة المدرب (%)"
                type="number"
                value={formData.instructorShare}
                onChange={(e) => setFormData({ ...formData, instructorShare: e.target.value })}
                InputProps={{ endAdornment: <Typography variant="body2" sx={{ color: themeColors.info }}>%</Typography> }}
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
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${themeColors.info}20`, pt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: '8px', color: themeColors.secondary, borderColor: themeColors.info }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: '8px', backgroundColor: themeColors.primary, color: themeColors.background, px: 4, '&:hover': { backgroundColor: '#006699' } }}
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
          <CheckCircle sx={{ color: snackbar.severity === 'success' ? themeColors.success : themeColors.error }} />
          <Typography variant="body2" sx={{ color: themeColors.secondary }}>
            {snackbar.message}
          </Typography>
        </Paper>
      </Snackbar>
    </Box>
  );
};

export default CertificateSystem;
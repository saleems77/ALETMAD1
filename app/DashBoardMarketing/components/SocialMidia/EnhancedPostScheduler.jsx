"use client";
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Checkbox,
  useMediaQuery,
  useTheme,
  Slider,
  InputAdornment
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
  Image,
  VideoCameraBack,
  Schedule,
  PostAdd,
  AutoAwesome,
  Analytics,
  AdsClick,
  AttachMoney,
  InsertPhoto,
  OndemandVideo,
  Description,
  AddCircleOutline,
  People,
  Public,
  Link
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios';


const EnhancedPostScheduler = ({ posts, platforms, onNewPost, onPublish }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [content, setContent] = useState({
    text: '',
    media: [],
    links: [],
    platformVariants: {},
    isPromoted: false,
    adBudget: 0,
    audience: {
      ageRange: [18, 65],
      locations: [],
      interests: []
    }
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [postTemplates, setPostTemplates] = useState([]);
  const [analyticsPreview, setAnalyticsPreview] = useState(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  // تحميل القوالب والتحليلات الأولية
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [templatesRes, analyticsRes] = await Promise.all([
          axios.get('/api/templates'),
          axios.post('/api/analytics/preview', { content })
        ]);
        setPostTemplates(templatesRes.data);
        setAnalyticsPreview(analyticsRes.data);
      } catch (error) {
        toast.error('حدث خطأ في تحميل البيانات الأولية');
      }
    };
    loadInitialData();
  }, []);

  const validateContent = () => {
    if (!selectedPlatforms.length) {
      toast.error('الرجاء اختيار منصة واحدة على الأقل');
      return false;
    }
    if (!content.text.trim() && !content.media.length && !content.links.length) {
      toast.error('المحتوى لا يمكن أن يكون فارغًا');
      return false;
    }
    return true;
  };

  const handleAdBudgetChange = (e, newValue) => {
    setContent(prev => ({
      ...prev,
      adBudget: Array.isArray(newValue) ? newValue[0] : newValue
    }));
  };

  const handleAudienceChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        [field]: value
      }
    }));
  };

  const handleLinkAdd = () => {
    if (linkInput && isValidUrl(linkInput)) {
      setContent(prev => ({
        ...prev,
        links: [...prev.links, linkInput]
      }));
      setLinkInput('');
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handlePlatformPublish = async (platformId, postData) => {
    try {
      const platform = platforms.find(p => p.id === platformId);
      const response = await axios.post(platform.apiEndpoint, {
        ...postData,
        accessToken: platform.accessToken
      });
      return response.data;
    } catch (error) {
      throw new Error(`فشل النشر على ${platform.name}: ${error.message}`);
    }
  };

  const handleSchedule = async () => {
    if (!validateContent()) return;
    
    setIsLoading(true);
    try {
      const postId = uuidv4();
      const platformPromises = selectedPlatforms.map(platformId => 
        handlePlatformPublish(platformId, {
          ...content,
          scheduledAt: scheduledDate.toISOString()
        })
      );

      const results = await Promise.all(platformPromises);
      
      const finalPost = {
        id: postId,
        ...content,
        platforms: selectedPlatforms,
        scheduledAt: scheduledDate.toISOString(),
        status: 'مجدول',
        analyticsId: `ana_${Date.now()}`,
        platformResults: results
      };
      
      onNewPost(finalPost);
      toast.success('تم الجدولة بنجاح على جميع المنصات!');
      resetForm();
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء الجدولة!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantPublish = async () => {
    if (!validateContent()) return;

    setIsLoading(true);
    try {
      const postId = uuidv4();
      const platformPromises = selectedPlatforms.map(platformId => 
        handlePlatformPublish(platformId, {
          ...content,
          publishedAt: new Date().toISOString()
        })
      );

      const results = await Promise.all(platformPromises);
      
      const publishedPost = {
        id: postId,
        ...content,
        platforms: selectedPlatforms,
        publishedAt: new Date().toISOString(),
        status: 'منشور',
        platformResults: results
      };
      
      onPublish(publishedPost);
      toast.success('تم النشر الفوري بنجاح!');
      resetForm();
    } catch (error) {
      toast.error(error.message || 'فشل النشر الفوري!');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent({
      text: '',
      media: [],
      links: [],
      platformVariants: {},
      isPromoted: false,
      adBudget: 0,
      audience: {
        ageRange: [18, 65],
        locations: [],
        interests: []
      }
    });
    setSelectedPlatforms([]);
    setScheduledDate(new Date());
  };

  const renderPlatformSpecificFields = (platform) => (
    <Box key={platform.id} sx={{ p: 2, border: '1px dashed #ddd', borderRadius: 2, my: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        <Avatar src={platform.icon} sx={{ mr: 1 }} />
        {platform.name}
      </Typography>
      
      <TextField
        fullWidth
        label="النص المخصص"
        value={content.platformVariants[platform.id]?.text || ''}
        onChange={(e) => handleContentChange(platform.id, 'text', e.target.value)}
        multiline
        rows={2}
        sx={{ mb: 2 }}
        inputProps={{ maxLength: platform.maxTextLength }}
        helperText={`${content.platformVariants[platform.id]?.text?.length || 0}/${platform.maxTextLength}`}
      />

      {platform.supportsVideo && (
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            id={`video-${platform.id}`}
            hidden
            accept="video/*"
            onChange={(e) => handleMediaUpload(e, platform.id)}
          />
          <Button
            variant="outlined"
            startIcon={<OndemandVideo />}
            onClick={() => document.getElementById(`video-${platform.id}`).click()}
            fullWidth
          >
            إضافة فيديو
          </Button>
        </Box>
      )}

      {platform.supportsImages && (
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            id={`image-${platform.id}`}
            hidden
            accept="image/*"
            onChange={(e) => handleMediaUpload(e, platform.id)}
            multiple
          />
          <Button
            variant="outlined"
            startIcon={<InsertPhoto />}
            onClick={() => document.getElementById(`image-${platform.id}`).click()}
            fullWidth
          >
            إضافة صور
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <PostAdd fontSize="large" color="primary" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            جدولة متقدمة للمنشورات <AutoAwesome color="secondary" />
          </Typography>
        </Box>

        <Tabs
          value={activeStep}
          onChange={(e, newValue) => setActiveStep(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          <Tab label="المنصات" icon={<Public />} />
          <Tab label="المحتوى" icon={<Description />} />
          <Tab label="الوسائط" icon={<InsertPhoto />} />
          <Tab label="الإعلان" icon={<AttachMoney />} />
          <Tab label="الجدولة" icon={<Schedule />} />
          <Tab label="التحليلات" icon={<Analytics />} />
        </Tabs>

        {activeStep === 0 && (
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>المنصات المستهدفة</InputLabel>
            <Select
              multiple
              value={selectedPlatforms}
              onChange={(e) => setSelectedPlatforms(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={platforms.find(p => p.id === value)?.name}
                      avatar={<Avatar src={platforms.find(p => p.id === value)?.icon} />}
                      onDelete={() => setSelectedPlatforms(prev => prev.filter(v => v !== value))}
                    />
                  ))}
                </Box>
              )}
            >
              {platforms.filter(p => p.connected).map((platform) => (
                <MenuItem key={platform.id} value={platform.id}>
                  <Checkbox checked={selectedPlatforms.includes(platform.id)} />
                  <Avatar src={platform.icon} sx={{ width: 24, height: 24, mr: 1 }} />
                  {platform.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {activeStep === 1 && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setTemplateOpen(!templateOpen)}
                startIcon={<AutoAwesome />}
              >
                اختر من القوالب
              </Button>
              
              {templateOpen && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #eee' }}>
                  <Grid container spacing={2}>
                    {postTemplates.map(template => (
                      <Grid item xs={12} sm={6} key={template.id}>
                        <Paper 
                          sx={{ p: 2, cursor: 'pointer' }}
                          onClick={() => setContent(prev => ({
                            ...prev,
                            text: template.content
                          }))}
                        >
                          <Typography variant="body2">{template.content}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="المحتوى الرئيسي"
              value={content.text}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
              InputProps={{
                endAdornment: (
                  <Tooltip title="اقتراح نصوص ذكية">
                    <IconButton onClick={() => toast('قيد التطوير: ميزة الذكاء الاصطناعي')}>
                      <AutoAwesome />
                    </IconButton>
                  </Tooltip>
                )
              }}
              sx={{ mb: 4 }}
            />

            {selectedPlatforms.map(platform => renderPlatformSpecificFields(platform))}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="أضف رابط وسائط (Youtube, Vimeo, etc)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Link />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button 
                      variant="contained" 
                      onClick={handleLinkAdd}
                      disabled={!isValidUrl(linkInput)}
                    >
                      إضافة
                    </Button>
                  )
                }}
              />
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {content.links.map((link, index) => (
                  <Chip
                    key={index}
                    label={link}
                    onDelete={() => setContent(prev => ({
                      ...prev,
                      links: prev.links.filter((_, i) => i !== index)
                    }))}
                    avatar={<Avatar><Link /></Avatar>}
                  />
                ))}
              </Box>
            </Box>

            <input
              type="file"
              id="global-media"
              hidden
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleMediaUpload(e)}
            />
            <Button
              variant="contained"
              startIcon={<InsertPhoto />}
              onClick={() => document.getElementById('global-media').click()}
              fullWidth
              sx={{ mb: 4 }}
            >
              إضافة ملفات وسائط
            </Button>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {content.media.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => setContent(prev => ({
                    ...prev,
                    media: prev.media.filter((_, i) => i !== index)
                  }))}
                  avatar={
                    <Avatar>
                      {file.type.startsWith('image') ? <InsertPhoto /> : <OndemandVideo />}
                    </Avatar>
                  }
                />
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={content.isPromoted}
                  onChange={(e) => setContent(prev => ({ ...prev, isPromoted: e.target.checked }))}
                />
                <Typography variant="h6">ترقية المنشور كإعلان مدفوع</Typography>
              </Box>

              {content.isPromoted && (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Typography gutterBottom>الميزانية اليومية (USD)</Typography>
                    <Slider
                      value={content.adBudget}
                      onChange={handleAdBudgetChange}
                      min={0}
                      max={1000}
                      step={10}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 0, label: '$0' },
                        { value: 500, label: '$500' },
                        { value: 1000, label: '$1000' }
                      ]}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography gutterBottom>الفئة العمرية</Typography>
                    <Slider
                      value={content.audience.ageRange}
                      onChange={(e, newValue) => handleAudienceChange('ageRange', newValue)}
                      min={18}
                      max={65}
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="الاهتمامات (مفصولة بفواصل)"
                    value={content.audience.interests.join(',')}
                    onChange={(e) => handleAudienceChange('interests', e.target.value.split(','))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="المواقع الجغرافية (رموز الدول)"
                    value={content.audience.locations.join(',')}
                    onChange={(e) => handleAudienceChange('locations', e.target.value.split(','))}
                  />
                </>
              )}
            </FormControl>
          </Box>
        )}

        {activeStep === 4 && (
          <Box>
            <DateTimePicker
              label="موعد النشر"
              value={scheduledDate}
              onChange={setScheduledDate}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />
            <FormControl fullWidth>
              <InputLabel>منطقة التوقيت</InputLabel>
              <Select
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                disabled
                sx={{ mb: 4 }}
              >
                <MenuItem value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {activeStep === 5 && (
          <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              التحليلات التنبؤية
            </Typography>
            {analyticsPreview ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    التفاعل المتوقع: {analyticsPreview.engagement}%
                  </Typography>
                  <Slider
                    value={analyticsPreview.engagement}
                    readOnly
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    الوصول التقديري: {analyticsPreview.reach.toLocaleString()}
                  </Typography>
                  <Slider
                    value={analyticsPreview.reach / 10000}
                    readOnly
                    sx={{ mt: 1 }}
                  />
                </Grid>
                {content.isPromoted && (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="primary">
                      التكلفة المتوقعة: ${(content.adBudget * analyticsPreview.estimatedCPM).toFixed(2)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <CircularProgress />
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Schedule />}
            onClick={handleSchedule}
            disabled={isLoading}
            sx={{ minWidth: 200 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'جدولة المنشور'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={handleInstantPublish}
            disabled={isLoading}
            sx={{ minWidth: 200 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'نشر فوري'}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default EnhancedPostScheduler;
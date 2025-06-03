// BrandForm.jsx
'use client';
import { useForm } from 'react-hook-form';
import { useBrandStore } from './WhiteLabelContext';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState, useCallback } from 'react';
import { FiUpload, FiCheckCircle } from 'react-icons/fi';
import ImageCropper from './ImageCropper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';

const schema = yup.object({
  primaryColor: yup.string().required('اللون الأساسي مطلوب'),
  secondaryColor: yup.string().required('اللون الثانوي مطلوب'),
  font: yup.string().required('اختيار الخط مطلوب'),
});

export default function BrandForm() {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const { updateBrand } = useBrandStore();
  const [logoPreview, setLogoPreview] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = useCallback((file) => {
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  }, []);

  const handleCropComplete = useCallback((croppedImage) => {
    setLogoPreview(croppedImage);
    setShowCropper(false);
  }, []);

  const onSubmit = (data) => {
    updateBrand({
      logo: logoPreview,
      ...data
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
    >
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">الشعار المؤسسي</label>
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <input 
              type="file" 
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            <div className="w-32 h-32 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed hover:border-primary transition-colors">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <FiUpload className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </label>
          <div className="text-sm text-gray-500">
            <p>الامتدادات المسموحة: PNG, JPG, SVG</p>
            <p>الحجم الأقصى: 5MB</p>
          </div>
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">اللون الأساسي</label>
          <HexColorPicker 
            className="!w-full mb-2"
            onChange={(c) => setValue('primaryColor', c)}
          />
          <HexColorInput
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="#اختر اللون"
            {...register('primaryColor')}
          />
          <p className="text-red-500 text-sm mt-1">{errors.primaryColor?.message}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">اللون الثانوي</label>
          <HexColorPicker 
            className="!w-full mb-2"
            onChange={(c) => setValue('secondaryColor', c)}
          />
          <HexColorInput
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="#اختر اللون"
            {...register('secondaryColor')}
          />
          <p className="text-red-500 text-sm mt-1">{errors.secondaryColor?.message}</p>
        </div>
      </div>

      {/* Font Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">خط النص</label>
        <select
          className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800"
          {...register('font')}
        >
          <option value="Tajawal">Tajawal</option>
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
      >
        {success && <FiCheckCircle className="w-5 h-5" />}
        {success ? 'تم الحفظ بنجاح!' : 'حفظ التغييرات'}
      </button>

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
            <ImageCropper 
              image={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
            />
          </div>
        </div>
      )}
    </motion.form>
  );
}
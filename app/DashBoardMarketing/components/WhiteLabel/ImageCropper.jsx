// ImageCropper.jsx
'use client';
import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropper({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCrop = async () => {
    const imageElement = document.querySelector('.ReactCrop__image');
    const croppedImageUrl = await getCroppedImg(imageElement, crop);
    setCroppedImage(croppedImageUrl);
    onCropComplete(croppedImageUrl);
  };

  return (
    <div className="space-y-4">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        aspect={1}
        circularCrop
      >
        <img src={image} alt="Crop" />
      </ReactCrop>
      
      <div className="flex gap-3 justify-end">
        <button
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          onClick={onCancel}
        >
          إلغاء
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          onClick={handleCrop}
        >
          تأكيد القص
        </button>
      </div>
    </div>
  );
}
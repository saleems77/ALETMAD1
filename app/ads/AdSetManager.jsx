// AdSetManager.jsx
"use client";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toastt";

const AdSetManager = ({ campaignId, onCreateAdSet }) => {
  const [adSet, setAdSet] = useState({
    name: "",
    budget: "",
    audienceTargeting: {
      ageRange: [18, 65],
      interests: [],
      locations: []
    },
    schedule: {
      startDate: new Date(),
      endDate: new Date(),
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      hours: Array.from({length: 24}, (_, i) => i)
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("jwt");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/ad-sets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              ...adSet,
              campaign: campaignId
            }
          })
        }
      );
      
      if (!response.ok) throw new Error("فشل إنشاء مجموعة الإعلانات");
      
      const data = await response.json();
      
      // إعادة تعيين النموذج
      setAdSet({
        name: "",
        budget: "",
        audienceTargeting: {
          ageRange: [18, 65],
          interests: [],
          locations: []
        },
        schedule: {
          startDate: new Date(),
          endDate: new Date(),
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          hours: Array.from({length: 24}, (_, i) => i)
        }
      });
      
      toast({
        title: "🎉 تم الإنشاء!",
        description: "تم إنشاء مجموعة الإعلانات بنجاح"
      });
      
      onCreateAdSet(data);
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day) => {
    const updatedDays = adSet.schedule.daysOfWeek.includes(day)
      ? adSet.schedule.daysOfWeek.filter(d => d !== day)
      : [...adSet.schedule.daysOfWeek, day];
    setAdSet({
      ...adSet,
      schedule: {
        ...adSet.schedule,
        daysOfWeek: updatedDays
      }
    });
  };

  const toggleHour = (hour) => {
    const updatedHours = adSet.schedule.hours.includes(hour)
      ? adSet.schedule.hours.filter(h => h !== hour)
      : [...adSet.schedule.hours, hour];
    setAdSet({
      ...adSet,
      schedule: {
        ...adSet.schedule,
        hours: updatedHours
      }
    });
  };

  const addInterest = (e) => {
    const interest = e.target.value;
    if (interest && !adSet.audienceTargeting.interests.includes(interest)) {
      setAdSet({
        ...adSet,
        audienceTargeting: {
          ...adSet.audienceTargeting,
          interests: [...adSet.audienceTargeting.interests, interest]
        }
      });
      e.target.value = "";
    }
  };

  const removeInterest = (index) => {
    setAdSet({
      ...adSet,
      audienceTargeting: {
        ...adSet.audienceTargeting,
        interests: adSet.audienceTargeting.interests.filter((_, i) => i !== index)
      }
    });
  };

  const addLocation = (e) => {
    const location = e.target.value.trim();
    if (location && !adSet.audienceTargeting.locations.includes(location)) {
      setAdSet({
        ...adSet,
        audienceTargeting: {
          ...adSet.audienceTargeting,
          locations: [...adSet.audienceTargeting.locations, location]
        }
      });
      e.target.value = "";
    }
  };

  const removeLocation = (index) => {
    setAdSet({
      ...adSet,
      audienceTargeting: {
        ...adSet.audienceTargeting,
        locations: adSet.audienceTargeting.locations.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">إنشاء مجموعة إعلانية جديدة</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">اسم المجموعة</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={adSet.name}
              onChange={(e) => setAdSet({...adSet, name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">الميزانية اليومية (ر.س)</label>
            <input
              type="number"
              min="50"
              className="w-full p-2 border border-gray-300 rounded"
              value={adSet.budget}
              onChange={(e) => setAdSet({...adSet, budget: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">استهداف الجمهور</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الفئة العمرية</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="18"
                  max="65"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={adSet.audienceTargeting.ageRange[0]}
                  onChange={(e) => setAdSet({
                    ...adSet, 
                    audienceTargeting: {
                      ...adSet.audienceTargeting,
                      ageRange: [parseInt(e.target.value), adSet.audienceTargeting.ageRange[1]]
                    }
                  })}
                />
                <span>إلى</span>
                <input
                  type="number"
                  min="18"
                  max="65"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={adSet.audienceTargeting.ageRange[1]}
                  onChange={(e) => setAdSet({
                    ...adSet, 
                    audienceTargeting: {
                      ...adSet.audienceTargeting,
                      ageRange: [adSet.audienceTargeting.ageRange[0], parseInt(e.target.value)]
                    }
                  })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الاهتمامات</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={addInterest}
              >
                <option value="">اختر اهتماماً</option>
                <option value="education">التعليم</option>
                <option value="technology">التكنولوجيا</option>
                <option value="business">الأعمال</option>
                <option value="health">الصحة</option>
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {adSet.audienceTargeting.interests.map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {interest}
                    <button 
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">المواقع</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="أضف موقعاً"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    addLocation(e);
                  }
                }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {adSet.audienceTargeting.locations.map((location, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {location}
                    <button 
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">الجدولة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">تاريخ البدء</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={adSet.schedule.startDate.toISOString().split('T')[0]}
                onChange={(e) => setAdSet({
                  ...adSet, 
                  schedule: {
                    ...adSet.schedule,
                    startDate: new Date(e.target.value)
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">تاريخ الانتهاء</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={adSet.schedule.endDate.toISOString().split('T')[0]}
                min={adSet.schedule.startDate.toISOString().split('T')[0]}
                onChange={(e) => setAdSet({
                  ...adSet, 
                  schedule: {
                    ...adSet.schedule,
                    endDate: new Date(e.target.value)
                  }
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">أيام الأسبوع</label>
            <div className="flex flex-wrap gap-2">
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    adSet.schedule.daysOfWeek.includes(index) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">ساعات اليوم</label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({length: 24}, (_, i) => i).map(hour => (
                <button
                  key={hour}
                  type="button"
                  className={`px-2 py-1 rounded text-xs ${
                    adSet.schedule.hours.includes(hour) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => toggleHour(hour)}
                >
                  {hour}:00
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : "إنشاء مجموعة إعلانية"}
        </button>
      </form>
    </div>
  );
};

export default AdSetManager;
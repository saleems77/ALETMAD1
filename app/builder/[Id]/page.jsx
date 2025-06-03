"use client";
import { useEffect , useState } from 'react';
import { useMarketingPageStore } from '../../DashBoardTraier/components/marketing/MarketingPageContext';
import EditorPanel from '../../DashBoardTraier/components/marketing/EditorPanel';
import PreviewSection from '../../DashBoardTraier/components/marketing/PreviewSection';

export default function PageBuilder() {
  const { currentPage, setCurrentPage } = useMarketingPageStore();
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // تحميل بيانات الصفحة من المخزن
    if (currentPage) {
      setElements(currentPage.elements);
    }
  }, [currentPage]);

  const handleSave = () => {
    const updatedPage = { ...currentPage, elements };
    setCurrentPage(updatedPage);
    // هنا يمكن إرسال البيانات إلى الخادم
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3">
        <EditorPanel elements={elements} setElements={setElements} />
      </div>
      <div className="w-2/3">
        <PreviewSection elements={elements} />
        <button onClick={handleSave} className="btn btn-success fixed bottom-4 right-4">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
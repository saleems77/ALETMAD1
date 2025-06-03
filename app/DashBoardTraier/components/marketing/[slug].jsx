import { useRouter } from 'next/router';
import { useMarketingPageStore } from '@/context/MarketingPageContext';

export default function MarketingPageView() {
  const router = useRouter();
  const { slug } = router.query;
  const { pages } = useMarketingPageStore();

  const page = pages.find(p => p.slug === slug);

  if (!page) return <div>الصفحة غير موجودة</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">{page.title}</h1>
      <div className="max-w-4xl mx-auto">
        {page.elements.map((element) => (
          <div key={element.id} className="mb-8">
            {element.type === 'text' ? (
              <p className="text-lg">{element.content}</p>
            ) : (
              <img src={element.content} alt="Page content" className="w-full rounded-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
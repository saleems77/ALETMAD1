// components/Auth/AuthLayout.jsx
import Image from 'next/image';

export const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:w-96">
          <div className="flex justify-center mb-8">
            <Image
              src="/الاعتماد العربي.png"
              alt="شعار المنصة"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
      </div>
    </div>
  );
};
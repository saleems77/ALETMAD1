import CertificateViewer from '@/app/DashBoardAdmin/components/Certificates/CertificateViewer';

export default function CertificatePage({ params }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <CertificateViewer certificateId={params.id} />
    </div>
  );
}
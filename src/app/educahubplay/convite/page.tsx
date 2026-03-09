import { Mail } from "lucide-react";

export default function ConvitePage() {
  return (
    <div className="text-center py-20 space-y-4">
      <Mail size={48} className="mx-auto text-violet-500" />
      <h1 className="text-2xl font-bold">Solicitar Convite</h1>
      <p className="text-muted">Acesso a plataforma EducaHubPlay e por convite para educadores da UNEB.</p>
      <p className="text-sm text-muted">Em breve...</p>
    </div>
  );
}

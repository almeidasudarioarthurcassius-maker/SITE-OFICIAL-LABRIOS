'use client';
import Link from 'next/link';

// Define que o componente pode receber a propriedade logoUrl opcionalmente
interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  // Se houver uma logo cadastrada no banco, usa ela. Caso contrário, mantém uma padrão ou texto
  const imagemLogo = logoUrl || '/logo-placeholder.png'; 

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', height: '68px', background: 'white', borderBottom: '1px solid var(--gray-200)', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Logo Dinâmica com Link para a Home */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={imagemLogo} 
            alt="Logo LabRios" 
            style={{ height: '45px', maxWidth: '200px', objectFit: 'contain', cursor: 'pointer' }} 
            // Fallback: se a imagem falhar por erro de link quebrado, carrega a padrão
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-placeholder.png'; }}
          />
        </Link>

        {/* Os links originais do seu menu (como Início, Inventário, Equipe) continuam aqui abaixo */}

      </div>
    </nav>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Navbar() {
  const [logoUrl, setLogoUrl] = useState<string>('/logo-placeholder.png'); // Imagem padrão caso não tenha no banco

  useEffect(() => {
    async function fetchLogo() {
      const { data } = await supabase
        .from('configuracoes_site')
        .select('valor')
        .eq('chave', 'logo')
        .single();
      
      if (data?.valor?.url) {
        setLogoUrl(data.valor.url);
      }
    }
    fetchLogo();
  }, []);

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', height: '68px', background: 'white', borderBottom: '1px solid var(--gray-200)', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link href="/">
          <img 
            src={logoUrl} 
            alt="Logo LabRios" 
            style={{ height: '45px', maxWidth: '200px', objectFit: 'contain', cursor: 'pointer' }} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-placeholder.png'; }}
          />
        </Link>
        {/* Seus links normais do menu aqui... */}
      </div>
    </nav>
  );
}

// app/inventario/page.tsx  (Server Component)
import { supabase } from '../../lib/supabase';
import InventoryTable from '../../components/InventoryTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventário de Equipamentos — LTIP',
  description: 'Consulte o inventário completo de equipamentos disponíveis no Laboratório LTIP.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function InventarioPage() {
  const { data, error } = await supabase
    .from('inventario')
    .select('*')
    .order('nome_equipamento');

  if (error) console.error('Erro ao carregar inventário:', error.message);

  return (
    <section
      className="inventory"
      style={{ marginTop: 68, paddingTop: 80, background: 'white', minHeight: '70vh' }}
    >
      <div className="container">
        <InventoryTable items={data ?? []} />
      </div>
    </section>
  );
}

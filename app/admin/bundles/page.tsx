import Image from 'next/image';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { saveBundle } from '@/app/admin/actions';

export default async function Page() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase.from('bundles').select('*,bundle_items(quantity,products(name))').order('created_at');
  return <>
    <div className="admin-title"><h1>Bundles & Stock</h1><p>Manage curated packs, prices, availability and component quantities.</p></div>
    {data?.map((bundle) => <article className="admin-card" key={bundle.id}>
      <div className="bundle-admin-head"><Image src={bundle.image_url} alt={bundle.name} width={120} height={90}/><div><h2>{bundle.name}</h2><p>{bundle.bundle_items?.map((item:{quantity:number;products:{name:string}|null})=>`${item.quantity} × ${item.products?.name||'Product'}`).join(' · ')}</p></div></div>
      <form action={saveBundle} className="admin-form">
        <input type="hidden" name="id" value={bundle.id}/>
        <div className="field-grid"><label>Name<input name="name" defaultValue={bundle.name} required/></label><label>Price EGP<input name="price" type="number" step=".01" defaultValue={bundle.price_minor/100} required/></label><label>Bundle stock<input name="stock" type="number" defaultValue={bundle.stock} required/></label><label>Currency<input name="currency" defaultValue={bundle.currency}/></label></div>
        <label>Description<textarea name="description" defaultValue={bundle.description} rows={3}/></label>
        <label className="check-row"><input type="checkbox" name="active" defaultChecked={bundle.active}/>Active</label>
        <button className="button button-primary">Save bundle</button>
      </form>
    </article>)}
  </>;
}

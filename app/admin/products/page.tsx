import Image from 'next/image';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { saveProduct, hideProduct } from '@/app/admin/actions';
import type { Product } from '@/types';

function ProductForm({ product }: { product?: Product }) {
  return <form action={saveProduct} className="admin-form" encType="multipart/form-data"><input type="hidden" name="id" value={product?.id || ''}/><div className="field-grid"><label>Name<input name="name" defaultValue={product?.name || ''} required/></label><label>Slug<input name="slug" defaultValue={product?.slug || ''} required/></label><label>Price EGP<input type="number" step=".01" name="price" defaultValue={(product?.price_minor || 0) / 100} required/></label><label>Stock<input type="number" name="stock" defaultValue={product?.stock || 0} required/></label><label>Currency<input name="currency" defaultValue={product?.currency || 'EGP'}/></label><label>Category<input name="category" defaultValue={product?.category || 'Fruit Elixir'}/></label></div><label>Short description<input name="short_description" defaultValue={product?.short_description || ''} required/></label><label>Description<textarea name="description" rows={4} defaultValue={product?.description || ''}/></label><label>Ingredients<input name="ingredients" defaultValue={product?.ingredients?.join(', ') || ''}/></label><label>Benefits<input name="benefits" defaultValue={product?.benefits?.join(', ') || ''}/></label><label>Image URL<input name="image_url" defaultValue={product?.image_url || ''}/></label><label>Upload image<input type="file" name="image" accept="image/*"/></label><div className="check-row"><label><input type="checkbox" name="active" defaultChecked={product ? product.active : true}/>Active</label><label><input type="checkbox" name="featured" defaultChecked={product?.featured}/>Featured</label></div><button className="button button-primary">Save product</button></form>;
}

export default async function Page() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const products = (data || []) as Product[];
  return <><div className="admin-title"><h1>Products & Stock</h1><p>Create, edit, upload images and control inventory.</p></div><details className="admin-card" open={!products.length}><summary>Add a product</summary><ProductForm/></details>{products.map((product) => <details className="admin-card" key={product.id}><summary><span><Image src={product.image_url} alt={product.name} width={70} height={55}/><b>{product.name}</b></span><span>{product.stock} in stock</span></summary><ProductForm product={product}/><form action={hideProduct}><input type="hidden" name="id" value={product.id}/><button className="button danger">Hide product</button></form></details>)}</>;
}

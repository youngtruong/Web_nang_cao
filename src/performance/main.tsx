import React, { memo, useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const categories = ['Điện tử', 'Gia dụng', 'Thời trang', 'Văn phòng'];
const products = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1, name: `${['Tai nghe', 'Đèn bàn', 'Áo khoác', 'Sổ tay'][i % 4]} ${String(i + 1).padStart(5, '0')}`,
  category: categories[i % 4], price: 99000 + (i % 120) * 15000, stock: (i * 17) % 200,
}));
type Product = typeof products[number];
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const optimized = new URLSearchParams(location.search).get('mode') !== 'before';
const debug = new URLSearchParams(location.search).has('debug');
const counters = { rows: 0, computations: 0 };
if (debug) Object.assign(window, { performanceLab: counters });
const HEIGHT = 68, VIEWPORT = 544, BUFFER = 4;
function Row({ product: p, selected, toggle }: { product: Product; selected: boolean; toggle: (id: number) => void }) {
  if (debug) counters.rows++;
  return <div className="product-row" role="row" data-product-id={p.id}>
    <div role="cell"><input aria-label={`Chọn ${p.name}`} type="checkbox" checked={selected} onChange={() => toggle(p.id)} /></div>
    <div role="cell"><strong>{p.name}</strong><small>SKU-{String(p.id).padStart(5, '0')}</small></div>
    <div role="cell">{p.category}</div><div role="cell">{money.format(p.price)}</div>
    <div role="cell"><span className={p.stock < 20 ? 'low' : 'stock'}>{p.stock} trong kho</span></div>
  </div>;
}
const MemoRow = memo(Row);
function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('id');
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [scroll, setScroll] = useState(0);
  const compute = () => {
    if (debug) counters.computations++;
    return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) && (!category || p.category === category)).sort((a, b) => sort === 'price' ? a.price - b.price || a.id - b.id : a.id - b.id);
  };
  const cached = useMemo(() => optimized ? compute() : [], [query, category, sort]);
  const filtered = optimized ? cached : compute();
  const stableToggle = useCallback((id: number) => setSelected(old => { const next = new Set(old); next.has(id) ? next.delete(id) : next.add(id); return next; }), []);
  const toggle = optimized ? stableToggle : (id: number) => stableToggle(id);
  const start = optimized ? Math.max(0, Math.floor(scroll / HEIGHT) - BUFFER) : 0;
  const end = optimized ? Math.min(filtered.length, Math.ceil((scroll + VIEWPORT) / HEIGHT) + BUFFER) : filtered.length;
  const Component = optimized ? MemoRow : Row;
  return <main>
    <header><a href="/">← Các bài thực hành</a><span>BUỔI 05 / REACT PERFORMANCE</span></header>
    <section className="intro"><p className="eyebrow">PRODUCT LAB</p><h1>Quản lý sản phẩm</h1><p>10.000 sản phẩm. Một bài thực hành đo lường và tối ưu trải nghiệm.</p>
    <nav aria-label="Phiên bản"><a className={!optimized ? 'active' : ''} href="?mode=before">01 · Trước tối ưu</a><a className={optimized ? 'active' : ''} href="?mode=after">02 · Sau tối ưu</a></nav></section>
    <section className="stats" aria-label="Tổng quan"><div><small>TỔNG SẢN PHẨM</small><b>10.000</b></div><div><small>KẾT QUẢ LỌC</small><b>{filtered.length.toLocaleString('vi-VN')}</b></div><div><small>ĐÃ CHỌN</small><b>{selected.size}</b></div><div><small>DÒNG ĐANG MOUNT</small><b>{end - start}</b></div></section>
    <section className="catalog"><div className="toolbar"><label>Tìm sản phẩm<input placeholder="Ví dụ: Tai nghe 00001" value={query} onChange={e => { setQuery(e.target.value); setScroll(0); document.getElementById('list')?.scrollTo(0, 0); }} /></label><label>Danh mục<select value={category} onChange={e => { setCategory(e.target.value); setScroll(0); document.getElementById('list')?.scrollTo(0, 0); }}><option value="">Tất cả danh mục</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Sắp xếp<select value={sort} onChange={e => setSort(e.target.value)}><option value="id">Mã sản phẩm</option><option value="price">Giá tăng dần</option></select></label><button onClick={() => setSelected(new Set())}>Bỏ chọn tất cả</button></div>
    <div role="table" aria-label="Danh sách sản phẩm" aria-rowcount={filtered.length + 1}><div className="product-row table-head" role="row"><div role="columnheader">Chọn</div><div role="columnheader">Sản phẩm</div><div role="columnheader">Danh mục</div><div role="columnheader">Giá bán</div><div role="columnheader">Tồn kho</div></div>
    <div id="list" className="list" onScroll={e => optimized && setScroll(e.currentTarget.scrollTop)}><div style={{ height: filtered.length * HEIGHT, position: 'relative' }}><div style={{ position: 'absolute', top: start * HEIGHT, width: '100%' }}>{filtered.slice(start, end).map(p => <Component key={p.id} product={p} selected={selected.has(p.id)} toggle={toggle} />)}</div></div>{!filtered.length && <p className="empty">Không tìm thấy sản phẩm phù hợp.</p>}</div></div>
    <footer>{optimized ? 'Virtualization · React.memo · useMemo · useCallback' : 'Render toàn bộ danh sách · lọc/sắp xếp lại và render lại khi chọn sản phẩm'}<span>Dữ liệu giả lập cố định • Không gọi API</span></footer></section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

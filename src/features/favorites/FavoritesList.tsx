import { Heart, Trash2 } from 'lucide-react';
import { useFavoritesStore } from './favoritesStore';

export function FavoritesList() {
  const items = useFavoritesStore((state) => state.items);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <section
      aria-labelledby="favorites-heading"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center gap-2">
        <Heart aria-hidden="true" className="h-6 w-6 fill-rose-500 text-rose-500" />
        <h2 id="favorites-heading" className="text-2xl font-bold">
          Sản phẩm yêu thích ({items.length})
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Chưa có sản phẩm yêu thích.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((product) => (
            <li key={product.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFavorite(product.id)}
                aria-label={`Bỏ ${product.name} khỏi danh sách yêu thích`}
                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-950"
              >
                <Trash2 aria-hidden="true" className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { useState } from 'react';
import { mockProducts, mockCategories } from '../../data/mockData';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  images?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const ProductCard = ({ product, onEdit, onDelete }: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="aspect-square bg-gray-100 rounded-lg mb-4">
      {product.images && product.images.length > 0 && (
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
    </div>
    <h3 className="font-medium text-lg mb-2">{product.name}</h3>
    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
    <div className="flex justify-between items-center">
      <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
      <span className="text-sm text-gray-500">Còn: {product.stock}</span>
    </div>
    <div className="mt-4 flex space-x-2">
      <button 
        onClick={() => onEdit(product)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sửa
      </button>
      <button 
        onClick={() => onDelete(product.id)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Xóa
      </button>
    </div>
  </div>
);

const ProductForm = ({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: [],
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Nhập tên sản phẩm"
          title="Tên sản phẩm"
          aria-label="Tên sản phẩm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          required
          placeholder="Nhập mô tả sản phẩm"
          title="Mô tả sản phẩm"
          aria-label="Mô tả sản phẩm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Nhập giá sản phẩm"
            title="Giá sản phẩm"
            aria-label="Giá sản phẩm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Số lượng</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Nhập số lượng sản phẩm"
            title="Số lượng sản phẩm"
            aria-label="Số lượng sản phẩm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          title="Chọn danh mục sản phẩm"
          aria-label="Chọn danh mục sản phẩm"
        >
          <option value="">Chọn danh mục</option>
          {mockCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    category: product.category,
    stock: product.stock,
    image: product.image || product.images?.[0] || '',
    images: product.images || [],
    status: (product.status as 'active' | 'inactive') || 'active',
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString()
  })));
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (newProduct: Partial<Product>) => {
    const product: Product = {
      ...newProduct as Product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, product]);
    setIsAdding(false);
  };

  const handleEditProduct = (updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id 
        ? { ...p, ...updatedProduct, updatedAt: new Date().toISOString() }
        : p
    ));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
          title="Tìm kiếm sản phẩm"
          aria-label="Tìm kiếm sản phẩm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
          title="Lọc theo danh mục"
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {mockCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Form thêm/sửa sản phẩm */}
      {(isAdding || editingProduct) && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">
            {isAdding ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
          </h2>
          <ProductForm
            product={editingProduct || undefined}
            onSave={isAdding ? handleAddProduct : handleEditProduct}
            onCancel={() => {
              setIsAdding(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { mockCategories } from '../../data/mockData';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  image: string;
  images?: string[];
  slug: string;
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
  isLoading?: boolean;
}

interface ApiResponse {
  products: Product[];
  countProducts: number;
  page: number;
  pages: number;
}

const ProductCard = ({ product, onEdit, onDelete }: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="aspect-square bg-gray-100 rounded-lg mb-4">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      )}
    </div>
    <h3 className="font-medium text-lg mb-2">{product.name}</h3>
    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
    <div className="flex justify-between items-center">
      <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
      <span className="text-sm text-gray-500">Còn: {product.countInStock}</span>
    </div>
    <div className="mt-4 flex space-x-2">
      <button 
        onClick={() => onEdit(product)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sửa
      </button>
      <button 
        onClick={() => onDelete(product._id)}
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
    brand: '',
    countInStock: 0,
    image: '',
    slug: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setIsUploading(false);
      return data.image;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = { ...formData };
    
    if (imageFile) {
      const uploadedImagePath = await uploadImage();
      if (uploadedImagePath) {
        productData.image = uploadedImagePath;
      }
    }
    
    onSave(productData);
  };

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData({ ...formData, slug });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={generateSlug}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Slug tự động tạo từ tên"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          required
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Nhập giá sản phẩm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Số lượng</label>
          <input
            type="number"
            value={formData.countInStock || 0}
            onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Nhập số lượng sản phẩm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Danh mục</label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            title="Danh mục sản phẩm"
          >
            <option value="">Chọn danh mục</option>
            {mockCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Nhập thương hiệu"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-1 block w-full"
          accept="image/*"
          title="Chọn hình ảnh sản phẩm"
          placeholder="Chọn hình ảnh sản phẩm"
        />
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Ảnh hiện tại:</p>
            <img 
              src={formData.image} 
              alt="Hình ảnh sản phẩm" 
              className="mt-1 h-32 object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isUploading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isUploading}
        >
          {isUploading ? 'Đang tải lên...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Gọi API để lấy dữ liệu sản phẩm
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>(
        `http://localhost:5000/api/products/admin?page=${page}`
      );
      setProducts(data.products);
      setTotalPages(data.pages);
      setCurrentPage(data.page);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/products',
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setEditingProduct(data.product);
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (updatedProduct: Partial<Product>) => {
    if (!editingProduct) return;
    
    const productId = editingProduct._id;
    setLoading(true);
    
    try {
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        updatedProduct,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setEditingProduct(null);
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
          title="Tìm kiếm sản phẩm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
          title="Lọc theo danh mục"
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
      {editingProduct && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Sửa sản phẩm</h2>
          <ProductForm
            product={editingProduct}
            onSave={handleEditProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {/* Hiển thị danh sách sản phẩm */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={setEditingProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProducts(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

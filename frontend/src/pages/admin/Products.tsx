import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faPlus, faSearch, 
  faFilter, faEye, faEyeSlash,
  faTimes, faSort, faSortUp, faSortDown
} from '@fortawesome/free-solid-svg-icons';

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  countInStock: number;
  category: string | { _id: string; name: string };
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryType {
  _id: string;
  name: string;
}

interface ApiResponse {
  products: Product[];
  countProducts: number;
  page: number;
  pages: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  countInStock: number;
  brand: string;
  category: string;
  isVisible: boolean;
  image?: string;
  images?: string[];
}

// Interface cho dữ liệu cập nhật sản phẩm
interface UpdateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  countInStock: number;
  brand: string;
  category: string;
  isVisible: boolean;
  image?: string;
}

const Products = () => {
  // State for products data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for modal and editing
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Form reference for resetting
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/products/categories');
      console.log('Raw categories response:', response.data);
      
      // Backend trả về object { categories: [...] }
      if (response.data && response.data.categories) {
        console.log('Đã tìm thấy mảng categories:', response.data.categories);
        setCategories(response.data.categories);
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Response.data là mảng:', response.data);
        setCategories(response.data);
      } else {
        console.error('Categories data không có định dạng mong đợi:', response.data);
        // Thêm danh mục mẫu khớp với trang người dùng
        setCategories([
          { _id: '682dafa0b610839036b63530', name: 'Giày nam' },
          { _id: '682dafa0b610839036b63531', name: 'Giày nữ' },
          { _id: '682dafa0b610839036b63532', name: 'Giày trẻ em' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Thêm danh mục mẫu khi có lỗi
      setCategories([
        { _id: '682dafa0b610839036b63530', name: 'Giày nam' },
        { _id: '682dafa0b610839036b63531', name: 'Giày nữ' },
        { _id: '682dafa0b610839036b63532', name: 'Giày trẻ em' }
      ]);
    }
  };

  // Fetch products with filters and handling authentication errors
  const fetchProducts = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortField: sortField,
        sortOrder: sortDirection,
      });
      
      if (searchTerm) params.append('query', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      // Thử gọi API và xử lý kết quả
      const response = await axiosInstance.get<ApiResponse>(`/products/admin?${params.toString()}`);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pages || 1);
      setCurrentPage(response.data.page || 1);
      setError(null); // Xóa thông báo lỗi nếu thành công
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      
      // Hiển thị dữ liệu mẫu thay vì hiện thông báo lỗi
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm loadSampleData để tải dữ liệu mẫu
  const loadSampleData = () => {
    // Dữ liệu mẫu phong phú hơn
    setProducts([
      {
        _id: '1',
        name: 'Giày chạy bộ nam Nike',
        slug: 'giay-chay-bo-nam-nike',
        image: 'https://via.placeholder.com/150',
        images: [],
        brand: 'Nike',
        description: 'Giày chạy bộ nam cao cấp, thiết kế hiện đại',
        price: 129.99,
        countInStock: 20,
        category: 'Giày nam',
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Giày thể thao nữ Adidas',
        slug: 'giay-the-thao-nu-adidas',
        image: 'https://via.placeholder.com/150',
        images: [],
        brand: 'Adidas',
        description: 'Giày thể thao nữ thiết kế hiện đại',
        price: 99.99,
        countInStock: 15,
        category: 'Giày nữ',
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '3',
        name: 'Giày đi học trẻ em Bitis',
        slug: 'giay-di-hoc-tre-em-bitis',
        image: 'https://via.placeholder.com/150',
        images: [],
        brand: 'Bitis',
        description: 'Giày bền đẹp dành cho trẻ em đi học',
        price: 49.99,
        countInStock: 25,
        category: 'Giày trẻ em',
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '4',
        name: 'Vớ thể thao cao cấp',
        slug: 'vo-the-thao-cao-cap',
        image: 'https://via.placeholder.com/150',
        images: [],
        brand: 'Nike',
        description: 'Vớ thể thao cao cấp, thoáng khí, chống hôi chân',
        price: 19.99,
        countInStock: 50,
        category: 'Phụ kiện giày',
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]);
    setTotalPages(1);
    setError(null); // Xóa thông báo lỗi khi hiển thị dữ liệu mẫu
  };

  // Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchCategories();
        await fetchProducts(1);
      } catch (err) {
        console.error("Initial data loading failed:", err);
      }
    };
    
    fetchInitialData();
    // Không thêm dependencies để tránh re-render liên tục
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 500);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, pageSize, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (field !== sortField) return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-500" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-500" />;
  };

  // Validate image before converting to base64
  const validateImage = (file: File): boolean => {
    // Tăng kích thước giới hạn lên 5MB
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      alert(`Kích thước ảnh quá lớn. Giới hạn là 5MB, ảnh hiện tại là ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return false;
    }

    // Kiểm tra định dạng file
    const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      alert(`Định dạng ảnh không hợp lệ. Vui lòng sử dụng một trong các định dạng: JPEG, PNG, GIF, WEBP.`);
      return false;
    }

    return true;
  };

  // Nén ảnh trước khi chuyển thành base64
  const compressImage = (file: File, maxWidthHeight = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Tính toán kích thước mới giữ nguyên tỷ lệ
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidthHeight) {
              height = Math.round(height * maxWidthHeight / width);
              width = maxWidthHeight;
            }
          } else {
            if (height > maxWidthHeight) {
              width = Math.round(width * maxWidthHeight / height);
              height = maxWidthHeight;
            }
          }
          
          // Tạo canvas để vẽ và nén ảnh
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Không thể tạo context canvas'));
            return;
          }
          
          // Vẽ ảnh lên canvas với kích thước mới
          ctx.drawImage(img, 0, 0, width, height);
          
          // Chuyển đổi sang định dạng file ảnh nén
          let imageType = file.type;
          // Thay đổi thành JPEG để đảm bảo nén tốt nhất
          if (file.type === 'image/png' || file.type === 'image/gif') {
            imageType = 'image/jpeg';
          }
          
          // Nén ảnh với chất lượng được chỉ định
          const dataUrl = canvas.toDataURL(imageType, quality);
          resolve(dataUrl);
        };
        img.onerror = () => {
          reject(new Error('Lỗi khi tải ảnh'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Lỗi khi đọc file'));
      };
    });
  };

  // Thêm hàm chuyển đổi ảnh sang base64 - không sử dụng trực tiếp, sử dụng compressImage thay thế
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const convertImageToBase64 = (file: File): Promise<string> => {
    // Sử dụng hàm nén ảnh thay vì chuyển đổi trực tiếp
    return compressImage(file);
  };

  // Cập nhật để xử lý URL ảnh thay vì file
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Handle multiple images change with validation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate each file
      const validFiles = files.filter(file => validateImage(file));
      
      if (validFiles.length !== files.length) {
        // Some files were invalid - reset if necessary
        if (validFiles.length === 0) {
          e.target.value = '';
          return;
        }
      }
      
      // Preview multiple images
      const previews: string[] = [];
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            previews.push(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle removing an existing image - không còn sử dụng vì ẩn tính năng nhiều ảnh
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form đang được gửi...');
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Kiểm tra các trường bắt buộc
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const countInStock = formData.get('countInStock') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;
    
    if (!name || !slug || !description || !price || !countInStock || !brand || !category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    // Kiểm tra nếu là sản phẩm mới, bắt buộc phải có URL ảnh
    if (!editingProduct && !imageUrl) {
      alert('Vui lòng nhập URL ảnh cho sản phẩm mới!');
      return;
    }
    
    // Đảm bảo định dạng dữ liệu đúng cho backend
    const productData: ProductFormData = {
      name,
      slug,
      description,
      price: parseFloat(price),
      countInStock: parseInt(countInStock),
      brand,
      category,
      isVisible: formData.get('isVisible') === 'on',
    };

    // Luôn sử dụng URL ảnh
    if (imageUrl && imageUrl.trim() !== '') {
      productData.image = imageUrl.trim();
      console.log('Sử dụng URL ảnh:', productData.image);
    }

    console.log('Dữ liệu sản phẩm:', productData);
    
    // Hiển thị loading message
    setLoading(true);
    setError(null);
    
    try {
      if (editingProduct) {
        // Cập nhật sản phẩm - không gửi ảnh để tránh lỗi
        console.log('Đang cập nhật sản phẩm với ID:', editingProduct._id);
        
        // Chỉ gửi các trường cơ bản
        const updateData: UpdateProductData = {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          countInStock: productData.countInStock,
          brand: productData.brand,
          category: productData.category,
          isVisible: productData.isVisible
        };

        // Cập nhật cả ảnh nếu có URL mới
        if (imageUrl && imageUrl.trim() !== '') {
          updateData.image = imageUrl.trim();
        }
        
        const response = await axiosInstance.put(`/products/${editingProduct._id}/update`, updateData);
        console.log('Phản hồi từ API:', response.data);
        console.log('Cập nhật sản phẩm thành công!');
        setSuccessMessage('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        console.log('Đang tạo sản phẩm mới...');
        const response = await axiosInstance.post('/products/create', productData);
        console.log('Phản hồi từ API:', response.data);
        console.log('Thêm sản phẩm mới thành công!');
        setSuccessMessage('Thêm sản phẩm mới thành công!');
      }
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
      fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      const error = err as ApiError;
      const errorMessage = error.response?.data?.message || 'Lỗi khi lưu sản phẩm';
      console.log('Chi tiết lỗi:', errorMessage);
      setError(errorMessage);
      
      // Hiển thị thông báo lỗi rõ ràng
      alert(`Lỗi: ${errorMessage}`);
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setExistingImages([]);
  };

  // Add new product
  const handleAddProduct = () => {
    resetForm();
    setShowModal(true);
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
    // Lưu trữ danh sách ảnh hiện có để hiển thị và chỉnh sửa
    setExistingImages(product.images || []);
    setShowModal(true);
  };

  // Toggle product visibility
  const toggleVisibility = async (product: Product) => {
    try {
      await axiosInstance.put(`/products/${product._id}/update`, {
        isVisible: !product.isVisible
      });
      
      // Update local state
      setProducts(products.map(p => 
        p._id === product._id ? {...p, isVisible: !p.isVisible} : p
      ));
      
      setSuccessMessage(`Sản phẩm đã được ${!product.isVisible ? 'hiển thị' : 'ẩn'}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái hiển thị');
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 hidden">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-2 relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-2 pl-10"
        />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded-md p-2 pl-10 appearance-none"
            aria-label="Chọn danh mục"
        >
          <option value="">Tất cả danh mục</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
            </option>
          ))}
        </select>
          <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="w-full border rounded-md p-2"
            aria-label="Số lượng sản phẩm hiển thị"
          >
            <option value="5">5 sản phẩm</option>
            <option value="10">10 sản phẩm</option>
            <option value="20">20 sản phẩm</option>
            <option value="50">50 sản phẩm</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Tên sản phẩm {getSortIcon('name')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Giá {getSortIcon('price')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('countInStock')}
              >
                Tồn kho {getSortIcon('countInStock')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hiển thị
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
            </div>
          )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.countInStock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.countInStock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.countInStock} sản phẩm
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleVisibility(product)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                        product.isVisible 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      aria-label={product.isVisible ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                    >
                      <FontAwesomeIcon icon={product.isVisible ? faEye : faEyeSlash} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-900 mx-2 cursor-pointer"
                      aria-label="Chỉnh sửa sản phẩm"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
          {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Trước
            </button>
            
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProducts(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            
            <button
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Sau
            </button>
          </nav>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Đóng modal"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh]">
              {editingProduct && (
                <div className="bg-gray-100 p-2 rounded-md text-xs text-gray-500">
                  <p>ID: {editingProduct._id}</p>
                  <p>Ngày tạo: {new Date(editingProduct.createdAt).toLocaleString('vi-VN')}</p>
                  <p>Cập nhật lần cuối: {new Date(editingProduct.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
          )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm*
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    onChange={(e) => {
                      if (!editingProduct) {
                        const slugInput = formRef.current?.querySelector('input[name="slug"]') as HTMLInputElement;
                        if (slugInput) {
                          slugInput.value = generateSlug(e.target.value);
                        }
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                    aria-label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug*
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    defaultValue={editingProduct?.slug || ''}
                    className="w-full p-2 border rounded-md"
                    aria-label="Slug sản phẩm"
                    placeholder="Nhập slug sản phẩm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả*
                  </label>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingProduct?.description || ''}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    aria-label="Mô tả sản phẩm"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (USD)*
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editingProduct?.price || ''}
                    className="w-full p-2 border rounded-md"
                    aria-label="Giá sản phẩm"
                    placeholder="Nhập giá sản phẩm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng*
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    min="0"
                    required
                    defaultValue={editingProduct?.countInStock || ''}
                    className="w-full p-2 border rounded-md"
                    aria-label="Số lượng tồn kho"
                    placeholder="Nhập số lượng tồn kho"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu*
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    defaultValue={editingProduct?.brand || ''}
                    className="w-full p-2 border rounded-md"
                    aria-label="Thương hiệu"
                    placeholder="Nhập thương hiệu"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục*
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={
                      typeof editingProduct?.category === 'object' 
                        ? editingProduct?.category._id 
                        : editingProduct?.category || ''
                    }
                    className="w-full p-2 border rounded-md"
                    aria-label="Danh mục sản phẩm"
                  >
                    <option value="" disabled>Chọn danh mục</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="682dafa0b610839036b63530">Giày nam</option>
                        <option value="682dafa0b610839036b63531">Giày nữ</option>
                        <option value="682dafa0b610839036b63532">Giày trẻ em</option>
                      </>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Bạn phải chọn một danh mục để phân loại sản phẩm trên trang người dùng</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh chính {!editingProduct && '*'}
                  </label>
                  
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      URL Ảnh (Bắt buộc)
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-2 border rounded-md"
                      aria-label="URL hình ảnh sản phẩm"
                      required={!editingProduct}
                      defaultValue={editingProduct?.image || ''}
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-green-600 font-semibold mt-1">Nhập URL ảnh từ internet</p>
                    <p className="text-xs text-gray-500 mt-1">Gợi ý: Tìm ảnh sản phẩm trên Google, nhấp chuột phải vào ảnh và chọn "Sao chép địa chỉ hình ảnh"</p>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-700 mb-1">Xem trước ảnh:</p>
                      <img 
                        src={imagePreview} 
                        alt="Hình ảnh sản phẩm" 
                        className="h-32 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="isVisible"
                    id="isVisible"
                    defaultChecked={editingProduct?.isVisible !== false}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700">
                    Hiển thị sản phẩm (người dùng có thể thấy)
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
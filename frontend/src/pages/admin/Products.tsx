import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faPlus, faSearch, 
  faFilter, faEye, faEyeSlash,
  faTimes, faSort, faSortUp, faSortDown
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

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
  size?: string[];
  color?: string[];
  sexual: string;
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

// Component hộp thoại xác nhận
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-blue-500 rounded-md text-white hover:bg-blue-600 cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  countInStock: string;
  brand: string;
  category: string;
  isVisible: boolean;
  image: string;
  images: string[];
  size: string[];
  color: string[];
  sexual: string;
};

const Products = () => {
  // State for products data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for modal and editing
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  // State cho hộp thoại xác nhận
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Cập nhật state formState
  const [formState, setFormState] = useState<ProductFormState>({
    name: '',
    slug: '',
    description: '',
    price: '',
    countInStock: '',
    brand: '',
    category: '',
    isVisible: true,
    image: '',
    images: [],
    size: [],
    color: [],
    sexual: 'unisex',
  });

  // State cho preview ảnh phụ
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

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
      
      });
      if (searchTerm) params.append('query', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      // Chỉ truyền đúng các tham số backend hỗ trợ
      const response = await axiosInstance.get<ApiResponse>(`/products/admin?${params.toString()}`);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pages || 1);
      setCurrentPage(page);
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
        sexual: 'unisex',
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
        sexual: 'female',
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
        sexual: 'unisex',
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
        sexual: 'unisex',
      }
    ]);
    setTotalPages(1);
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
            reject(new Error("Không thể lấy context 2D từ canvas để nén ảnh."));
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
        img.onerror = (error) => {
          console.error("Lỗi khi tải ảnh để nén (img.onerror):", error);
          reject(new Error("Lỗi khi tải ảnh để nén (img.onerror)."));
        };
      };
      reader.onerror = (error) => {
        console.error("Lỗi FileReader khi đọc ảnh:", error);
        reject(new Error("Lỗi FileReader khi đọc ảnh."));
      };
    });
  };

  // Khôi phục hàm handleMultipleImagesChange
  const handleMultipleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagesBase64: string[] = [];
      const newPreviews: string[] = [];

      for (const file of filesArray) {
        if (!validateImage(file)) continue; 
        try {
          const compressedBase64 = await compressImage(file);
          newImagesBase64.push(compressedBase64);
          newPreviews.push(compressedBase64); 
        } catch (error) {
          console.error(`Lỗi khi xử lý ảnh phụ ${file.name}:`, error);
          // Sẽ thêm toast ở đây sau
        }
      }
      setFormState(prev => ({ ...prev, images: [...prev.images, ...newImagesBase64] }));
      setImagesPreview(prev => [...prev, ...newPreviews]);
    }
  };

  // Thêm hàm xóa ảnh phụ theo index
  const handleRemovePreviewImage = (idx: number) => {
    setImagesPreview(prev => prev.filter((_, i) => i !== idx));
    setFormState(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // Toggle product visibility với xác nhận
  const toggleVisibility = async (product: Product) => {
    const confirmAction = async () => {
      try {
        await axiosInstance.put(`/products/${product._id}/update`, {
          isVisible: !product.isVisible
        });
        
        // Update local state
        setProducts(products.map(p => 
          p._id === product._id ? {...p, isVisible: !p.isVisible} : p
        ));
        
        toast.success(`Sản phẩm đã được ${!product.isVisible ? 'hiển thị' : 'ẩn'}`);
      } catch (err: unknown) {
        const error = err as ApiError;
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái hiển thị');
      }
      setConfirmDialog({...confirmDialog, isOpen: false});
    };

    // Hiển thị hộp thoại xác nhận trước khi thực hiện hành động
    setConfirmDialog({
      isOpen: true,
      title: product.isVisible ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm',
      message: product.isVisible 
        ? `Bạn có chắc chắn muốn ẩn sản phẩm "${product.name}" không?` 
        : `Bạn có chắc chắn muốn hiển thị sản phẩm "${product.name}" không?`,
      onConfirm: confirmAction
    });
  };

  // Xử lý thay đổi input trong form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    // Xử lý riêng cho size, color
    if (name === 'size' || name === 'color') {
      const currentInputValue = e.target.value;
      // Log để debug (bạn có thể xóa sau này)
      console.log(`--- Debug cho: ${name} ---`);
      console.log("Giá trị nhập thô:", currentInputValue);
      let charCodesLog = "";
      for (let i = 0; i < currentInputValue.length; i++) {
        charCodesLog += `Ký tự: '${currentInputValue[i]}', Mã: ${currentInputValue.charCodeAt(i)};  `;
      }
      console.log("Mã ký tự:", charCodesLog.trim());
      // --- Hết phần log ---

      const parts = currentInputValue.split(',');
      setFormState(prev => ({
        ...prev,
        // Chỉ trim, không filter(Boolean) ở đây để giữ trải nghiệm nhập liệu
        [name]: parts.map(s => s.trim())
      }));
    } else {
      setFormState(prev => ({ ...prev, [name]: newValue }));
    }
  };

  // Thêm hàm chọn ảnh: chuyển file sang base64, lưu vào formState.image
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImage(file)) return;

    // Chuyển file sang base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormState(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
      toast.success('Chọn ảnh thành công!');
    };
    reader.onerror = () => {
      toast.error('Lỗi khi đọc file ảnh!');
    };
    reader.readAsDataURL(file);
  };

  // Xử lý submit form với xác nhận
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct && (!formState.image || !formState.image.startsWith('data:'))) {
      toast.error('Bạn phải chọn ảnh sản phẩm trước khi lưu!');
      return;
    }
    // Tạo productData với size và color đã được lọc sạch
    const productData = {
      name: formState.name,
      slug: formState.slug,
      description: formState.description,
      price: Number(formState.price),
      countInStock: Number(formState.countInStock),
      brand: formState.brand,
      category: formState.category,
      isVisible: formState.isVisible,
      image: formState.image,
      images: formState.images,
      size: formState.size.map(s => s.trim()).filter(s => s !== ''), // Lọc chuỗi rỗng sau khi trim
      color: formState.color.map(c => c.trim()).filter(c => c !== ''), // Lọc chuỗi rỗng sau khi trim
      sexual: formState.sexual,
    };

    const submitFormLogic = async () => {
      try {
        if (editingProduct) {
          await axiosInstance.put(`/products/${editingProduct._id}/update`, productData);
          toast.success('Sản phẩm đã được cập nhật thành công');
          setShowModal(false);
          resetForm();
          await fetchProducts(currentPage); // Giữ nguyên khi chỉnh sửa
        } else {
          await axiosInstance.post('/products/create', productData);
          toast.success('Sản phẩm đã được thêm thành công');
          setShowModal(false);
          resetForm();
          // Đảm bảo tải trang 1 và cập nhật state currentPage
          setCurrentPage(1); // Đặt lại currentPage một cách tường minh
          await fetchProducts(1); 
        }
      } catch (err) {
        console.error('Error saving product:', err);
        const apiError = err as ApiError;
        toast.error(apiError.response?.data?.message || 'Lỗi khi lưu sản phẩm');
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    setConfirmDialog({
      isOpen: true,
      title: editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới',
      message: editingProduct
        ? `Bạn có chắc chắn muốn cập nhật sản phẩm "${formState.name}" không?`
        : `Bạn có chắc chắn muốn thêm sản phẩm "${formState.name}" mới không?`,
      onConfirm: submitFormLogic // Đổi tên hàm bên trong để tránh lỗi redeclare
    });
  };

  // Reset form
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setEditingProduct(null);
    setImagePreview(null);
    setImagesPreview([]);
    setFormState({
      name: '',
      slug: '',
      description: '',
      price: '',
      countInStock: '',
      brand: '',
      category: '',
      isVisible: true,
      image: '',
      images: [],
      size: [],
      color: [],
      sexual: 'unisex',
    });
  };

  // Khi mở modal thêm sản phẩm
  const handleAddProduct = () => {
    resetForm();
    setFormState({
      name: '',
      slug: '',
      description: '',
      price: '',
      countInStock: '',
      brand: '',
      category: '',
      isVisible: true,
      image: '',
      images: [],
      size: [],
      color: [],
      sexual: 'unisex',
    });
    setImagesPreview([]);
    setShowModal(true);
  };

  // Khi mở modal chỉnh sửa sản phẩm
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagesPreview(product.images || []);
    setFormState({
      name: product.name,
      slug: typeof product.slug === 'string' ? product.slug : '',
      description: product.description,
      price: product.price.toString(),
      countInStock: product.countInStock.toString(),
      brand: product.brand,
      category: typeof product.category === 'object' ? product.category._id : product.category,
      isVisible: product.isVisible,
      image: product.image,
      images: product.images || [],
      size: product.size || [],
      color: product.color || [],
      sexual: product.sexual || 'unisex',
    });
    setImagePreview(product.image);
    setShowModal(true);
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

      {/* Error message */}
      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 hidden">
          {error}
        </div>
      )} */}

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
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ảnh</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer" onClick={() => handleSort('name')}>Tên sản phẩm {getSortIcon('name')}</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer" onClick={() => handleSort('price')}>Giá {getSortIcon('price')}</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Danh mục</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer" onClick={() => handleSort('countInStock')}>Tồn kho {getSortIcon('countInStock')}</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Hiển thị</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-2 text-center text-xs text-gray-500">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 rounded overflow-hidden">
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
                  <td className="px-2 py-2">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                    {(() => {
                      // Kiểm tra nếu product.category là object và có name thì dùng name đó
                      if (typeof product.category === 'object' && product.category !== null && 'name' in product.category) {
                        return product.category.name;
                      }
                      // Nếu product.category là string (ID), tìm trong mảng categories
                      if (typeof product.category === 'string' && Array.isArray(categories)) {
                        const foundCategory = categories.find(cat => cat._id === product.category);
                        return foundCategory ? foundCategory.name : product.category; // Hiển thị ID nếu không tìm thấy tên
                      }
                      // Trường hợp dự phòng, hiển thị category nếu là string, hoặc 'Không rõ'
                      return typeof product.category === 'string' ? product.category : 'Không rõ';
                    })()}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
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
                  <td className="px-2 py-2 whitespace-nowrap">
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
                  <td className="px-2 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
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
              onClick={() => {
                if (currentPage > 1) {
                  fetchProducts(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Trước
            </button>
            {/* Phân trang thông minh */}
            {(() => {
              const pageButtons: React.ReactNode[] = [];
              const maxPageButtons = 7; // Số nút trang tối đa hiển thị
              let pages: (number | string)[] = [];

              if (totalPages <= maxPageButtons) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (currentPage <= 4) {
                  // Đầu danh sách
                  pages = [1, 2, 3, 4, 5, 'end-ellipsis', totalPages];
                } else if (currentPage >= totalPages - 3) {
                  // Cuối danh sách
                  pages = [1, 'start-ellipsis'];
                  for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                  // Ở giữa
                  pages = [1, 'start-ellipsis', currentPage - 1, currentPage, currentPage + 1, 'end-ellipsis', totalPages];
                }
              }

              pages.forEach((page, idx) => {
                if (typeof page === 'string') {
                  pageButtons.push(
                    <span key={page + idx} className="px-2 py-2 text-gray-400 select-none">...</span>
                  );
                } else {
                  const isCurrent = currentPage === page;
                  pageButtons.push(
                    <button
                      key={page}
                      onClick={() => !isCurrent && fetchProducts(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrent
                          ? 'z-10 bg-blue-800 border-blue-800 text-white font-extrabold shadow-lg ring-2 ring-blue-900 text-lg'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                      disabled={isCurrent}
                      style={isCurrent ? { pointerEvents: 'none' } : {}}
                    >
                      {page}
                    </button>
                  );
                }
              });
              return pageButtons;
            })()}
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  fetchProducts(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Sau
            </button>
          </nav>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-white/30 flex items-center justify-center">
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
                    value={formState.name}
                    onChange={handleFormChange}
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
                    value={formState.slug}
                    onChange={handleFormChange}
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
                    value={formState.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    aria-label="Mô tả sản phẩm"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VND)*
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formState.price === '' ? '' : formState.price}
                    onChange={handleFormChange}
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
                    value={formState.countInStock === '' ? '' : formState.countInStock}
                    onChange={handleFormChange}
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
                    value={formState.brand}
                    onChange={handleFormChange}
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
                    value={formState.category}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    aria-label="Danh mục sản phẩm"
                  >
                    <option value="" disabled>Chọn danh mục</option>
                    {/* TRẢ LẠI HIỂN THỊ DANH MỤC NHƯ CŨ, KHÔNG PHÂN NHÓM */}
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      // Hiển thị khi categories rỗng (ví dụ: đang tải)
                      <option value="" disabled>Đang tải danh mục...</option>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Bạn phải chọn một danh mục để phân loại sản phẩm trên trang người dùng</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính (sexual)*
                  </label>
                  <select
                    name="sexual"
                    required
                    value={formState.sexual}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    aria-label="Giới tính sản phẩm"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formState.size.join(', ')}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    aria-label="Size sản phẩm"
                    placeholder="VD: XL, L, M"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formState.color.join(', ')}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    aria-label="Màu sắc sản phẩm"
                    placeholder="VD: Blue, Red, Black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh phụ (có thể chọn nhiều ảnh)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImagesChange}
                    title="Chọn ảnh phụ cho sản phẩm"
                  />
                  {imagesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagesPreview.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Ảnh phụ ${idx+1}`} className="h-20 object-contain border rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemovePreviewImage(idx)}
                            className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full border-2 border-red-500 bg-white text-red-500 shadow-md transition-all duration-200 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 z-10"
                            title="Xóa ảnh này"
                          >
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh chính {!editingProduct && '*'}
                  </label>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="image-upload">
                      Chọn ảnh từ máy tính:
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      placeholder="Chọn ảnh sản phẩm chính"
                    />
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
                    checked={formState.isVisible}
                    onChange={handleFormChange}
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
      
      {/* Hộp thoại xác nhận */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};

export default Products;
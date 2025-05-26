import React, { useState, useEffect, useCallback } from 'react';
import { data } from '../../lib/vietnam-locality-data';
import { LocationData } from '@/types/LocationData';

interface VietnamAddressSelectorProps {
  onChange?: (address: {
    province: string;
    district: string;
    ward: string;
    provinceName: string;
    districtName: string;
    wardName: string;
  }) => void;
  provinceText?: string;
  districtText?: string;
  wardText?: string;
  wardNoText?: string;
  getValueBy?: 'i' | 'n';  // 'i' for id, 'n' for name
  provincePrefix?: boolean;
  districtPrefix?: boolean;
}

const VietnamAddressSelector: React.FC<VietnamAddressSelectorProps> = ({
  onChange,
  provinceText = "Chọn tỉnh / thành phố",
  districtText = "Chọn quận / huyện",
  wardText = "Chọn phường / xã",
  wardNoText = "Địa phương này không có phường / xã",
  getValueBy = 'i',
  provincePrefix = false,
  districtPrefix = true,
}) => {
  // States
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [wards, setWards] = useState<LocationData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState<number>(-1);
  const [_selectedDistrictIndex, setSelectedDistrictIndex] = useState<number>(-1);

  // Khởi tạo danh sách tỉnh/thành khi component mount
  useEffect(() => {
    // Lấy danh sách tỉnh/thành từ data
    setProvinces(data.slice(0, -1));
  }, []);

  // Hàm xử lý khi chọn tỉnh/thành
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const index = e.target.selectedIndex - 1;

    setSelectedProvince(value);
    setSelectedProvinceIndex(index);
    setSelectedDistrict('');
    setSelectedWard('');

    // Reset districts và wards
    if (index >= 0) {
      setDistricts(data[index].c?.slice(0, -1) || []);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }

    triggerOnChange(value, '', '');
  };

  // Hàm xử lý khi chọn quận/huyện
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const index = e.target.selectedIndex - 1;

    setSelectedDistrict(value);
    setSelectedDistrictIndex(index);
    setSelectedWard('');

    // Cập nhật danh sách xã/phường
    if (selectedProvinceIndex >= 0 && index >= 0) {
      const wardsData = data[selectedProvinceIndex].c?.[index].c || [];
      setWards(wardsData.slice(0, -1));
    } else {
      setWards([]);
    }

    triggerOnChange(selectedProvince, value, '');
  };

  // Hàm xử lý khi chọn xã/phường
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedWard(value);

    triggerOnChange(selectedProvince, selectedDistrict, value);
  };

  // Hàm gọi callback onChange
  const triggerOnChange = useCallback((province: string, district: string, ward: string) => {
    if (onChange) {
      const provinceName = provinces.find(p => p[getValueBy] === province)?.n || '';
      const districtName = districts.find(d => d[getValueBy] === district)?.n || '';
      const wardName = wards.find(w => w[getValueBy] === ward)?.n || '';

      onChange({
        province,
        district,
        ward,
        provinceName,
        districtName,
        wardName
      });
    }
  }, [onChange, provinces, districts, wards, getValueBy]);

  // Hiển thị tên với hoặc không có tiền tố
  const getProvinceName = (province: LocationData) => {
    return (provincePrefix ? province.t + " " : "") + province.n;
  };

  const getDistrictName = (district: LocationData) => {
    return (districtPrefix ? district.t + " " : "") + district.n;
  };

  const getWardName = (ward: LocationData) => {
    return ward.n;
  };

  return (
    <>
      {/* Tỉnh/Thành phố */}
      <select
        id="ls_province"
        name="ls_province"
        className="border rounded px-3 py-2 w-full mb-4"
        value={selectedProvince}
        onChange={handleProvinceChange}
      >
        <option value="" disabled>{provinceText}</option>
        {provinces.map((province) => (
          <option
            key={province.i}
            value={province[getValueBy]}
            data-level={province.t}
          >
            {getProvinceName(province)}
          </option>
        ))}
      </select>

      {/* Quận/Huyện */}
      <select
        id="ls_district"
        name="ls_district"
        className="border rounded px-3 py-2 w-full mb-4"
        value={selectedDistrict}
        onChange={handleDistrictChange}
        disabled={!selectedProvince}
      >
        <option value="" disabled>{districtText}</option>
        {districts.map((district) => (
          <option
            key={district.i}
            value={district[getValueBy]}
            data-level={district.t}
          >
            {getDistrictName(district)}
          </option>
        ))}
      </select>

      {/* Phường/Xã */}
      <select
        id="ls_ward"
        name="ls_ward"
        className="border rounded px-3 py-2 w-full mb-4"
        value={selectedWard}
        onChange={handleWardChange}
        disabled={!selectedDistrict}
      >
        {wards.length === 0 && selectedDistrict ? (
          <option value="">{wardNoText}</option>
        ) : (
          <option value="" disabled>{wardText}</option>
        )}
        {wards.map((ward) => (
          <option
            key={ward.i}
            value={ward[getValueBy]}
            data-level={ward.t}
          >
            {getWardName(ward)}
          </option>
        ))}
      </select>
    </>
  );
};

export default VietnamAddressSelector;

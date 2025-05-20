import React, { useState } from "react";
import VietnamAddressSelector from "./VietnamAddressSelector";
import useCheckoutStore from "@/store/useCheckOutStore";
import { PaymentMethod } from "@/types/PaymentMethod";

export default function CheckoutForm() {
    const updateCustomerInfo = useCheckoutStore(state => state.updateCustomerInfo);
    const { goToNextStep } = useCheckoutStore();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [payment, setPayment] = useState<PaymentMethod>("cash");

    const handleAddressChange = (addr: { province: string; district: string; ward: string }) => {
        setProvince(addr.province);
        setDistrict(addr.district);
        setWard(addr.ward);
        updateCustomerInfo({
            province: addr.province,
            district: addr.district,
            ward: addr.ward,
        });
    };

    const handlePaymentChange = (method: PaymentMethod) => {
        setPayment(method);
        updateCustomerInfo({ paymentMethod: method });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCustomerInfo({
            fullName,
            phone,
            email,
            address,
            notes,
            paymentMethod: payment,
            province,
            district,
            ward,
        });
        // TODO
    };

    return (
        <div className="flex-1 bg-white p-8 rounded border">
            <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
            <form onSubmit={handleSubmit}>
                <div className="font-semibold mb-4 text-lg">THÔNG TIN THANH TOÁN</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Họ và tên *"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Số điện thoại *"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>
                <input
                    className="border rounded px-3 py-2 w-full mb-4"
                    placeholder="Địa chỉ email *"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <VietnamAddressSelector onChange={handleAddressChange} />
                <input
                    className="border rounded px-3 py-2 w-full mb-4"
                    placeholder="Địa Chỉ *"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                <textarea
                    className="border rounded px-3 py-2 w-full mb-4"
                    rows={3}
                    placeholder="Ghi Chú Đơn Hàng"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />

                <div className="font-semibold mb-2 mt-6 text-center text-base">PHƯƠNG THỨC THANH TOÁN</div>
                <div className="flex flex-col gap-2 mb-6 items-start">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            checked={payment === "cash"}
                            onChange={() => handlePaymentChange("cash")}
                            className="accent-blue-600"
                        />
                        Thanh Toán Khi Nhận Hàng
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            checked={payment === "momo"}
                            onChange={() => handlePaymentChange("momo")}
                            className="accent-blue-600"
                        />
                        Thanh Toán Qua Momo
                    </label>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-3 rounded font-semibold mt-4 hover:bg-red-700 transition"
                    onClick={() => {
                        goToNextStep();
                    }}>
                    Hoàn Tất Đơn Hàng
                </button>
            </form>
        </div>
    );
}

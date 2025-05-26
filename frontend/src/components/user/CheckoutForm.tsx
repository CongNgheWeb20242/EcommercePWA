import React, { useState } from "react";
import VietnamAddressSelector from "./VietnamAddressSelector";
import useCheckoutStore from "@/store/useCheckOutStore";
import { PaymentMethod } from "@/types/PaymentMethod";
import VnPayLogo from "@/assets/common/vnpay.png";
import { useAuthStore } from "@/store/useAuthStore";


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
    const [payment, setPayment] = useState<PaymentMethod>("cod");

    const user = useAuthStore(state => state.user);

    const isSubmitDisabled = !user;

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
        if (!user) return;
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

        goToNextStep()
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

                <div className="flex flex-col md:flex-row gap-6 mb-6 md:justify-between">
                    {/* Nút COD */}
                    <label
                        className={`flex cursor-pointer items-center gap-4 border rounded p-4 px-10 transition
      ${payment === "cod" ? "border-red-600 bg-red-50" : "border-gray-300 hover:border-red-400"}`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={payment === "cod"}
                            onChange={() => handlePaymentChange("cod")}
                            className="hidden"
                        />
                        <div className="text-red-600 text-2xl">💵</div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Thanh Toán Khi Nhận Hàng</span>
                            <span className="text-gray-500 text-sm">Thanh toán trực tiếp khi nhận hàng</span>
                        </div>
                    </label>

                    {/* Nút VNPay */}
                    <label
                        className={`flex cursor-pointer items-center gap-4 border rounded p-4 px-10 transition
      ${payment === "vnpay" ? "border-green-600 bg-green-50" : "border-gray-300 hover:border-green-400"}`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="vnpay"
                            checked={payment === "vnpay"}
                            onChange={() => handlePaymentChange("vnpay")}
                            className="hidden"
                        />
                        <img
                            src={VnPayLogo}
                            alt="VNPay"
                            className="h-8 w-auto"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Thanh Toán Qua VNPay</span>
                            <span className="text-gray-500 text-sm">Thanh toán trực tuyến qua VNPay</span>
                        </div>
                    </label>
                </div>


                <button
                    type="submit"
                    className={`w-full bg-red-600 text-white py-3 rounded font-semibold mt-4 hover:bg-red-700 transition
                        ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitDisabled}
                    title={!user ? "Vui lòng đăng nhập để hoàn tất đơn hàng" : ""}
                >
                    Hoàn Tất Đơn Hàng
                </button>
                {!user && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        Vui lòng đăng nhập để hoàn tất đơn hàng.
                    </div>
                )}
            </form>
        </div>
    );
}

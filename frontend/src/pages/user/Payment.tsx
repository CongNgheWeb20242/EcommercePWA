import React from "react";


// Trang thanh toán
const momoPaymentLink = "https://pay.momo.vn/"; //TODO

export default function Payment() {
    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded shadow p-8 mt-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Thanh toán đơn hàng</h2>
            <p className="mb-4 text-gray-700">Vui lòng chọn phương thức thanh toán:</p>

            <a
                href={momoPaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-4 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded transition"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                    alt="MoMo"
                    className="h-6"
                />
                Thanh toán qua MoMo
            </a>

            <button
                onClick={() => alert("Chuyển sang bước tiếp theo!")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
            >
                Tiếp tục
            </button>
        </div>
    );
}

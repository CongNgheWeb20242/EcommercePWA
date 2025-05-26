interface DeliveryConfirmationProps {
    isConfirmed: boolean;
    isDisabled: boolean;
    onConfirm: () => void;
    statusMessage: string;
}

const DeliveryConfirmation: React.FC<DeliveryConfirmationProps> = ({
    isConfirmed,
    isDisabled,
    onConfirm,
    statusMessage
}) => {
    if (isConfirmed) {
        return (
            <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-green-600 font-semibold mb-2">
                        🎉 Cảm ơn bạn đã xác nhận!
                    </div>
                    <p className="text-green-700 text-sm">
                        Đơn hàng đã được hoàn tất thành công. Chúc bạn hài lòng với sản phẩm!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 text-center">
            <button
                onClick={onConfirm}
                disabled={isDisabled}
                className={`
                    px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto
                    ${isDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }
                `}
            >
                {isDisabled ? (
                    <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        {statusMessage.includes('tải') ? 'Đang tải...' : 'Đang xử lý...'}
                    </>
                ) : (
                    <>
                        ✅ Xác nhận đã nhận hàng
                    </>
                )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
                {statusMessage}
            </p>
        </div>
    );
};

export default DeliveryConfirmation;

# 📘 Tóm tắt lý thuyết IPN VNPAY

## 🔐 IPN URL là gì?

- Là **đường dẫn trên server của bạn** mà VNPAY sẽ gửi request (dạng `GET`) sau khi khách hàng thanh toán xong.
- Dùng để **báo kết quả giao dịch** (thành công/thất bại).
- Là cơ chế **server → server**, không liên quan đến trình duyệt người dùng.

---

## 📌 Yêu cầu chính

| Mục                 | Mô tả |
|----------------------|-------|
| **Phương thức**      | `GET` |
| **SSL (HTTPS)**      | Bắt buộc phải sử dụng `https://` (có SSL) |
| **Thông tin nhận được** | Các `query params` như:  
  - `vnp_Amount`  
  - `vnp_TxnRef`  
  - `vnp_ResponseCode`  
  - `vnp_TransactionStatus`  
  - `vnp_SecureHash` |
| **Kiểm tra chữ ký (checksum)** | Phải tính lại `vnp_SecureHash` từ dữ liệu nhận được để xác minh tính toàn vẹn |
| **Xử lý**            | Sau khi xác minh, thực hiện các bước như cập nhật đơn hàng vào database, gửi thông báo... |
| **Phản hồi lại VNPAY** | Trả về JSON:  
```json
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
``` |

---

## 🔁 Cơ chế Retry của VNPAY

| Tình huống phản hồi | Ý nghĩa | Hành động của VNPAY |
|----------------------|---------|----------------------|
| `RspCode = 00` hoặc `02` | ✅ Giao dịch đã được cập nhật | ✅ Không gọi lại nữa |
| `RspCode = 01, 04, 97, 99` hoặc **không phản hồi** | ❌ Lỗi hoặc không xử lý được | 🔁 Gọi lại IPN tối đa 10 lần, mỗi lần cách nhau 5 phút |

---

## 🛡️ Bảo mật

- `vnp_SecureHash` là chữ ký để đảm bảo dữ liệu không bị thay đổi.
- Phải:
  1. Lấy tất cả `query params` trừ `vnp_SecureHash`.
  2. **Sắp xếp theo thứ tự alphabet**.
  3. **Tạo chuỗi ký tự để mã hóa bằng thuật toán `SHA512` với `secretKey`**.
  4. So sánh kết quả với `vnp_SecureHash` được gửi từ VNPAY.
- Nếu KHÔNG khớp → từ chối xử lý.

---

## 🧪 Môi trường phát triển (DEV)

- Trong môi trường local (dev), bạn không có SSL → không thể dùng `http://localhost` để test IPN.
- Cách xử lý:
  - Dùng [ngrok](https://ngrok.com/) để tạo đường dẫn HTTPS từ localhost.
  - Ví dụ: `https://abc123.ngrok.io/ipn`

---

## 📝 Ví dụ URL được gọi từ VNPAY
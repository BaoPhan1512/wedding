# Hướng dẫn dùng thiệp cưới (phong cách Lam Ngọc)

## Thư mục gồm gì

| File / thư mục | Dùng để |
|---|---|
| `config.js` | **Toàn bộ thông tin cưới. Chỉ cần sửa file này.** |
| `images/` | Ảnh cưới (hiện đang là ảnh mẫu `.svg`) |
| `music/nhac-nen.mp3` | Nhạc nền (đang là đoạn nhạc hộp nhạc tự soạn, dùng thoải mái) |
| `index.html`, `style.css`, `script.js` | Mã giao diện, không cần đụng tới |
| `google-apps-script.js` | Mã để nhận xác nhận tham dự & lời chúc vào Google Sheets |

## 1. Sửa thông tin

Mở `config.js` bằng Notepad (Windows), TextEdit (Mac) hoặc tốt nhất là [VS Code](https://code.visualstudio.com). Sửa chữ nằm giữa dấu ngoặc kép.

- **Tên cô dâu, chú rể**: mục `bride`, `groom`. `nameFirst: "bride"` hoặc `"groom"` để chọn tên ai đứng trước.
- **Bố mẹ hai bên**: mục `families`.
- **Sự kiện** (lễ vu quy, lễ thành hôn, tiệc…): mục `events`. Ngày viết `"2027-02-28"`, giờ `"17:30"`. Thứ, ngày âm lịch, lịch tháng và đếm ngược **tự tính**. Muốn thêm sự kiện, chép nguyên một khối `{ ... },`.
- **Sự kiện hiển thị ở trang đầu và để đếm ngược**: `mainEvent` (0 = sự kiện đầu tiên, 1 = thứ hai).
- **Link bản đồ**: mở Google Maps → tìm địa điểm → *Chia sẻ* → *Sao chép đường liên kết* → dán vào `mapUrl`.
- **Lịch trình, Dress code, Chuyện chúng mình, Lời cảm ơn**: các mục cùng tên. Muốn ẩn phần nào thì đặt `enabled: false`.
- **Tài khoản mừng cưới**: mục `gift.accounts`. Điền `bankId` theo mã VietQR (VCB, TCB, MB, ACB, BIDV, ICB = VietinBank, VBA = Agribank, TPB, VPB, STB = Sacombank…) và số tài khoản, **mã QR sẽ tự tạo**. Nếu thích dùng QR chụp từ app ngân hàng: chép ảnh vào `images/` rồi điền `qrImage: "images/qr-chu-re.jpg"`.

> Sửa xong, mở `index.html` bằng trình duyệt để xem thử. Nếu trang trắng tinh: thường do thiếu dấu phẩy `,` hoặc dấu ngoặc kép `"` trong `config.js`.

## 2. Thay ảnh và nhạc

1. Chép ảnh của bạn vào thư mục `images/` (nên dùng `.jpg`, rộng khoảng 1200px, mỗi ảnh dưới 500KB; nén ở [squoosh.app](https://squoosh.app) nếu ảnh nặng).
2. Trong `config.js`, đổi đường dẫn ở mục `photos` và `photo` của cô dâu/chú rể, ví dụ `hero: "images/anh-bia.jpg"`.
3. Album: thêm/bớt dòng trong `photos.album`, bao nhiêu ảnh cũng được.
4. Nhạc: chép file `.mp3` vào `music/` và sửa `music: "music/ten-bai.mp3"`. Để `""` nếu không muốn nhạc.
5. Ảnh và tiêu đề khi gửi link qua Zalo/Facebook: sửa 3 dòng `og:` trong `index.html`. Sau khi đưa web lên mạng, nên đổi `og:image` thành link đầy đủ, ví dụ `https://ten-cua-ban.netlify.app/images/anh-bia.jpg`.

## 3. Đưa thiệp lên mạng (miễn phí)

**Cách nhanh nhất: Netlify Drop**
1. Vào <https://app.netlify.com/drop> (đăng ký bằng email hoặc Google).
2. Kéo thả **cả thư mục** `thiep-cuoi-lam-ngoc` vào trang.
3. Vài giây sau có link dạng `https://abc-xyz.netlify.app`. Vào *Site configuration → Change site name* để đổi thành tên đẹp, ví dụ `baongoc-anhkhoa.netlify.app`.
4. Mỗi lần sửa: vào trang site → *Deploys* → kéo thả lại thư mục.

**Hoặc GitHub Pages**
1. Tạo repository mới trên GitHub (chế độ Public).
2. *Add file → Upload files* → kéo toàn bộ file và thư mục vào → *Commit*.
3. *Settings → Pages → Branch: main / (root) → Save*. Link sẽ là `https://<tên-github>.github.io/<tên-repo>/`.

## 4. Nhận xác nhận tham dự & lời chúc vào Google Sheets (tùy chọn)

Không làm bước này thì form vẫn hiện, khách vẫn thấy "cảm ơn", nhưng bạn sẽ không nhận được dữ liệu.

1. Tạo một Google Sheets mới (ví dụ tên "Khách mời đám cưới").
2. Menu **Tiện ích mở rộng → Apps Script**. Xóa hết mã có sẵn, dán toàn bộ nội dung file `google-apps-script.js`, bấm 💾 Lưu.
3. Bấm **Triển khai → Tùy chọn triển khai mới** → biểu tượng ⚙️ chọn **Ứng dụng web**:
   - *Thực thi dưới dạng*: **Tôi**
   - *Người có quyền truy cập*: **Bất kỳ ai**
4. Bấm **Triển khai**, cấp quyền cho tài khoản Google (chọn *Nâng cao → Đi tới… (không an toàn)* nếu Google cảnh báo, vì đây là mã của chính bạn).
5. Chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`) dán vào `googleScriptUrl` trong `config.js`.

Kết quả: sheet **XacNhan** ghi người xác nhận, sheet **LoiChuc** ghi lời chúc. Lời chúc thật sẽ thay lời chúc mẫu và bay lên trên thiệp. Muốn ẩn lời chúc nào, gõ `x` vào cột "Hiện" của dòng đó.

> Sửa mã Apps Script sau này thì phải *Triển khai → Quản lý triển khai → Sửa → Phiên bản mới* thì mới có hiệu lực.

## 5. Đổi màu (nâng cao)

Đầu file `style.css` có bảng màu: `--blue` (xanh lam chủ đạo), `--cream` (nền kem), `--red` (trái tim). Đổi mã màu ở đó là cả thiệp đổi theo.

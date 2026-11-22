/* =====================================================================
   FILE CẤU HÌNH THIỆP CƯỚI — CHỈ CẦN SỬA FILE NÀY
   ---------------------------------------------------------------------
   • Sửa chữ nằm giữa hai dấu ngoặc kép "..." là được.
   • Ngày viết dạng "NĂM-THÁNG-NGÀY", ví dụ "2027-02-28".
   • Giờ viết dạng "GIỜ:PHÚT" (24h), ví dụ "17:30".
   • Thứ trong tuần, ngày âm lịch, lịch tháng, đếm ngược… đều TỰ TÍNH,
     không cần nhập.
   • Ảnh: chép ảnh vào thư mục images/ rồi đổi tên file ở đây.
   • Giữ nguyên dấu phẩy , ở cuối mỗi dòng.
   ===================================================================== */

window.WEDDING = {
  /* Tiêu đề tab trình duyệt */
  pageTitle: "Thiệp cưới Tony & Jenifer",

  /* ---------------- CÔ DÂU & CHÚ RỂ ---------------- */
  bride: {
    name: "Jenifer",            // tên gọi in lớn trên thiệp
    photo: "images/anh-codau.png",  // ảnh cô dâu (khung vòm)
  },
  groom: {
    name: "Tony",
    photo: "images/anh-chure.png",
  },
  /* Tên ai đứng trước: "bride" (cô dâu trước, hợp lễ Vu Quy)
     hoặc "groom" (chú rể trước, hợp lễ Thành Hôn nhà trai) */
  nameFirst: "groom",

  /* ---------------- TRANG ĐẦU ---------------- */
  heroTitle: "Lễ Thành Hôn",
  /* Sự kiện chính hiển thị ở trang đầu & dùng để đếm ngược.
     0 = sự kiện đầu tiên trong danh sách events bên dưới, 1 = thứ hai... */
  mainEvent: 1,
  /* Địa điểm ngắn gọn ở hàng ngày-giờ-địa điểm trang đầu */
  heroVenue: "Nhà hàng Golden · 225 Nguyễn Tri Phương, Hải Châu, Đà Nẵng",

  quote:
    "Có những người đến rồi ở lại, thành mảnh ghép của nhau và thành một nhà. Chúng mình đã tìm thấy nhau như thế, và từ hôm nay xin được cùng nhau đi hết những mùa còn lại",

  /* ---------------- HAI GIA ĐÌNH ---------------- */
  families: {
    bride: {
      title: "Nhà Gái",
      father: "Ông Mai Văn Nghĩa",
      mother: "Bà Phan Thị Yến",
      address: "Tam Kỳ - Quảng Nam",
    },
    groom: {
      title: "Nhà Trai",
      father: "Ông Trương Văn Phúc",
      mother: "Bà Lê Thị Kim",
      address: "Hương Sơn - Hà Tĩnh",
    },
  },

  invitation: "Trân trọng kính mời bạn tới chung vui",

  /* ---------------- CÁC SỰ KIỆN ----------------
     Thêm / bớt bằng cách chép cả khối { ... }, */
  events: [
    {
      name: "Lễ Tân Hôn",
      date: "2027-02-28",
      time: "08:00",
      address: "Tư gia nhà trai · Hương Sơn, Hà Tĩnh",
      // Link Google Maps: mở Google Maps > chọn địa điểm > Chia sẻ > Sao chép đường liên kết
      mapUrl: "https://maps.google.com/?q=Ninh+Kieu+Can+Tho",
      lunar: "", // để trống = tự tính ngày âm. Muốn tự ghi thì điền, ví dụ "(Tức ngày 23 tháng Giêng năm Đinh Mùi)"
    },
    {
      name: "Tiệc Cưới Thân Mật",
      date: "2027-02-28",
      time: "11:00",
      address: "Nhà hàng Golden· 225 Nguyễn Tri Phương, Hải Châu, Đà Nẵng",
      mapUrl: "https://maps.google.com/?q=8+Hai+Ba+Trung+Ninh+Kieu+Can+Tho",
      lunar: "",
    },
  ],

  /* ---------------- LỊCH TRÌNH NGÀY VUI ----------------
     icon có thể chọn: "rings" (nhẫn), "camera" (máy ảnh),
     "glasses" (ly rượu), "heart" (trái tim), "plane" (máy bay giấy), "bouquet" (bó hoa) */
  timeline: [
    { time: "08:00", label: "Lễ Tân Hôn", icon: "rings" },
    { time: "10:30", label: "Đón khách", icon: "camera" },
    { time: "11:00", label: "Khai tiệc", icon: "glasses" },
  ],

  /* ---------------- DRESS CODE ---------------- */
  dressCode: {
    enabled: true,
    colors: [
      { color: "#4a6fa5", name: "Xanh lam" },
      { color: "#22252b", name: "Đen" },
      { color: "#efe3cc", name: "Kem" },
      { color: "#ffffff", name: "Trắng" },
    ],
    note: "Bạn ghé sớm một chút nhé, để chúng mình lưu giữ thật nhiều khoảnh khắc xinh đẹp cùng bạn!",
  },

  /* ---------------- CHUYỆN CHÚNG MÌNH ---------------- */
  story: {
    enabled: true,
    subtitle: "OUR STORY",
    title: "Chuyện chúng mình",
    paragraphs: [
      "Hai đứa ngồi chung một bàn năm lớp mười một, mượn nhau cây bút, chép bài giùm nhau, rồi chẳng biết từ lúc nào đã quen có nhau trong mỗi ngày. Mấy năm đại học xa nhà, những cuộc gọi muộn và những chuyến xe về thăm đã giữ chúng mình ở gần.",
      "Giờ đây, sau ngần ấy mùa thương, chúng mình muốn nắm tay nhau thật chặt, và mong bạn sẽ có mặt trong ngày chúng mình bắt đầu.",
    ],
  },

  countdownTitle: "Ngày vui sắp đến…",

  /* ---------------- ẢNH ----------------
     Nên dùng ảnh .jpg/.webp, chiều rộng ~1200px để thiệp tải nhanh */
  photos: {
    hero: "images/anh-bia.png",          // ảnh ngang ngay trang đầu
    invite: "images/anh-loi-moi.png",    // ảnh dưới lời mời
    countdown: "images/anh-dem-nguoc.png", // ảnh nền đếm ngược
    memory: "images/anh-ky-niem.png",    // ảnh "Kỷ niệm của chúng mình"
    thankYou: "images/anh-cam-on.png",   // ảnh cuối thiệp
    album: [
      "images/album-1.png",
      "images/album-2.png",
      "images/album-3.png",
      "images/album-4.png",
      "images/album-5.png",
      "images/album-6.png",
    ],
  },

  /* ---------------- NHẠC NỀN ----------------
     Chép file .mp3 vào thư mục music/ rồi ghi tên ở đây.
     Nhạc bắt đầu khi khách chạm mở thiệp. Để trống "" = không có nhạc. */
  music: "music/nhac-nen-1.mp3",

  /* ---------------- MÀN MỞ THIỆP (phong bì) ---------------- */
  opening: {
    enabled: true,
    hint: "Chạm vào phong bì để mở thiệp",
  },

  /* Hiệu ứng lấp lánh rơi nhẹ */
  sparkles: true,

  /* ---------------- XÁC NHẬN THAM DỰ & LỜI CHÚC ----------------
     Muốn nhận phản hồi về Google Sheets: làm theo HUONG-DAN.md (mục 4),
     rồi dán đường link Web App vào googleScriptUrl.
     Để trống thì form vẫn hiển thị nhưng chỉ báo "cảm ơn", không lưu. */
  googleScriptUrl: "",

  rsvp: {
    enabled: true,
    title: "Xác nhận tham dự",
    intro: "Bạn nhắn giúp chúng mình đôi dòng trước ngày vui nhé!",
    maxGuests: 10,
  },

  wishes: {
    enabled: true,
    /* Lời chúc mẫu hiện khi chưa có lời chúc thật (xóa hết nếu không muốn) */
    samples: [
      { name: "Ngân", text: "Chúc hai bạn trăm năm hạnh phúc, mãi yêu thương nhau như ngày đầu nhé!" },
      { name: "Chị Ánh", text: "Chúc mừng hạnh phúc hai em 💕" },
      { name: "Minh Tuấn", text: "Happy wedding! Sớm có tin vui nha 🥰" },
      { name: "Gia đình cô Lan", text: "Chúc hai cháu bách niên giai lão, sắt son trọn đời." },
    ],
  },

  /* ---------------- HỘP MỪNG CƯỚI ----------------
     bankId: mã ngân hàng theo VietQR (vd: VCB, TCB, MB, ACB, BIDV, ICB (VietinBank),
     VBA (Agribank), TPB, VPB, STB (Sacombank)...) — mã QR sẽ TỰ TẠO.
     Hoặc tự chụp mã QR từ app ngân hàng, chép vào images/ rồi ghi vào qrImage. */
  gift: {
    enabled: true,
    title: "Gửi quà mừng",
    hint: "Chạm vào phong bao để gửi quà tới chúng mình",
    message: "Cảm ơn tấm lòng của bạn dành cho chúng mình.",
    accounts: [
      {
        label: "Mừng cưới chú rể",
        bank: "Vietcombank",
        bankId: "VCB",
        accountNo: "0123456789",
        accountName: "Tony",
        qrImage: "", // để trống = tự tạo QR
      },
      {
        label: "Mừng cưới cô dâu",
        bank: "Techcombank",
        bankId: "TCB",
        accountNo: "9876543210",
        accountName: "Jenifer",
        qrImage: "",
      },
    ],
  },

  /* ---------------- LỜI CẢM ƠN CUỐI THIỆP ---------------- */
  thankYou: {
    message:
      "Cảm ơn bạn đã thương chúng mình suốt chặng đường qua. Hẹn gặp bạn trong ngày vui, vì có bạn, ngày ấy mới thật trọn vẹn.",
    title: "Thank you!",
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["openweathermap.org"], // Danh sách domain cho phép tải ảnh từ đó
    deviceSizes: [320, 420, 768, 1024, 1200], // Các kích thước màn hình cần tối ưu hóa
    imageSizes: [16, 32, 48, 64, 96], // Các kích thước ảnh được tạo
  },
};

module.exports = nextConfig;

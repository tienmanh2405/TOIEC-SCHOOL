-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jun 09, 2024 at 10:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toiecschool`
--

-- --------------------------------------------------------

--
-- Table structure for table `baigiang`
--

CREATE TABLE `baigiang` (
  `MaBaiGiang` int(11) NOT NULL,
  `TenBaiGiang` varchar(255) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buoihoc`
--

CREATE TABLE `buoihoc` (
  `MaBuoiHoc` int(11) NOT NULL,
  `MaLopHoc` int(11) DEFAULT NULL,
  `NgayHoc` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cosodaotao`
--

CREATE TABLE `cosodaotao` (
  `MaCoSo` int(11) NOT NULL,
  `TenCoSo` varchar(255) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cosodaotao`
--

INSERT INTO `cosodaotao` (`MaCoSo`, `TenCoSo`, `DiaChi`) VALUES
(1, 'Cơ sở 1', 'Địa chỉ 1, Gò Vấp, TP. Hồ Chí Minh'),
(2, 'Cơ sở 2', 'Địa chỉ 2, Tp. Thủ Đức, TP. Hồ Chí Minh'),
(3, 'Cơ sở 3', 'Địa chỉ 3, Quận 12, TP. Hồ Chí Minh');

-- --------------------------------------------------------

--
-- Table structure for table `dangkyhoc`
--

CREATE TABLE `dangkyhoc` (
  `MaDangKy` int(11) NOT NULL,
  `HoTen` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL,
  `MaCoSo` int(11) DEFAULT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `TrangThaiThanhToan` tinyint(1) DEFAULT 0,
  `clientSecret` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dangkyhoc`
--

INSERT INTO `dangkyhoc` (`MaDangKy`, `HoTen`, `Email`, `SoDienThoai`, `MaKhoaHoc`, `MaCoSo`, `MaNguoiDung`, `TrangThaiThanhToan`, `clientSecret`) VALUES
(12, 'Ngô Hồng Sơn', 'minhtuan1@example.com', '789456125', 4, 1, 31, 0, 'pi_3PPgwCJUlGUSq9jK1hxaxAKA_secret_AIKoH4LIpJEa1PJXkAEDXt2g0');

-- --------------------------------------------------------

--
-- Table structure for table `diemdanh`
--

CREATE TABLE `diemdanh` (
  `MaDiemDanh` int(11) NOT NULL,
  `MaHocVien` int(11) DEFAULT NULL,
  `MaBuoiHoc` int(11) DEFAULT NULL,
  `TrangThai` enum('Đúng giờ','Muộn','Vắng không phép','Vắng có phép') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hocvien`
--

CREATE TABLE `hocvien` (
  `MaHocVien` int(11) NOT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `HoTen` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `DiemDanh` varchar(50) DEFAULT NULL,
  `DiemSo` decimal(5,2) DEFAULT NULL,
  `NhanXet` text DEFAULT NULL,
  `MaLopHoc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khoahoc`
--

CREATE TABLE `khoahoc` (
  `MaKhoaHoc` int(11) NOT NULL,
  `TenKhoaHoc` varchar(255) DEFAULT NULL,
  `MoTa` text DEFAULT NULL,
  `TongSoBuoiHoc` int(11) DEFAULT NULL,
  `ThoiLuongTrenLop` varchar(255) DEFAULT NULL,
  `SiSoToiDa` int(11) DEFAULT NULL,
  `GiaThanh` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khoahoc`
--

INSERT INTO `khoahoc` (`MaKhoaHoc`, `TenKhoaHoc`, `MoTa`, `TongSoBuoiHoc`, `ThoiLuongTrenLop`, `SiSoToiDa`, `GiaThanh`) VALUES
(2, 'TOEIC Basic', 'Khóa học cơ bản, phù hợp cho người mới bắt đầu làm quen với TOEIC.', 10, '3 giờ/buổi', 20, 129.00),
(4, 'TOEIC Intermediate', 'Khóa học trung cấp, dành cho những ai đã có kiến thức cơ bản về TOEIC.', 15, '3 giờ/buổi', 20, 193.50),
(6, 'TOEIC Advanced', 'Khóa học nâng cao, giúp học viên đạt điểm số cao trong kỳ thi TOEIC.', 20, '3 giờ/buổi', 20, 260.00);

-- --------------------------------------------------------

--
-- Table structure for table `lophoc`
--

CREATE TABLE `lophoc` (
  `MaLopHoc` int(11) NOT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayDuKienKetThuc` date DEFAULT NULL,
  `TongSoBuoiHoc` int(11) DEFAULT NULL,
  `ThoiLuongHocTrenLop` int(11) DEFAULT NULL,
  `LichHocTrongTuan` text DEFAULT NULL,
  `MaCoSo` int(11) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL,
  `MaGiangVien` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lophoc`
--

INSERT INTO `lophoc` (`MaLopHoc`, `NgayBatDau`, `NgayDuKienKetThuc`, `TongSoBuoiHoc`, `ThoiLuongHocTrenLop`, `LichHocTrongTuan`, `MaCoSo`, `MaKhoaHoc`, `MaGiangVien`) VALUES
(2, '2024-06-08', '2024-06-22', 10, 3, '{\"thuHai\":\"17:00 - 20:00\",\"thuTu\":\"17:00 - 20:00\",\"thuSau\":\"17:00 - 20:00\"}', 1, 2, 12);

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `MaNguoiDung` int(11) NOT NULL,
  `HoTen` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `TenTaiKhoan` varchar(50) DEFAULT NULL,
  `MatKhau` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `HoTen`, `Email`, `SoDienThoai`, `TenTaiKhoan`, `MatKhau`) VALUES
(31, 'Ngô Hồng Sơn', 'minhtuan1@example.com', '789456125', 'user5', '$2b$10$4mnkkSgln3u2pGihtnBFouHUrALJGDoRdAdq6EJfZ4fvidiRRhZO.'),
(32, 'Phạm Thị Lan', 'lanpham@email.com', '0666666674', 'lanpham', '$2b$10$/betsytPqMcYZ95jOJG8aul9ZDGTelRJBA85KuMA3Hr1hp4C8staC'),
(33, 'Lê Minh Tuấn', 'tuanle@email.com', '0666666675', 'tuanle', '$2b$10$GZ75BsXrgVpl5BIXskOYeedngLFLDrrAotQ0veOFsA3SAyz.NUDu2'),
(34, 'Hoàng Mai Anh', 'anhhoangmai@email.com', '0666666676', 'anhhoangmai', '$2b$10$ZeejXFUQgbKaK5Cya6p6C.IcuUC6fxRtDkIRLiWfTypls7slI89oW'),
(35, 'Vũ Đức Minh', 'minhvuduc@email.com', '0666666677', 'minhvuduc', '$2b$10$SCCZfKf/KMHkKyktunQH6.8d13Etz2ZkCX0W.9YItSOnt7B7uYF8.'),
(36, 'Nguyễn Thanh Tùng', 'tungnguyen@email.com', '0666666678', 'tungnguyen', '$2b$10$Zmm8gfhGnWSelGDohS6dbOLdMEdrIrF/TBL/PABaDkG56pa6VXqvC'),
(37, 'Bùi Thu Hà', 'habui@email.com', '0666666679', 'habui', '$2b$10$hAA.RpjVGeQTEX0OexNZ3.It0HNA.yqmEfCKY4BVfpZ59epGfKrV.'),
(39, 'Trần Lê Phương Trân', 'phuongtran@email.com', '0985743421', 'phuongtran', '$2b$10$GEVr3kT6pjQEweNniheBiOALVoXL/Lji126lXHXMZBAnQzOeu4pme'),
(40, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 'vanquan', '$2b$10$fUrDdbhwM4On/QtyReH9peM8OIQ8tvXbt0lFjWeKOMAoSsd41s7iu'),
(41, 'Nguyễn Đình Thống', 'dinhthong0000@email.com', '0385743427', 'dinhthong1', '$2b$10$avN9UfBmHAPqXi8El8OSreBUz6wSxE4eAXilTjPdoPJGK7QXq9HGy');

-- --------------------------------------------------------

--
-- Table structure for table `phanquyen`
--

CREATE TABLE `phanquyen` (
  `MaQuanLy` int(11) NOT NULL,
  `MaVaiTro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phanquyen`
--

INSERT INTO `phanquyen` (`MaQuanLy`, `MaVaiTro`) VALUES
(3, 1),
(4, 1),
(9, 1),
(11, 1),
(12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `quanly`
--

CREATE TABLE `quanly` (
  `MaQuanLy` int(11) NOT NULL,
  `HoTen` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `TenTaiKhoan` varchar(50) DEFAULT NULL,
  `MatKhau` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quanly`
--

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `Email`, `SoDienThoai`, `TenTaiKhoan`, `MatKhau`) VALUES
(3, 'Trần Lê Phương Trân', 'phuongtran0000@email.com', '0906512692', 'phuongtran1', '$2b$10$hz8VyvEs0e1bE1VjecWAoevup.BBJvqDEfw4lUfb8PkgayPsSMvDy'),
(4, 'Trần Lê Phương Trân', 'phuongtran1111@email.com', '0906512691', 'phuongtran2', '$2b$10$d7PN7P4g7Nain0xr2qcFwet1GMWeUpveL6DwQfoseR1ff3NqjD0s.'),
(9, 'Ngô Hồng Sơnn', 'minhtuan1@example.com', '789456125', 'hongson', '$2b$10$M5/PTopqgpQICSi.Vo963.oUub/ZhRsGzcYZ320Koe0XYjFeb4gYK'),
(11, 'Nguyễn Đình Thống', 'dinhthong0000@email.com', '0385743427', 'dinhthong1', '$2b$10$GPln/iG5hT8NH3IvzuK2GOd.c3TZQ/JhbPA2UQlS8zxlyu7yNz1.i'),
(12, 'Nguyễn Đình Thống', 'dinhthong0001@email.com', '0385743422', 'dinhthong2', '$2b$10$InWqzv73eM9XV8IXhKSJ5uZJBsa5qft4IQDr7oPDohktIZKMMdwpy');

--
-- Triggers `quanly`
--
DELIMITER $$
CREATE TRIGGER `AFTER_CREATE_QUANLY` AFTER INSERT ON `quanly` FOR EACH ROW BEGIN
    INSERT INTO phanquyen (MaQuanLy, MaVaiTro) VALUES (NEW.MaQuanLy, '2');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `AFTER_DELETE_QUANLY` AFTER DELETE ON `quanly` FOR EACH ROW BEGIN
    DELETE FROM phanquyen WHERE MaQuanLy = OLD.MaQuanLy;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `MaThanhToan` int(11) NOT NULL,
  `MaDangKy` int(11) DEFAULT NULL,
  `NgayThanhToan` date DEFAULT NULL,
  `SoTien` decimal(10,2) DEFAULT NULL,
  `PhuongThucThanhToan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vaitro`
--

CREATE TABLE `vaitro` (
  `MaVaiTro` int(11) NOT NULL,
  `TenVaiTro` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vaitro`
--

INSERT INTO `vaitro` (`MaVaiTro`, `TenVaiTro`) VALUES
(1, 'Admin'),
(2, 'GiangVien');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `baigiang`
--
ALTER TABLE `baigiang`
  ADD PRIMARY KEY (`MaBaiGiang`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`);

--
-- Indexes for table `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD PRIMARY KEY (`MaBuoiHoc`),
  ADD KEY `MaLopHoc` (`MaLopHoc`);

--
-- Indexes for table `cosodaotao`
--
ALTER TABLE `cosodaotao`
  ADD PRIMARY KEY (`MaCoSo`);

--
-- Indexes for table `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  ADD PRIMARY KEY (`MaDangKy`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`),
  ADD KEY `MaCoSo` (`MaCoSo`),
  ADD KEY `fk_MaNguoiDung` (`MaNguoiDung`);

--
-- Indexes for table `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD PRIMARY KEY (`MaDiemDanh`),
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaBuoiHoc` (`MaBuoiHoc`);

--
-- Indexes for table `hocvien`
--
ALTER TABLE `hocvien`
  ADD PRIMARY KEY (`MaHocVien`),
  ADD KEY `MaLopHoc` (`MaLopHoc`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`);

--
-- Indexes for table `khoahoc`
--
ALTER TABLE `khoahoc`
  ADD PRIMARY KEY (`MaKhoaHoc`);

--
-- Indexes for table `lophoc`
--
ALTER TABLE `lophoc`
  ADD PRIMARY KEY (`MaLopHoc`),
  ADD KEY `MaCoSo` (`MaCoSo`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`),
  ADD KEY `Fk_lophoc_giangvien` (`MaGiangVien`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`MaNguoiDung`);

--
-- Indexes for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD PRIMARY KEY (`MaQuanLy`,`MaVaiTro`),
  ADD KEY `MaVaiTro` (`MaVaiTro`);

--
-- Indexes for table `quanly`
--
ALTER TABLE `quanly`
  ADD PRIMARY KEY (`MaQuanLy`);

--
-- Indexes for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`MaThanhToan`),
  ADD KEY `MaDangKy` (`MaDangKy`);

--
-- Indexes for table `vaitro`
--
ALTER TABLE `vaitro`
  ADD PRIMARY KEY (`MaVaiTro`),
  ADD UNIQUE KEY `TenVaiTro` (`TenVaiTro`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `baigiang`
--
ALTER TABLE `baigiang`
  MODIFY `MaBaiGiang` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buoihoc`
--
ALTER TABLE `buoihoc`
  MODIFY `MaBuoiHoc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cosodaotao`
--
ALTER TABLE `cosodaotao`
  MODIFY `MaCoSo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  MODIFY `MaDangKy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `diemdanh`
--
ALTER TABLE `diemdanh`
  MODIFY `MaDiemDanh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hocvien`
--
ALTER TABLE `hocvien`
  MODIFY `MaHocVien` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khoahoc`
--
ALTER TABLE `khoahoc`
  MODIFY `MaKhoaHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `lophoc`
--
ALTER TABLE `lophoc`
  MODIFY `MaLopHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `quanly`
--
ALTER TABLE `quanly`
  MODIFY `MaQuanLy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vaitro`
--
ALTER TABLE `vaitro`
  MODIFY `MaVaiTro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baigiang`
--
ALTER TABLE `baigiang`
  ADD CONSTRAINT `baigiang_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`);

--
-- Constraints for table `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD CONSTRAINT `buoihoc_ibfk_1` FOREIGN KEY (`MaLopHoc`) REFERENCES `lophoc` (`MaLopHoc`);

--
-- Constraints for table `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  ADD CONSTRAINT `dangkyhoc_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`),
  ADD CONSTRAINT `dangkyhoc_ibfk_2` FOREIGN KEY (`MaCoSo`) REFERENCES `cosodaotao` (`MaCoSo`),
  ADD CONSTRAINT `fk_MaNguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Constraints for table `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD CONSTRAINT `diemdanh_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`),
  ADD CONSTRAINT `diemdanh_ibfk_2` FOREIGN KEY (`MaBuoiHoc`) REFERENCES `buoihoc` (`MaBuoiHoc`);

--
-- Constraints for table `hocvien`
--
ALTER TABLE `hocvien`
  ADD CONSTRAINT `hocvien_ibfk_1` FOREIGN KEY (`MaLopHoc`) REFERENCES `lophoc` (`MaLopHoc`),
  ADD CONSTRAINT `hocvien_ibfk_2` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Constraints for table `lophoc`
--
ALTER TABLE `lophoc`
  ADD CONSTRAINT `Fk_lophoc_giangvien` FOREIGN KEY (`MaGiangVien`) REFERENCES `quanly` (`MaQuanLy`),
  ADD CONSTRAINT `lophoc_ibfk_1` FOREIGN KEY (`MaCoSo`) REFERENCES `cosodaotao` (`MaCoSo`),
  ADD CONSTRAINT `lophoc_ibfk_3` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`);

--
-- Constraints for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD CONSTRAINT `phanquyen_ibfk_1` FOREIGN KEY (`MaQuanLy`) REFERENCES `quanly` (`MaQuanLy`) ON DELETE CASCADE,
  ADD CONSTRAINT `phanquyen_ibfk_2` FOREIGN KEY (`MaVaiTro`) REFERENCES `vaitro` (`MaVaiTro`) ON DELETE CASCADE;

--
-- Constraints for table `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `thanhtoan_ibfk_1` FOREIGN KEY (`MaDangKy`) REFERENCES `dangkyhoc` (`MaDangKy`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

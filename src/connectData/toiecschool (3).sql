-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jun 22, 2024 at 12:04 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `taoLopHocVaThemHocVien` ()   BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE soLuongDangKy INT DEFAULT 0;
    DECLARE siSoToiDa INT DEFAULT 0;
    DECLARE maKhoaHocCur INT;
    DECLARE maCoSoCur INT;
    DECLARE maLopHoc INT;

    -- Cursor để lấy các khóa học cần kiểm tra
    DECLARE cur CURSOR FOR 
        SELECT DISTINCT MaKhoaHoc, MaCoSo 
        FROM DangKyHoc 
        WHERE TrangThaiThanhToan = TRUE;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO maKhoaHocCur, maCoSoCur;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Kiểm tra xem khóa học và cơ sở đã có lớp học chưa
        SELECT MaLopHoc INTO maLopHoc
        FROM LopHoc
        WHERE MaKhoaHoc = maKhoaHocCur AND MaCoSo = maCoSoCur;

        IF maLopHoc IS NULL THEN
            -- Lấy số lượng đăng ký và sĩ số tối đa của khóa học
            SELECT COUNT(dk.MaDangKy), MAX(kh.SiSoToiDa)
            INTO soLuongDangKy, siSoToiDa
            FROM DangKyHoc dk
            JOIN KhoaHoc kh ON dk.MaKhoaHoc = kh.MaKhoaHoc
            WHERE dk.MaKhoaHoc = maKhoaHocCur
              AND dk.MaCoSo = maCoSoCur
              AND dk.TrangThaiThanhToan = TRUE
            GROUP BY dk.MaKhoaHoc;

            -- Kiểm tra nếu số lượng đăng ký lớn hơn hoặc bằng 50% sĩ số tối đa
            IF soLuongDangKy >= siSoToiDa / 2 THEN
                -- Tạo lớp học mới
                INSERT INTO LopHoc (MaKhoaHoc, MaCoSo, NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop, LichHocTrongTuan)
                VALUES (maKhoaHocCur, maCoSoCur, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), 20, 2, 'T2-T6');

                -- Lấy mã lớp học mới tạo
                SET maLopHoc = LAST_INSERT_ID();
            END IF;
        ELSE
            -- Cập nhật thông tin lớp học nếu đã tồn tại
            UPDATE LopHoc
            SET NgayBatDau = CURDATE(),
                NgayDuKienKetThuc = DATE_ADD(CURDATE(), INTERVAL 2 MONTH),
                TongSoBuoiHoc = 20,
                ThoiLuongHocTrenLop = 2,
                LichHocTrongTuan = 'T2-T6'
            WHERE MaLopHoc = maLopHoc;
        END IF;

        -- Thêm học viên vào lớp học
        INSERT INTO HocVien (MaNguoiDung, HoTen, Email, MaLopHoc)
        SELECT dk.MaNguoiDung, dk.HoTen, dk.Email, maLopHoc
        FROM DangKyHoc dk
        WHERE dk.MaKhoaHoc = maKhoaHocCur
          AND dk.MaCoSo = maCoSoCur
          AND dk.TrangThaiThanhToan = TRUE;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `baigiang`
--

CREATE TABLE `baigiang` (
  `MaBaiGiang` int(11) NOT NULL,
  `TenBaiGiang` varchar(255) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `baigiang`
--

INSERT INTO `baigiang` (`MaBaiGiang`, `TenBaiGiang`, `MaKhoaHoc`) VALUES
(1, 'Listening', 2),
(2, 'Reading', 2);

-- --------------------------------------------------------

--
-- Table structure for table `baikiemtra`
--

CREATE TABLE `baikiemtra` (
  `MaBaiKiemTra` int(11) NOT NULL,
  `TenBaiKiemTra` varchar(255) NOT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL,
  `ThoiGianBatDau` datetime DEFAULT NULL,
  `ThoiGianKetThuc` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `baikiemtra`
--

INSERT INTO `baikiemtra` (`MaBaiKiemTra`, `TenBaiKiemTra`, `MaKhoaHoc`, `ThoiGianBatDau`, `ThoiGianKetThuc`) VALUES
(1, 'Kiểm tra giữa kì', 2, '2024-06-23 16:24:24', '2024-07-31 16:24:24'),
(3, 'Kiểm tra giữa kì', 4, '2024-06-23 16:28:19', '2024-07-31 16:28:19'),
(4, 'Kiểm tra giữa kì', 13, '2024-06-23 16:28:55', '2024-07-31 16:28:55');

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
-- Table structure for table `cauhoi`
--

CREATE TABLE `cauhoi` (
  `MaCauHoi` int(11) NOT NULL,
  `MaBaiKiemTra` int(11) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `LuaChon1` varchar(255) DEFAULT NULL,
  `LuaChon2` varchar(255) DEFAULT NULL,
  `LuaChon3` varchar(255) DEFAULT NULL,
  `LuaChon4` varchar(255) DEFAULT NULL,
  `DapAnDung` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cauhoi`
--

INSERT INTO `cauhoi` (`MaCauHoi`, `MaBaiKiemTra`, `NoiDung`, `LuaChon1`, `LuaChon2`, `LuaChon3`, `LuaChon4`, `DapAnDung`) VALUES
(1, 1, 'What does the acronym TOEIC stand for?', 'Test of English for International Communication', 'Test of English in Commerce', 'Test of English in Context', 'Test of English for International Corporations', 'Test of English for International Communication'),
(2, 1, 'Which part of the TOEIC test measures your ability to understand spoken English?', 'Listening Comprehension', 'Reading Comprehension', 'Speaking Skills', 'Writing Skills', 'Listening Comprehension'),
(3, 1, 'How many sections are there in the TOEIC Listening and Reading test?', '2', '3', '4', '5', '2'),
(4, 1, 'Which tense is used in the following sentence: \"He _____ to the cinema every Friday.\"', 'go', 'goes', 'going', 'gone', 'goes'),
(5, 1, 'What is the opposite of the word \"careful\"?', 'careless', 'carefree', 'uncareful', 'unworried', 'careless'),
(6, 1, 'Which sentence is grammatically correct?', 'She don\'t like tomatoes.', 'She doesn\'t like tomatoes.', 'She doesn\'t liked tomatoes.', 'She do not like tomatoes.', 'She doesn\'t like tomatoes.'),
(7, 1, 'What is the plural form of \"child\"?', 'children', 'childs', 'childen', 'child', 'children'),
(8, 1, 'Which word is a synonym for \"happy\"?', 'joyful', 'angry', 'sad', 'excited', 'joyful'),
(9, 1, 'Who invented the telephone?', 'Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Albert Einstein', 'Alexander Graham Bell'),
(10, 1, 'Which planet is known as the Red Planet?', 'Mars', 'Venus', 'Jupiter', 'Saturn', 'Mars'),
(11, 3, 'Which element has the chemical symbol \"Fe\"?', 'Iron', 'Gold', 'Silver', 'Copper', 'Iron'),
(12, 3, 'Who wrote the play \"Romeo and Juliet\"?', 'William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain', 'William Shakespeare'),
(13, 3, 'What is the longest river in Europe?', 'Volga River', 'Danube River', 'Rhine River', 'Seine River', 'Volga River'),
(14, 3, 'Who discovered penicillin in 1928?', 'Alexander Fleming', 'Louis Pasteur', 'Marie Curie', 'Thomas Edison', 'Alexander Fleming'),
(15, 3, 'In which year did the Titanic sink?', '1912', '1908', '1920', '1930', '1912'),
(16, 3, 'What is the capital city of Australia?', 'Canberra', 'Sydney', 'Melbourne', 'Brisbane', 'Canberra'),
(17, 3, 'Who painted the Mona Lisa?', 'Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso', 'Michelangelo', 'Leonardo da Vinci'),
(18, 3, 'Which planet is known as the \"Morning Star\" or \"Evening Star\"?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Venus'),
(19, 3, 'Who is the author of the novel \"1984\"?', 'George Orwell', 'Aldous Huxley', 'J.K. Rowling', 'F. Scott Fitzgerald', 'George Orwell'),
(20, 3, 'What is the chemical formula for methane?', 'CH4', 'CO2', 'H2O', 'NH3', 'CH4'),
(23, 4, 'What is the capital city of Japan?', 'Tokyo', 'Kyoto', 'Osaka', 'Nagoya', 'Tokyo'),
(24, 4, 'Who discovered the theory of evolution?', 'Charles Darwin', 'Isaac Newton', 'Gregor Mendel', 'Albert Einstein', 'Charles Darwin'),
(25, 4, 'What is the largest ocean on Earth?', 'Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'),
(26, 4, 'Who wrote the novel \"To Kill a Mockingbird\"?', 'Harper Lee', 'Mark Twain', 'Charles Dickens', 'Jane Austen', 'Harper Lee'),
(27, 4, 'What is the chemical symbol for gold?', 'Au', 'Ag', 'Fe', 'Cu', 'Au'),
(28, 4, 'Who painted the ceiling of the Sistine Chapel?', 'Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Titian', 'Michelangelo'),
(29, 4, 'What is the largest desert in the world?', 'Sahara Desert', 'Arabian Desert', 'Gobi Desert', 'Kalahari Desert', 'Sahara Desert'),
(30, 4, 'Who composed the famous opera \"The Magic Flute\"?', 'Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Johann Sebastian Bach', 'Franz Schubert', 'Wolfgang Amadeus Mozart'),
(31, 4, 'What is the largest species of bear?', 'Polar bear', 'Grizzly bear', 'Brown bear', 'Black bear', 'Polar bear'),
(32, 4, 'Who was the first person to step on the Moon?', 'Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'Yuri Gagarin', 'Neil Armstrong');

-- --------------------------------------------------------

--
-- Table structure for table `chitietbaigiang`
--

CREATE TABLE `chitietbaigiang` (
  `MaChiTiet` int(11) NOT NULL,
  `MaBaiGiang` int(11) DEFAULT NULL,
  `TenNoiDung` varchar(50) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `TaiLieu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietbaigiang`
--

INSERT INTO `chitietbaigiang` (`MaChiTiet`, `MaBaiGiang`, `TenNoiDung`, `NoiDung`, `TaiLieu`) VALUES
(1, 1, 'Part 1', 'Thành thạo kỹ năng nghe các dạng hình tả người / tả vật.', NULL),
(2, 1, 'Part 2', 'Thành thạo 12 dạng câu hỏi Listening Toeic Part 2', NULL),
(3, 1, 'Part 3', 'Làm quen với các Topic phổ biến trong bài thi Part 3 TOEIC', NULL),
(4, 1, 'Part 4', 'Kỹ năng nghe hiểu – nắm bắt thông tin chi tiết của bài độc thoại.', NULL),
(5, 2, 'Part 1', 'Làm quen với các dạng bài TOEIC Reading, Cập nhật bộ từ vựng trong đề thi mỗi tháng', NULL),
(6, 2, 'Part 2', 'Làm quen 4 dạng bài TOEIC, cập nhật các chủ đề trong đề thi mỗi tháng', NULL),
(7, 2, 'Part 3', 'Làm quen 5 dạng bài TOEIC, kỹ năng Skim – Scan, nắm bắt thông tin chính của câu hỏi và tìm thông tin trong đoạn văn.', NULL);

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
(12, 'Ngô Hồng Sơn', 'minhtuan1@example.com', '789456125', 2, 1, 31, 1, ''),
(13, 'Hoàng Mai Anh', 'anhhoangmai@email.com', '0666666676', 2, 1, 34, 1, '');

--
-- Triggers `dangkyhoc`
--
DELIMITER $$
CREATE TRIGGER `trg_after_insert_dangkyhoc` AFTER INSERT ON `dangkyhoc` FOR EACH ROW BEGIN
    CALL taoLopHocVaThemHocVien();
END
$$
DELIMITER ;

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

--
-- Dumping data for table `hocvien`
--

INSERT INTO `hocvien` (`MaHocVien`, `MaNguoiDung`, `HoTen`, `Email`, `DiemDanh`, `DiemSo`, `NhanXet`, `MaLopHoc`) VALUES
(1, 31, 'Ngô Hồng Sơn', 'minhtuan1@example.com', NULL, NULL, NULL, 11),
(2, 34, 'Hoàng Mai Anh', 'anhhoangmai@email.com', NULL, NULL, NULL, 11);

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
  `GiaThanh` decimal(18,2) DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khoahoc`
--

INSERT INTO `khoahoc` (`MaKhoaHoc`, `TenKhoaHoc`, `MoTa`, `TongSoBuoiHoc`, `ThoiLuongTrenLop`, `SiSoToiDa`, `GiaThanh`, `HinhAnh`) VALUES
(2, 'TOEIC Basic', 'Khóa học cơ bản, phù hợp cho người mới bắt đầu làm quen với TOEIC.', 10, '3 giờ/buổi', 2, 129.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978475/TOIECSCHOOL/toiec1.jpg'),
(4, 'TOEIC Intermediate', 'Khóa học trung cấp, dành cho những ai đã có kiến thức cơ bản về TOEIC.', 15, '3 giờ/buổi', 20, 193.50, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978527/TOIECSCHOOL/toiec4.jpg'),
(6, 'TOEIC Advanced', 'Khóa học nâng cao, giúp học viên đạt điểm số cao trong kỳ thi TOEIC.', 20, '3 giờ/buổi', 20, 260.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978579/TOIECSCHOOL/toiec5.jpg'),
(12, 'TOEIC Speaking & Writing', 'Khóa học chuyên sâu vào kỹ năng nói và viết trong kỳ thi TOEIC.', 12, '2 giờ/buổi', 20, 180.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979125/TOIECSCHOOL/toiec3.jpg'),
(13, 'TOEIC Listening & Reading Part 1', 'Khóa học chuyên sâu vào kỹ năng nghe và đọc trong kỳ thi TOEIC.', 16, '2 giờ/buổi', 20, 250.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979226/TOIECSCHOOL/toiec6.jpg'),
(14, 'TOEIC Listening & Reading Part 2', 'Khóa học chuyên sâu vào kỹ năng nghe và đọc trong kỳ thi TOEIC.', 16, '2 giờ/buổi', 20, 250.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979322/TOIECSCHOOL/toiec7.png');

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
(11, '2024-06-16', '2024-08-16', 20, 2, 'T2-T6', 1, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `MaNguoiDung` int(11) NOT NULL,
  `HoTen` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `TenTaiKhoan` varchar(50) DEFAULT NULL,
  `MatKhau` varchar(70) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `HoTen`, `Email`, `SoDienThoai`, `TenTaiKhoan`, `MatKhau`, `NgaySinh`) VALUES
(31, 'Ngô Hồng Sơn', 'minhtuan1@example.com', '789456125', 'user5', '$2b$10$4mnkkSgln3u2pGihtnBFouHUrALJGDoRdAdq6EJfZ4fvidiRRhZO.', NULL),
(32, 'Phạm Thị Lan', 'lanpham@email.com', '0666666674', 'lanpham', '$2b$10$/betsytPqMcYZ95jOJG8aul9ZDGTelRJBA85KuMA3Hr1hp4C8staC', NULL),
(33, 'Lê Minh Tuấn', 'tuanle@email.com', '0666666675', 'tuanle', '$2b$10$GZ75BsXrgVpl5BIXskOYeedngLFLDrrAotQ0veOFsA3SAyz.NUDu2', NULL),
(34, 'Hoàng Mai Anh', 'anhhoangmai@email.com', '0666666676', 'anhhoangmai', '$2b$10$ZeejXFUQgbKaK5Cya6p6C.IcuUC6fxRtDkIRLiWfTypls7slI89oW', NULL),
(35, 'Vũ Đức Minh', 'minhvuduc@email.com', '0666666677', 'minhvuduc', '$2b$10$SCCZfKf/KMHkKyktunQH6.8d13Etz2ZkCX0W.9YItSOnt7B7uYF8.', NULL),
(36, 'Nguyễn Thanh Tùng', 'tungnguyen@email.com', '0666666678', 'tungnguyen', '$2b$10$Zmm8gfhGnWSelGDohS6dbOLdMEdrIrF/TBL/PABaDkG56pa6VXqvC', NULL),
(37, 'Bùi Thu Hà', 'habui@email.com', '0666666679', 'habui', '$2b$10$hAA.RpjVGeQTEX0OexNZ3.It0HNA.yqmEfCKY4BVfpZ59epGfKrV.', NULL),
(39, 'Trần Lê Phương Trân', 'phuongtran@email.com', '0985743421', 'phuongtran', '$2b$10$GEVr3kT6pjQEweNniheBiOALVoXL/Lji126lXHXMZBAnQzOeu4pme', NULL),
(40, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 'vanquan', '$2b$10$fUrDdbhwM4On/QtyReH9peM8OIQ8tvXbt0lFjWeKOMAoSsd41s7iu', NULL),
(41, 'Nguyễn Đình Thống', 'dinhthong0000@email.com', '0385743427', 'dinhthong1', '$2b$10$avN9UfBmHAPqXi8El8OSreBUz6wSxE4eAXilTjPdoPJGK7QXq9HGy', NULL);

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
  `MatKhau` varchar(255) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quanly`
--

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `Email`, `SoDienThoai`, `TenTaiKhoan`, `MatKhau`, `NgaySinh`) VALUES
(3, 'Trần Lê Phương Trân', 'phuongtran0000@email.com', '0906512692', 'phuongtran1', '$2b$10$hz8VyvEs0e1bE1VjecWAoevup.BBJvqDEfw4lUfb8PkgayPsSMvDy', NULL),
(4, 'Trần Lê Phương Trân', 'phuongtran1111@email.com', '0906512691', 'phuongtran2', '$2b$10$d7PN7P4g7Nain0xr2qcFwet1GMWeUpveL6DwQfoseR1ff3NqjD0s.', NULL),
(9, 'Ngô Hồng Sơnn', 'minhtuan1@example.com', '789456125', 'hongson', '$2b$10$M5/PTopqgpQICSi.Vo963.oUub/ZhRsGzcYZ320Koe0XYjFeb4gYK', NULL),
(11, 'Nguyễn Đình Thống', 'dinhthong0000@email.com', '0385743427', 'dinhthong1', '$2b$10$GPln/iG5hT8NH3IvzuK2GOd.c3TZQ/JhbPA2UQlS8zxlyu7yNz1.i', NULL),
(12, 'Nguyễn Đình Thống', 'dinhthong0001@email.com', '0385743422', 'dinhthong2', '$2b$10$InWqzv73eM9XV8IXhKSJ5uZJBsa5qft4IQDr7oPDohktIZKMMdwpy', NULL);

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
-- Indexes for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  ADD PRIMARY KEY (`MaBaiKiemTra`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`);

--
-- Indexes for table `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD PRIMARY KEY (`MaBuoiHoc`),
  ADD KEY `MaLopHoc` (`MaLopHoc`);

--
-- Indexes for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD PRIMARY KEY (`MaCauHoi`),
  ADD KEY `MaBaiKiemTra` (`MaBaiKiemTra`);

--
-- Indexes for table `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  ADD PRIMARY KEY (`MaChiTiet`),
  ADD KEY `MaBaiGiang` (`MaBaiGiang`);

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
  MODIFY `MaBaiGiang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  MODIFY `MaBaiKiemTra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `buoihoc`
--
ALTER TABLE `buoihoc`
  MODIFY `MaBuoiHoc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cauhoi`
--
ALTER TABLE `cauhoi`
  MODIFY `MaCauHoi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  MODIFY `MaChiTiet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cosodaotao`
--
ALTER TABLE `cosodaotao`
  MODIFY `MaCoSo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  MODIFY `MaDangKy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `diemdanh`
--
ALTER TABLE `diemdanh`
  MODIFY `MaDiemDanh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hocvien`
--
ALTER TABLE `hocvien`
  MODIFY `MaHocVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `khoahoc`
--
ALTER TABLE `khoahoc`
  MODIFY `MaKhoaHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `lophoc`
--
ALTER TABLE `lophoc`
  MODIFY `MaLopHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
-- Constraints for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  ADD CONSTRAINT `baikiemtra_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`);

--
-- Constraints for table `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD CONSTRAINT `buoihoc_ibfk_1` FOREIGN KEY (`MaLopHoc`) REFERENCES `lophoc` (`MaLopHoc`);

--
-- Constraints for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD CONSTRAINT `cauhoi_ibfk_1` FOREIGN KEY (`MaBaiKiemTra`) REFERENCES `baikiemtra` (`MaBaiKiemTra`);

--
-- Constraints for table `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  ADD CONSTRAINT `chitietbaigiang_ibfk_1` FOREIGN KEY (`MaBaiGiang`) REFERENCES `baigiang` (`MaBaiGiang`);

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

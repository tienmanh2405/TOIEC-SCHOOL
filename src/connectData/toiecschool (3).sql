-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th7 25, 2024 lúc 11:16 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `toiecschool`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `taoLopHocVaThemHocVien` ()   BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE maKhoaHocCur INT;
    DECLARE maCoSoCur INT;
    DECLARE maLopHoc INT DEFAULT NULL;
    DECLARE siSoToiDa INT;
    DECLARE tongSoBuoiHoc INT;
    DECLARE thoiLuongHocTrenLop INT;
    DECLARE ngayBatDau DATE;
    DECLARE i INT;
    DECLARE soLuongHocVienHienTai INT;

    -- Cursor to retrieve the courses to check
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

        -- Retrieve course details
        SELECT kh.SiSoToiDa, kh.TongSoBuoiHoc, kh.ThoiLuongTrenLop
        INTO siSoToiDa, tongSoBuoiHoc, thoiLuongHocTrenLop
        FROM KhoaHoc kh
        WHERE kh.MaKhoaHoc = maKhoaHocCur;

        -- Check if there is an existing class with available seats
        SELECT lh.MaLopHoc, lh.SoLuongHocVienHienTai INTO maLopHoc, soLuongHocVienHienTai
        FROM LopHoc lh
        WHERE lh.MaKhoaHoc = maKhoaHocCur 
          AND lh.MaCoSo = maCoSoCur
          AND (siSoToiDa - lh.SoLuongHocVienHienTai) > 0
        ORDER BY (siSoToiDa - lh.SoLuongHocVienHienTai) DESC
        LIMIT 1;

        -- If no existing class or class is full, create a new class
        IF maLopHoc IS NULL OR soLuongHocVienHienTai >= siSoToiDa THEN
            SET ngayBatDau = CURDATE();
            INSERT INTO LopHoc (MaKhoaHoc, MaCoSo, NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop, SoLuongHocVienHienTai)
            VALUES (maKhoaHocCur, maCoSoCur, ngayBatDau, DATE_ADD(ngayBatDau, INTERVAL ((tongSoBuoiHoc-1) * 2) DAY), tongSoBuoiHoc, thoiLuongHocTrenLop, 0);

            SET maLopHoc = LAST_INSERT_ID();
            
            -- Create sessions for the class
            SET i = 0;
            WHILE i < tongSoBuoiHoc DO
                INSERT INTO BuoiHoc (MaLopHoc, NgayHoc)
                VALUES (maLopHoc, DATE_ADD(ngayBatDau, INTERVAL (i * 2) DAY));  
                SET i = i + 1;
            END WHILE;
        END IF;

        -- Add students to the class and get their IDs
        INSERT INTO HocVien (MaNguoiDung, HoTen, Email, MaLopHoc)
        SELECT dk.MaNguoiDung, dk.HoTen, dk.Email, maLopHoc
        FROM DangKyHoc dk
        WHERE dk.MaKhoaHoc = maKhoaHocCur
          AND dk.MaCoSo = maCoSoCur
          AND dk.TrangThaiThanhToan = TRUE;

        -- Add attendance records for the new students
        INSERT INTO DiemDanh (MaHocVien, MaBuoiHoc, TrangThai)
        SELECT hv.MaHocVien, bh.MaBuoiHoc, 'Chưa điểm danh'
        FROM HocVien hv
        JOIN BuoiHoc bh ON bh.MaLopHoc = hv.MaLopHoc
        WHERE hv.MaLopHoc = maLopHoc;

        -- Update the current number of students in the class
        UPDATE LopHoc
        SET SoLuongHocVienHienTai = (
            SELECT COUNT(*)
            FROM HocVien
            WHERE MaLopHoc = maLopHoc
        )
        WHERE MaLopHoc = maLopHoc;

        -- Delete the registration records
        DELETE FROM DangKyHoc
        WHERE MaKhoaHoc = maKhoaHocCur
          AND MaCoSo = maCoSoCur
          AND TrangThaiThanhToan = TRUE;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baigiang`
--

CREATE TABLE `baigiang` (
  `MaBaiGiang` int(11) NOT NULL,
  `TenBaiGiang` varchar(255) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `baigiang`
--

INSERT INTO `baigiang` (`MaBaiGiang`, `TenBaiGiang`, `MaKhoaHoc`) VALUES
(1, 'Introduction to Reading Techniques', 2),
(2, 'Intermediate Reading Strategies', 2),
(3, 'Advanced Reading Comprehension', 2),
(4, 'Critical Analysis of Texts', 2),
(5, 'Basics of Writing', 4),
(6, 'Structuring Essays', 4),
(7, 'Advanced Writing Techniques', 4),
(8, 'Editing and Proofreading', 4),
(9, 'Programming Basics', 6),
(10, 'Control Structures', 6),
(11, 'Functions and Methods', 6),
(12, 'Advanced Topics', 6),
(13, 'Arithmetic Operations', 12),
(14, 'Algebra Fundamentals', 12),
(15, 'Geometry Basics', 12),
(16, 'Advanced Math Topics', 12),
(17, 'Renaissance Art', 13),
(18, 'Baroque Art', 13),
(19, 'Impressionism', 13),
(20, 'Modern Art', 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baikiemtra`
--

CREATE TABLE `baikiemtra` (
  `MaBaiKiemTra` int(11) NOT NULL,
  `TenBaiKiemTra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `baikiemtra`
--

INSERT INTO `baikiemtra` (`MaBaiKiemTra`, `TenBaiKiemTra`) VALUES
(1, 'Kiểm tra giữa kì số 1'),
(2, 'Bài kiểm tra số 4'),
(3, 'Kiểm tra giữa kì số 2'),
(4, 'Kiểm tra giữa kì số 3');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `buoihoc`
--

CREATE TABLE `buoihoc` (
  `MaBuoiHoc` int(11) NOT NULL,
  `MaLopHoc` int(11) DEFAULT NULL,
  `NgayHoc` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `buoihoc`
--

INSERT INTO `buoihoc` (`MaBuoiHoc`, `MaLopHoc`, `NgayHoc`) VALUES
(193, 45, '2024-07-10'),
(194, 45, '2024-07-12'),
(195, 45, '2024-07-14'),
(196, 45, '2024-07-16'),
(197, 45, '2024-07-18'),
(198, 45, '2024-07-20'),
(199, 45, '2024-07-22'),
(200, 45, '2024-07-24'),
(201, 45, '2024-07-26'),
(202, 45, '2024-07-28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cauhoi`
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
-- Đang đổ dữ liệu cho bảng `cauhoi`
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
(32, 4, 'Who was the first person to step on the Moon?', 'Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'Yuri Gagarin', 'Neil Armstrong'),
(33, 2, 'When we went back to the bookstore, the bookseller _______ the book we wanted.', 'sold', 'had sold', 'sells', 'has sold', 'had sold'),
(34, 2, 'By the end of last summer, the farmers _______ all the crop.', 'harvested', 'had harvested', 'harvest', 'are harvested', 'had harvested'),
(35, 2, 'If I _______ the answer, I would have told you.', 'knew', 'know', 'have known', 'had known', 'had known'),
(36, 2, 'She _______ before I arrived.', 'left', 'has left', 'had left', 'leaves', 'had left'),
(37, 2, 'When the police arrived, the thieves _______.', 'escaped', 'have escaped', 'had escaped', 'escape', 'had escaped'),
(38, 2, 'By the time we got to the cinema, the movie _______.', 'started', 'has started', 'had started', 'starts', 'had started'),
(39, 2, 'She _______ a cake when the guests arrived.', 'baked', 'was baking', 'has baked', 'had baked', 'was baking'),
(40, 2, 'I will call you when I _______ back.', 'get', 'got', 'have got', 'getting', 'get'),
(41, 2, 'If it _______ tomorrow, we will cancel the trip.', 'rains', 'rain', 'will rain', 'rained', 'rains'),
(42, 2, 'They _______ their homework before the game started.', 'finished', 'finishes', 'finish', 'had finished', 'had finished');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietbaigiang`
--

CREATE TABLE `chitietbaigiang` (
  `MaChiTiet` int(11) NOT NULL,
  `MaBaiGiang` int(11) DEFAULT NULL,
  `TenNoiDung` varchar(50) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `TaiLieu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietbaigiang`
--

INSERT INTO `chitietbaigiang` (`MaChiTiet`, `MaBaiGiang`, `TenNoiDung`, `NoiDung`, `TaiLieu`) VALUES
(1, 1, 'Part 1', 'Basics of reading techniques.', NULL),
(2, 1, 'Part 2', 'Understanding text structures.', NULL),
(3, 1, 'Part 3', 'Improving reading speed.', NULL),
(4, 2, 'Part 1', 'Skimming and scanning methods.', NULL),
(5, 2, 'Part 2', 'Identifying key points.', NULL),
(6, 2, 'Part 3', 'Summarizing content.', NULL),
(7, 3, 'Part 1', 'Techniques for deep comprehension.', NULL),
(8, 3, 'Part 2', 'Analyzing complex texts.', NULL),
(9, 3, 'Part 3', 'Interpreting hidden meanings.', NULL),
(10, 4, 'Part 1', 'Critical reading skills.', NULL),
(11, 4, 'Part 2', 'Evaluating arguments.', NULL),
(12, 4, 'Part 3', 'Synthesizing information.', NULL),
(13, 5, 'Part 1', 'Introduction to writing basics.', NULL),
(14, 5, 'Part 2', 'Understanding sentence structure.', NULL),
(15, 5, 'Part 3', 'Creating clear and concise paragraphs.', NULL),
(16, 6, 'Part 1', 'Essay structure overview.', NULL),
(17, 6, 'Part 2', 'Writing effective introductions.', NULL),
(18, 6, 'Part 3', 'Developing arguments.', NULL),
(19, 6, 'Part 4', 'Crafting strong conclusions.', NULL),
(20, 7, 'Part 1', 'Advanced sentence construction.', NULL),
(21, 7, 'Part 2', 'Using literary devices.', NULL),
(22, 7, 'Part 3', 'Writing for different audiences.', NULL),
(23, 8, 'Part 1', 'Editing for clarity and coherence.', NULL),
(24, 8, 'Part 2', 'Proofreading techniques.', NULL),
(25, 8, 'Part 3', 'Common grammatical errors to avoid.', NULL),
(26, 9, 'Part 1', 'Introduction to programming languages.', NULL),
(27, 9, 'Part 2', 'Understanding variables and data types.', NULL),
(28, 9, 'Part 3', 'Basic syntax and operations.', NULL),
(29, 10, 'Part 1', 'Using if-else statements.', NULL),
(30, 10, 'Part 2', 'Loops and iterations.', NULL),
(31, 10, 'Part 3', 'Switch statements.', NULL),
(32, 11, 'Part 1', 'Defining and using functions.', NULL),
(33, 11, 'Part 2', 'Parameters and return values.', NULL),
(34, 11, 'Part 3', 'Method overloading and recursion.', NULL),
(35, 12, 'Part 1', 'Object-oriented programming.', NULL),
(36, 12, 'Part 2', 'Exception handling.', NULL),
(37, 12, 'Part 3', 'File I/O operations.', NULL),
(38, 13, 'Part 1', 'Introduction to addition and subtraction.', NULL),
(39, 13, 'Part 2', 'Understanding multiplication and division.', NULL),
(40, 13, 'Part 3', 'Order of operations (PEMDAS).', NULL),
(41, 14, 'Part 1', 'Basic algebraic expressions.', NULL),
(42, 14, 'Part 2', 'Solving linear equations.', NULL),
(43, 14, 'Part 3', 'Introduction to functions.', NULL),
(44, 15, 'Part 1', 'Understanding shapes and properties.', NULL),
(45, 15, 'Part 2', 'Calculating areas and perimeters.', NULL),
(46, 15, 'Part 3', 'Volume and surface area of solids.', NULL),
(47, 16, 'Part 1', 'Introduction to calculus.', NULL),
(48, 16, 'Part 2', 'Basic statistics and probability.', NULL),
(49, 16, 'Part 3', 'Mathematical reasoning and proofs.', NULL),
(50, 17, 'Part 1', 'Overview of Renaissance art.', NULL),
(51, 17, 'Part 2', 'Key artists of the Renaissance.', NULL),
(52, 17, 'Part 3', 'Influences on modern art.', NULL),
(53, 18, 'Part 1', 'Introduction to Baroque style.', NULL),
(54, 18, 'Part 2', 'Characteristics of Baroque art.', NULL),
(55, 18, 'Part 3', 'Famous Baroque artists.', NULL),
(56, 19, 'Part 1', 'Origins of Impressionism.', NULL),
(57, 19, 'Part 2', 'Techniques and styles.', NULL),
(58, 19, 'Part 3', 'Influence on later art movements.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cosodaotao`
--

CREATE TABLE `cosodaotao` (
  `MaCoSo` int(11) NOT NULL,
  `TenCoSo` varchar(255) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cosodaotao`
--

INSERT INTO `cosodaotao` (`MaCoSo`, `TenCoSo`, `DiaChi`) VALUES
(1, 'Cơ sở 1', 'Địa chỉ 1, Gò Vấp, TP. Hồ Chí Minh'),
(2, 'Cơ sở 2', 'Địa chỉ 2, Tp. Thủ Đức, TP. Hồ Chí Minh'),
(3, 'Cơ sở 3', 'Địa chỉ 3, Quận 12, TP. Hồ Chí Minh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dangkyhoc`
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
-- Đang đổ dữ liệu cho bảng `dangkyhoc`
--

INSERT INTO `dangkyhoc` (`MaDangKy`, `HoTen`, `Email`, `SoDienThoai`, `MaKhoaHoc`, `MaCoSo`, `MaNguoiDung`, `TrangThaiThanhToan`, `clientSecret`) VALUES
(69, 'Hoàng Mai Anh', 'anhhoangmai@email.com', '0666666676', 2, 1, 34, 0, 'pi_3PfcEuJUlGUSq9jK0WinzIzp_secret_JYxlstwXs8bKOEQM0luiDkHhE'),
(70, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 2, 1, 40, 0, 'pi_3PfcG5JUlGUSq9jK15HGicii_secret_5N7kCzIfLOXqiVesNUGPNRN8a'),
(71, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 4, 1, 40, 0, 'pi_3PfcGIJUlGUSq9jK0PNM5yOg_secret_C0ksU38fMEEuqUJNPv401M3Ex'),
(72, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 6, 1, 40, 0, 'pi_3PfcGMJUlGUSq9jK0XjsoMGz_secret_xFKN32AhaLZcR6UXmSvj6kEyk'),
(73, 'Phạm Văn Quân', 'vanquan@email.com', '0385743429', 12, 1, 40, 0, 'pi_3PfcGVJUlGUSq9jK0FWHsQJH_secret_tDKrib9nYL6VzAsnViTO9RemK');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diemdanh`
--

CREATE TABLE `diemdanh` (
  `MaDiemDanh` int(11) NOT NULL,
  `MaHocVien` int(11) DEFAULT NULL,
  `MaBuoiHoc` int(11) DEFAULT NULL,
  `TrangThai` enum('Đúng giờ','Muộn','Vắng không phép','Vắng có phép','Chưa điểm danh') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `diemdanh`
--

INSERT INTO `diemdanh` (`MaDiemDanh`, `MaHocVien`, `MaBuoiHoc`, `TrangThai`) VALUES
(120, 48, 193, 'Muộn'),
(121, 48, 194, 'Đúng giờ'),
(122, 48, 195, 'Đúng giờ'),
(123, 48, 196, 'Đúng giờ'),
(124, 48, 197, 'Đúng giờ'),
(125, 48, 198, 'Đúng giờ'),
(126, 48, 199, 'Đúng giờ'),
(127, 48, 200, 'Muộn'),
(128, 48, 201, 'Chưa điểm danh'),
(129, 48, 202, 'Chưa điểm danh'),
(130, 49, 193, 'Vắng có phép'),
(131, 49, 194, 'Đúng giờ'),
(132, 49, 195, 'Đúng giờ'),
(133, 49, 196, 'Đúng giờ'),
(134, 49, 197, 'Đúng giờ'),
(135, 49, 198, 'Đúng giờ'),
(136, 49, 199, 'Đúng giờ'),
(137, 49, 200, 'Vắng có phép'),
(138, 49, 201, 'Chưa điểm danh'),
(139, 49, 202, 'Chưa điểm danh'),
(140, 50, 193, 'Đúng giờ'),
(141, 50, 194, 'Đúng giờ'),
(142, 50, 195, 'Đúng giờ'),
(143, 50, 196, 'Đúng giờ'),
(144, 50, 197, 'Đúng giờ'),
(145, 50, 198, 'Đúng giờ'),
(146, 50, 199, 'Đúng giờ'),
(147, 50, 200, 'Đúng giờ'),
(148, 50, 201, 'Chưa điểm danh'),
(149, 50, 202, 'Chưa điểm danh'),
(150, 51, 193, 'Muộn'),
(151, 51, 194, 'Đúng giờ'),
(152, 51, 195, 'Đúng giờ'),
(153, 51, 196, 'Đúng giờ'),
(154, 51, 197, 'Đúng giờ'),
(155, 51, 198, 'Đúng giờ'),
(156, 51, 199, 'Đúng giờ'),
(157, 51, 200, 'Vắng không phép'),
(158, 51, 201, 'Chưa điểm danh'),
(159, 51, 202, 'Chưa điểm danh'),
(160, 52, 193, 'Đúng giờ'),
(161, 52, 194, 'Đúng giờ'),
(162, 52, 195, 'Đúng giờ'),
(163, 52, 196, 'Đúng giờ'),
(164, 52, 197, 'Đúng giờ'),
(165, 52, 198, 'Đúng giờ'),
(166, 52, 199, 'Đúng giờ'),
(167, 52, 200, 'Đúng giờ'),
(168, 52, 201, 'Chưa điểm danh'),
(169, 52, 202, 'Chưa điểm danh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocvien`
--

CREATE TABLE `hocvien` (
  `MaHocVien` int(11) NOT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `HoTen` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `DiemSo` decimal(5,2) DEFAULT NULL,
  `NhanXet` text DEFAULT NULL,
  `MaLopHoc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hocvien`
--

INSERT INTO `hocvien` (`MaHocVien`, `MaNguoiDung`, `HoTen`, `Email`, `DiemSo`, `NhanXet`, `MaLopHoc`) VALUES
(48, 32, 'Phạm Thị Lan', 'lanthi@gmail.com', NULL, NULL, 45),
(49, 33, 'Lê Minh Tuấn', 'tuanle@gmail.com', NULL, NULL, 45),
(50, 34, 'Hoàng Mai Anh', 'anhhoangmai@gmail.com', NULL, NULL, 45),
(51, 35, 'Vũ Đức Minh', 'minhvuduc@gmail.com', NULL, NULL, 45),
(52, 36, 'Nguyễn Thanh Tùng', 'tungnguyen@gmail.com', NULL, NULL, 45);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ketquabaikiemtra`
--

CREATE TABLE `ketquabaikiemtra` (
  `MaKetQua` int(11) NOT NULL,
  `MaBaiKiemTra` int(11) NOT NULL,
  `MaHocVien` int(11) NOT NULL,
  `Diem` decimal(5,2) NOT NULL,
  `NgayThi` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khoahoc`
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
-- Đang đổ dữ liệu cho bảng `khoahoc`
--

INSERT INTO `khoahoc` (`MaKhoaHoc`, `TenKhoaHoc`, `MoTa`, `TongSoBuoiHoc`, `ThoiLuongTrenLop`, `SiSoToiDa`, `GiaThanh`, `HinhAnh`) VALUES
(2, 'TOEIC Basic', 'Khóa học cơ bản, phù hợp cho người mới bắt đầu làm quen với TOEIC.', 10, '3 giờ/buổi', 10, 129.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978475/TOIECSCHOOL/toiec1.jpg'),
(4, 'TOEIC Intermediate', 'Khóa học trung cấp, dành cho những ai đã có kiến thức cơ bản về TOEIC.', 15, '3 giờ/buổi', 2, 193.50, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978527/TOIECSCHOOL/toiec4.jpg'),
(6, 'TOEIC Advanced', 'Khóa học nâng cao, giúp học viên đạt điểm số cao trong kỳ thi TOEIC.', 20, '3 giờ/buổi', 20, 260.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718978579/TOIECSCHOOL/toiec5.jpg'),
(12, 'TOEIC Speaking & Writing', 'Khóa học chuyên sâu vào kỹ năng nói và viết trong kỳ thi TOEIC.', 12, '2 giờ/buổi', 20, 180.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979125/TOIECSCHOOL/toiec3.jpg'),
(13, 'TOEIC Listening & Reading Part 1', 'Khóa học chuyên sâu vào kỹ năng nghe và đọc trong kỳ thi TOEIC.', 16, '2 giờ/buổi', 20, 250.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979226/TOIECSCHOOL/toiec6.jpg'),
(14, 'TOEIC Listening & Reading Part 2', 'Khóa học chuyên sâu vào kỹ năng nghe và đọc trong kỳ thi TOEIC.', 16, '2 giờ/buổi', 20, 250.00, 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1718979322/TOIECSCHOOL/toiec7.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lophoc`
--

CREATE TABLE `lophoc` (
  `MaLopHoc` int(11) NOT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayDuKienKetThuc` date DEFAULT NULL,
  `TongSoBuoiHoc` int(11) DEFAULT NULL,
  `ThoiLuongHocTrenLop` text DEFAULT NULL,
  `LichHocTrongTuan` text DEFAULT NULL,
  `MaCoSo` int(11) DEFAULT NULL,
  `MaKhoaHoc` int(11) DEFAULT NULL,
  `MaGiangVien` int(11) DEFAULT NULL,
  `SoLuongHocVienHienTai` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lophoc`
--

INSERT INTO `lophoc` (`MaLopHoc`, `NgayBatDau`, `NgayDuKienKetThuc`, `TongSoBuoiHoc`, `ThoiLuongHocTrenLop`, `LichHocTrongTuan`, `MaCoSo`, `MaKhoaHoc`, `MaGiangVien`, `SoLuongHocVienHienTai`) VALUES
(45, '2024-07-10', '2024-07-28', 10, '3', NULL, 1, 2, 12, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
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
-- Đang đổ dữ liệu cho bảng `nguoidung`
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
-- Cấu trúc bảng cho bảng `phanquyen`
--

CREATE TABLE `phanquyen` (
  `MaQuanLy` int(11) NOT NULL,
  `MaVaiTro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phanquyen`
--

INSERT INTO `phanquyen` (`MaQuanLy`, `MaVaiTro`) VALUES
(3, 1),
(4, 1),
(9, 1),
(11, 1),
(12, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanly`
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
-- Đang đổ dữ liệu cho bảng `quanly`
--

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `Email`, `SoDienThoai`, `TenTaiKhoan`, `MatKhau`, `NgaySinh`) VALUES
(3, 'Trần Lê Phương Trân', 'phuongtran0000@email.com', '0906512692', 'phuongtran1', '$2b$10$hz8VyvEs0e1bE1VjecWAoevup.BBJvqDEfw4lUfb8PkgayPsSMvDy', NULL),
(4, 'Trần Lê Phương Trân', 'phuongtran1111@email.com', '0906512691', 'phuongtran2', '$2b$10$d7PN7P4g7Nain0xr2qcFwet1GMWeUpveL6DwQfoseR1ff3NqjD0s.', NULL),
(9, 'Ngô Hồng Sơnn', 'minhtuan1@example.com', '789456125', 'hongson', '$2b$10$M5/PTopqgpQICSi.Vo963.oUub/ZhRsGzcYZ320Koe0XYjFeb4gYK', NULL),
(11, 'Nguyễn Đình Thống', 'dinhthong0000@email.com', '0385743427', 'dinhthong1', '$2b$10$GPln/iG5hT8NH3IvzuK2GOd.c3TZQ/JhbPA2UQlS8zxlyu7yNz1.i', NULL),
(12, 'Nguyễn Đình Thống', 'dinhthong0001@email.com', '0385743422', 'dinhthong2', '$2b$10$InWqzv73eM9XV8IXhKSJ5uZJBsa5qft4IQDr7oPDohktIZKMMdwpy', NULL);

--
-- Bẫy `quanly`
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
-- Cấu trúc bảng cho bảng `thanhtoan`
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
-- Cấu trúc bảng cho bảng `vaitro`
--

CREATE TABLE `vaitro` (
  `MaVaiTro` int(11) NOT NULL,
  `TenVaiTro` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vaitro`
--

INSERT INTO `vaitro` (`MaVaiTro`, `TenVaiTro`) VALUES
(1, 'Admin'),
(2, 'GiangVien');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `baigiang`
--
ALTER TABLE `baigiang`
  ADD PRIMARY KEY (`MaBaiGiang`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`);

--
-- Chỉ mục cho bảng `baikiemtra`
--
ALTER TABLE `baikiemtra`
  ADD PRIMARY KEY (`MaBaiKiemTra`);

--
-- Chỉ mục cho bảng `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD PRIMARY KEY (`MaBuoiHoc`),
  ADD KEY `MaLopHoc` (`MaLopHoc`);

--
-- Chỉ mục cho bảng `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD PRIMARY KEY (`MaCauHoi`),
  ADD KEY `MaBaiKiemTra` (`MaBaiKiemTra`);

--
-- Chỉ mục cho bảng `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  ADD PRIMARY KEY (`MaChiTiet`),
  ADD KEY `MaBaiGiang` (`MaBaiGiang`);

--
-- Chỉ mục cho bảng `cosodaotao`
--
ALTER TABLE `cosodaotao`
  ADD PRIMARY KEY (`MaCoSo`);

--
-- Chỉ mục cho bảng `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  ADD PRIMARY KEY (`MaDangKy`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`),
  ADD KEY `MaCoSo` (`MaCoSo`),
  ADD KEY `fk_MaNguoiDung` (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD PRIMARY KEY (`MaDiemDanh`),
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaBuoiHoc` (`MaBuoiHoc`);

--
-- Chỉ mục cho bảng `hocvien`
--
ALTER TABLE `hocvien`
  ADD PRIMARY KEY (`MaHocVien`),
  ADD KEY `MaLopHoc` (`MaLopHoc`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `ketquabaikiemtra`
--
ALTER TABLE `ketquabaikiemtra`
  ADD PRIMARY KEY (`MaKetQua`),
  ADD KEY `MaBaiKiemTra` (`MaBaiKiemTra`),
  ADD KEY `MaHocVien` (`MaHocVien`);

--
-- Chỉ mục cho bảng `khoahoc`
--
ALTER TABLE `khoahoc`
  ADD PRIMARY KEY (`MaKhoaHoc`);

--
-- Chỉ mục cho bảng `lophoc`
--
ALTER TABLE `lophoc`
  ADD PRIMARY KEY (`MaLopHoc`),
  ADD KEY `MaCoSo` (`MaCoSo`),
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`),
  ADD KEY `Fk_lophoc_giangvien` (`MaGiangVien`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD PRIMARY KEY (`MaQuanLy`,`MaVaiTro`),
  ADD KEY `MaVaiTro` (`MaVaiTro`);

--
-- Chỉ mục cho bảng `quanly`
--
ALTER TABLE `quanly`
  ADD PRIMARY KEY (`MaQuanLy`);

--
-- Chỉ mục cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`MaThanhToan`),
  ADD KEY `MaDangKy` (`MaDangKy`);

--
-- Chỉ mục cho bảng `vaitro`
--
ALTER TABLE `vaitro`
  ADD PRIMARY KEY (`MaVaiTro`),
  ADD UNIQUE KEY `TenVaiTro` (`TenVaiTro`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `baigiang`
--
ALTER TABLE `baigiang`
  MODIFY `MaBaiGiang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `baikiemtra`
--
ALTER TABLE `baikiemtra`
  MODIFY `MaBaiKiemTra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `buoihoc`
--
ALTER TABLE `buoihoc`
  MODIFY `MaBuoiHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT cho bảng `cauhoi`
--
ALTER TABLE `cauhoi`
  MODIFY `MaCauHoi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  MODIFY `MaChiTiet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT cho bảng `cosodaotao`
--
ALTER TABLE `cosodaotao`
  MODIFY `MaCoSo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  MODIFY `MaDangKy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT cho bảng `diemdanh`
--
ALTER TABLE `diemdanh`
  MODIFY `MaDiemDanh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT cho bảng `hocvien`
--
ALTER TABLE `hocvien`
  MODIFY `MaHocVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `ketquabaikiemtra`
--
ALTER TABLE `ketquabaikiemtra`
  MODIFY `MaKetQua` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `khoahoc`
--
ALTER TABLE `khoahoc`
  MODIFY `MaKhoaHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `lophoc`
--
ALTER TABLE `lophoc`
  MODIFY `MaLopHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT cho bảng `quanly`
--
ALTER TABLE `quanly`
  MODIFY `MaQuanLy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `vaitro`
--
ALTER TABLE `vaitro`
  MODIFY `MaVaiTro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `baigiang`
--
ALTER TABLE `baigiang`
  ADD CONSTRAINT `baigiang_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`);

--
-- Các ràng buộc cho bảng `buoihoc`
--
ALTER TABLE `buoihoc`
  ADD CONSTRAINT `buoihoc_ibfk_1` FOREIGN KEY (`MaLopHoc`) REFERENCES `lophoc` (`MaLopHoc`);

--
-- Các ràng buộc cho bảng `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD CONSTRAINT `cauhoi_ibfk_1` FOREIGN KEY (`MaBaiKiemTra`) REFERENCES `baikiemtra` (`MaBaiKiemTra`);

--
-- Các ràng buộc cho bảng `chitietbaigiang`
--
ALTER TABLE `chitietbaigiang`
  ADD CONSTRAINT `chitietbaigiang_ibfk_1` FOREIGN KEY (`MaBaiGiang`) REFERENCES `baigiang` (`MaBaiGiang`);

--
-- Các ràng buộc cho bảng `dangkyhoc`
--
ALTER TABLE `dangkyhoc`
  ADD CONSTRAINT `dangkyhoc_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`),
  ADD CONSTRAINT `dangkyhoc_ibfk_2` FOREIGN KEY (`MaCoSo`) REFERENCES `cosodaotao` (`MaCoSo`),
  ADD CONSTRAINT `fk_MaNguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Các ràng buộc cho bảng `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD CONSTRAINT `diemdanh_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`),
  ADD CONSTRAINT `diemdanh_ibfk_2` FOREIGN KEY (`MaBuoiHoc`) REFERENCES `buoihoc` (`MaBuoiHoc`);

--
-- Các ràng buộc cho bảng `hocvien`
--
ALTER TABLE `hocvien`
  ADD CONSTRAINT `hocvien_ibfk_1` FOREIGN KEY (`MaLopHoc`) REFERENCES `lophoc` (`MaLopHoc`),
  ADD CONSTRAINT `hocvien_ibfk_2` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Các ràng buộc cho bảng `ketquabaikiemtra`
--
ALTER TABLE `ketquabaikiemtra`
  ADD CONSTRAINT `ketquabaikiemtra_ibfk_1` FOREIGN KEY (`MaBaiKiemTra`) REFERENCES `baikiemtra` (`MaBaiKiemTra`),
  ADD CONSTRAINT `ketquabaikiemtra_ibfk_2` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`);

--
-- Các ràng buộc cho bảng `lophoc`
--
ALTER TABLE `lophoc`
  ADD CONSTRAINT `Fk_lophoc_giangvien` FOREIGN KEY (`MaGiangVien`) REFERENCES `quanly` (`MaQuanLy`),
  ADD CONSTRAINT `lophoc_ibfk_1` FOREIGN KEY (`MaCoSo`) REFERENCES `cosodaotao` (`MaCoSo`),
  ADD CONSTRAINT `lophoc_ibfk_3` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`);

--
-- Các ràng buộc cho bảng `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD CONSTRAINT `phanquyen_ibfk_1` FOREIGN KEY (`MaQuanLy`) REFERENCES `quanly` (`MaQuanLy`) ON DELETE CASCADE,
  ADD CONSTRAINT `phanquyen_ibfk_2` FOREIGN KEY (`MaVaiTro`) REFERENCES `vaitro` (`MaVaiTro`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `thanhtoan_ibfk_1` FOREIGN KEY (`MaDangKy`) REFERENCES `dangkyhoc` (`MaDangKy`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DELIMITER $$

CREATE PROCEDURE `taoLopHocVaThemHocVien` ()   
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE maKhoaHoc INT;
    DECLARE maCoSo INT;
    DECLARE soLuongDangKy INT;
    DECLARE siSoToiDa INT;
    DECLARE maLopHoc INT;

    -- Con trỏ để lấy các cặp khóa học và trung tâm phân biệt
    DECLARE cur CURSOR FOR 
        SELECT MaKhoaHoc, MaCoSo 
        FROM DangKyHoc 
        WHERE TrangThaiThanhToan = TRUE 
        GROUP BY MaKhoaHoc, MaCoSo;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO maKhoaHoc, maCoSo;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Lấy số lượng đăng ký và giới hạn tối đa của lớp
        SELECT COUNT(*), MAX(SiSoToiDa)
        INTO soLuongDangKy, siSoToiDa
        FROM DangKyHoc
        JOIN KhoaHoc ON DangKyHoc.MaKhoaHoc = KhoaHoc.MaKhoaHoc
        WHERE DangKyHoc.MaKhoaHoc = maKhoaHoc
          AND DangKyHoc.MaCoSo = maCoSo
          AND DangKyHoc.TrangThaiThanhToan = TRUE;

        -- Kiểm tra nếu số lượng đăng ký là 50% trở lên của giới hạn tối đa của lớp
        IF soLuongDangKy >= siSoToiDa / 2 THEN
            -- Tạo một lớp học mới
            INSERT INTO LopHoc (MaKhoaHoc, MaCoSo, NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop, LichHocTrongTuan)
            VALUES (maKhoaHoc, maCoSo, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), 20, 2, 'T2-T6');

            -- Lấy ID của lớp học mới đã tạo
            SET maLopHoc = LAST_INSERT_ID();

            -- Thêm học viên vào lớp học mới
            INSERT INTO HocVien (MaNguoiDung, HoTen, Email, MaLopHoc)
            SELECT MaNguoiDung, HoTen, Email, maLopHoc
            FROM DangKyHoc
            WHERE MaKhoaHoc = maKhoaHoc
              AND MaCoSo = maCoSo
              AND TrangThaiThanhToan = TRUE;
        END IF;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;
DELIMITER //

CREATE PROCEDURE taoLopHocVaThemHocVien()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE soLuongDangKy INT DEFAULT 0;
    DECLARE siSoToiDa INT DEFAULT 0;
    DECLARE maKhoaHocCur INT;
    DECLARE maCoSoCur INT;
    DECLARE maLopHoc INT;
    DECLARE tongSoBuoiHoc INT;
    DECLARE thoiLuongHocTrenLop INT;

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
        SELECT lh.MaLopHoc INTO maLopHoc
        FROM LopHoc lh
        LEFT JOIN (
            SELECT MaLopHoc, COUNT(*) AS SoLuongHocVien
            FROM HocVien
            GROUP BY MaLopHoc
        ) hv ON lh.MaLopHoc = hv.MaLopHoc
        WHERE lh.MaKhoaHoc = maKhoaHocCur 
          AND lh.MaCoSo = maCoSoCur
          AND (siSoToiDa - IFNULL(hv.SoLuongHocVien, 0)) > 0
        ORDER BY (siSoToiDa - IFNULL(hv.SoLuongHocVien, 0)) DESC
        LIMIT 1;

        -- If no existing class or class is full, create a new class
        IF maLopHoc IS NULL THEN
            INSERT INTO LopHoc (MaKhoaHoc, MaCoSo, NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop)
            VALUES (maKhoaHocCur, maCoSoCur, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), tongSoBuoiHoc, thoiLuongHocTrenLop);

            -- Get the new class ID
            SET maLopHoc = LAST_INSERT_ID();
        END IF;

        -- Add students to the class
        INSERT INTO HocVien (MaNguoiDung, HoTen, Email, MaLopHoc)
        SELECT dk.MaNguoiDung, dk.HoTen, dk.Email, maLopHoc
        FROM DangKyHoc dk
        WHERE dk.MaKhoaHoc = maKhoaHocCur
          AND dk.MaCoSo = maCoSoCur
          AND dk.TrangThaiThanhToan = TRUE;

        -- Delete the entries from DangKyHoc after adding to HocVien
        DELETE FROM DangKyHoc
        WHERE MaKhoaHoc = maKhoaHocCur
          AND MaCoSo = maCoSoCur
          AND TrangThaiThanhToan = TRUE;

    END LOOP;

    CLOSE cur;
END

DELIMITER ;
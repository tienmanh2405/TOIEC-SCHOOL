BEGIN
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
END

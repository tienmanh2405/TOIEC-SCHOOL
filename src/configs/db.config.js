export const DB_CONFID = {
    baseUrl: "http://localhost:3000",
    resourses: {
        user: {
            contextPath: "/users",
            role: 'nguoidung'
        },
        admin: {
            contextPath: "/admins",
            role: 'Admin'
        },
        giangvien: {
            contextPath: "/giangviens",
            role: 'GiangVien'
        }
    },
    mysql_connect: {
        host: "localhost",
        port: 3307,
        user: "lv4",
        password: "123456789",
        database: "toiecschool"
    },
    table:{
        baigiang: "baigiang",
        buoihoc: "buoihoc",
        cosodaotao: "cosodaotao",
        dangkyhoc: "dangkyhoc",
        diemdanh: "diemdanh",
        quanly: "quanly",
        hocvien: "hocvien",
        khoahoc: "khoahoc",
        lophoc: "lophoc",
        nguoidung: "nguoidung",
        phanquyen: "phanquyen",
        thanhtoan: "thanhtoan",
        vaitro: "vaitro",
        chitietbaigiang: "chitietbaigiang",
        baikiemtra: "baikiemtra",
        baigiang:"baigiang"
    }
}
import { DB_CONFID } from '../configs/db.config.js';
import KhoaHoc from '../models/khoahoc.model.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dh0lhvm9l',
    api_key: '314188383667441',
    api_secret: 'g_PBWzOuyUVbjMZymyMR8BjwfZE'
  });
  
const getKhoaHocs = async (req, res) => {
    try {
        let khoahocs = await KhoaHoc.getAll();
        if (req.body) {
            const { page, pageSize, sortOrder } = req.body;

            khoahocs = await KhoaHoc.getAll(
                page || 1,
                pageSize,
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get KhoaHoc successfully!',
                data: khoahocs
            });
        }
        res.status(200).json({ success: true, data: khoahocs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getKhoaHocById = async (req, res) => {
    try {
        const khoahoc = await KhoaHoc.getById(req.params.id);
        res.status(200).json({ success: true, data: khoahoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Vui lòng chọn một tập tin hình ảnh', success: false });
          }
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          const fileName = file.originalname.split('.')[0];
      
          // Upload hình ảnh lên Cloudinary và nhận lại URL của hình ảnh đã tải lên
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataUrl, {
              public_id: fileName,
              resource_type: 'auto',
              folder: "TOIECSCHOOL"
              // có thể thêm field folder nếu như muốn tổ chức
            }, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        const imageUrl = result.secure_url;
        const {TenKhoaHoc, MoTa, TongSoBuoiHoc, ThoiLuongTrenLop, SiSoToiDa, GiaThanh} = req.body;

        const newKhoaHoc = {
            TenKhoaHoc,
            MoTa,
            TongSoBuoiHoc,
            ThoiLuongTrenLop,
            SiSoToiDa,
            GiaThanh,
            HinhAnh: imageUrl 
        };

        const createdKhoaHoc = await KhoaHoc.create(newKhoaHoc);
        res.status(201).json({ success: true, data: createdKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const {TenKhoaHoc, MoTa, TongSoBuoiHoc, ThoiLuongTrenLop, SiSoToiDa, GiaThanh } = req.body;

        let updateData = {};
        if (TenKhoaHoc) updateData.TenKhoaHoc = TenKhoaHoc;
        if (MoTa) updateData.MoTa = MoTa;
        if (TongSoBuoiHoc) updateData.TongSoBuoiHoc = TongSoBuoiHoc;
        if (ThoiLuongTrenLop) updateData.ThoiLuongTrenLop = ThoiLuongTrenLop;
        if (SiSoToiDa) updateData.SiSoToiDa = SiSoToiDa;
        if (GiaThanh) updateData.GiaThanh = GiaThanh;

        const updatedKhoaHoc = await KhoaHoc.update(updateData, req.params.id);
        res.status(200).json({ success: true, data: updatedKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const khoahoc = await KhoaHoc.delete(req.params.id);
        
        res.status(200).json(khoahoc);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc };

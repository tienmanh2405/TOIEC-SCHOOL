import { DB_CONFID } from '../configs/db.config.js';
import CauHoi from '../models/cauhoi.model.js';
import KetQuaBaiKiemTra from '../models/ketquabaiKiemTra.model.js';

const getCauHois = async (req, res) => {
    try {
        let CauHois = await CauHoi.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            CauHois = await CauHoi.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get CauHois successfully!',
                data: CauHois
            });
            }
        res.status(200).json({
            msg: 'Get CauHois successfully!',
            data: CauHois
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCauHoiByMaBaiKiemTra = async (req, res) => {
    try {
        const MaBaiKiemTra = req.params.MaBaiKiemTra;
        const cauhoi = await CauHoi.findAll({MaBaiKiemTra});
        if (!cauhoi) {
            res.status(404).json({
                success: false,
                message: 'cauhoi not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: cauhoi
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createCauHoi = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const { MaBaiKiemTra , NoiDung ,LuaChon1, LuaChon2, LuaChon3, LuaChon4, DapAnDung } = req.body;
        const newCauHoi = new CauHoi({ MaBaiKiemTra , NoiDung ,LuaChon1, LuaChon2, LuaChon3, LuaChon4, DapAnDung });
        const cauhoi = await CauHoi.create(newCauHoi);
        res.status(201).json({
            success: true,
            message: 'cauhoi created successfully',
            data: cauhoi
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCauHoi = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        await CauHoi.delete(req.params.MaCauHoi);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCauHoi = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaCauHoi = req.params.MaCauHoi;
        const { MaBaiKiemTra , NoiDung ,LuaChon1, LuaChon2, LuaChon3, LuaChon4, DapAnDung } = req.body;
        
        let updateData = {};
        if (MaBaiKiemTra) updateData.MaBaiKiemTra = MaBaiKiemTra;
        if (NoiDung) updateData.NoiDung = NoiDung;
        if (LuaChon1) updateData.LuaChon1 = LuaChon1;
        if (LuaChon2) updateData.LuaChon2 = LuaChon2;
        if (LuaChon3) updateData.LuaChon3 = LuaChon3;
        if (LuaChon4) updateData.LuaChon4 = LuaChon4;
        if (DapAnDung) updateData.DapAnDung = DapAnDung;

        const updatedCauHoi = await CauHoi.update(updateData, MaCauHoi);
        res.status(200).json({
            success: true,
            message: 'CauHoi updated successfully',
            data: updatedCauHoi
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const scoreBaiKiemTra = async (req, res) => {
        // Mẫu req.body
        // {
        //     "MaHocVien": 1,
        //     "answers": {
        //         "1": "harvested",
        //         "2": "had harvested",
        //         "3": "answer_for_question_3",
        //         "4": "answer_for_question_4",
        //         "5": "answer_for_question_5",
        //         "6": "answer_for_question_6",
        //         "7": "answer_for_question_7",
        //         "8": "answer_for_question_8",
        //         "9": "answer_for_question_9"
        //     }
        // }
        
try {
    const MaBaiKiemTra = req.params.MaBaiKiemTra;
    const { MaHocVien, answers } = req.body;
    
    const cauhois = await CauHoi.findAll({ MaBaiKiemTra });

    if (cauhois.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No questions found for this BaiKiemTra'
        });
    }

    let score = 0;
    let totalQuestions = cauhois.length;

    cauhois.forEach(cauhoi => {
        if (answers[cauhoi.MaCauHoi] === cauhoi.DapAnDung) {
            score++;
        }
    });

    // Lưu điểm thi 
    const newKetQua = {
        MaBaiKiemTra,
        MaHocVien,
        Diem: parseFloat((score / totalQuestions * 10).toFixed(2)) // Tính điểm và làm tròn 2 chữ số thập phân
    };

    await KetQuaBaiKiemTra.create(newKetQua);

    res.status(200).json({
        success: true,
        data: {
            score: newKetQua.Diem,
            totalQuestions
        }
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
};
export { getCauHois , getCauHoiByMaBaiKiemTra, createCauHoi, deleteCauHoi,updateCauHoi, scoreBaiKiemTra }
    
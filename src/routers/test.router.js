import express from 'express';
import Product from '../models/test.model.js';

const router = express.Router();
router.get('/', async (_, res) => {
    Product.getAll((product)=>{
        res.json(product);
    })});

export default router;
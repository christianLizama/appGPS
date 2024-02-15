import express from 'express';
import path from 'path';
import {
    addEmpresa,
    getEmpresas
} from '../controllers/empresaController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Respondiendo desde empresa');
});

router.post('/add', addEmpresa);
router.get('/getAll', getEmpresas);

export default router;
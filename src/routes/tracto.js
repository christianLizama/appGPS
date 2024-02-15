//crear rutas para producto
import express from 'express';
import {
    addTracto,
    getTractos,
    addTractosFromExcel
} from '../controllers/tractoController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Respondiendo desde tracto');
});

router.get('/getAll', getTractos);
router.post('/add', addTracto);
router.post('/addFromExcel', addTractosFromExcel);


export default router;
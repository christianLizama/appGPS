import Empresa from "../models/empresa.js";

// Agregar una nueva empresa
export const addEmpresa = async (req, res) => {
  try {
    const { nombre, rut } = req.body;
    console.log(req.body);
    const empresa = new Empresa({
      nombre: nombre,
      rut: rut,
    });
    const empresaNueva = await empresa.save();
    res
      .status(201)
      .json({
        message: "Empresa agregada exitosamente",
        empresa: empresaNueva,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

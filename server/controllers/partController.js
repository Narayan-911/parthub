const Part = require('../models/Part');

/**
 * @desc   Get all automotive parts (or sample catalog if DB empty)
 * @route  GET /api/parts
 * @access Public
 */
const getParts = async (req, res, next) => {
  try {
    const parts = await Part.find({});
    res.status(200).json({
      success: true,
      count: parts.length,
      data: parts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single part by ID
 * @route  GET /api/parts/:id
 * @access Public
 */
const getPartById = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      res.status(404);
      throw new Error(`Part not found with ID ${req.params.id}`);
    }
    res.status(200).json({
      success: true,
      data: part,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new automotive part
 * @route  POST /api/parts
 * @access Protected
 */
const createPart = async (req, res, next) => {
  try {
    const newPart = await Part.create(req.body);
    res.status(201).json({
      success: true,
      data: newPart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParts,
  getPartById,
  createPart,
};

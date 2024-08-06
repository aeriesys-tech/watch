const db = require("../models");
const { Op } = require("sequelize");

const addKeyword = async (req, res) => {
  const { language_id, keyword, regional_keyword } = req.body;
  try {
    const newKeyword = await db.Keyword.create({
      language_id,
      keyword,
      regional_keyword,
    });
    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateKeyword = async (req, res) => {
  const { keyword_id, language_id, keyword, regional_keyword } = req.body;
  try {
    const [updated] = await db.Keyword.update(
      { language_id, keyword, regional_keyword },
      {
        where: { keyword_id },
      }
    );
    if (updated) {
      const updatedKeyword = await db.Keyword.findByPk(keyword_id);
      res.status(200).json(updatedKeyword);
    } else {
      res.status(404).json({ error: "Keyword not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteKeyword = async (req, res) => {
  const { keyword_id } = req.body;
  try {
    const deleted = await db.Keyword.destroy({
      where: { keyword_id },
    });
    if (deleted) {
      res.status(200).json({ message: "Keyword successfully deleted" });
    } else {
      res.status(404).json({ error: "Keyword not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewKeyword = async (req, res) => {
  const { keyword_id } = req.body;
  try {
    const keyword = await db.Keyword.findByPk(keyword_id);
    if (keyword) {
      res.status(200).json(keyword);
    } else {
      res.status(404).json({ error: "Keyword not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getKeywords = async (req, res) => {
  try {
    const keywords = await db.Keyword.findAll();
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const paginateKeywords = async (req, res) => {
//   const { limit = 10, offset = 0 } = req.body;
//   try {
//     const { count, rows } = await db.Keyword.findAndCountAll({
//       limit,
//       offset,
//     });
//     res.status(200).json({ count, keywords: rows });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const paginateKeywords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      order = "asc",
      search = "",
      status,
    } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object dynamically
    const sort = [[sortBy, order.toUpperCase()]];

    // Implement search and status filter
    const where = {
      ...(search && {
        [Op.or]: [
          { keyword: { [Op.like]: `%${search}%` } },
          // Add any other fields you want to search by
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const keywords = await db.Keyword.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      paranoid: false,
    });

    res.status(200).json({
      data: keywords.rows,
      totalPages: Math.ceil(keywords.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: keywords.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addKeyword,
  updateKeyword,
  deleteKeyword,
  viewKeyword,
  getKeywords,
  paginateKeywords,
};

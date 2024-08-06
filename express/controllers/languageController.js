const db = require("../models");
const { Op } = require("sequelize");

const addLanguage = async (req, res) => {
  const { language, status } = req.body;
  try {
    const newLanguage = await db.Language.create({ language, status });
    res.status(201).json(newLanguage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLanguage = async (req, res) => {
  const { language_id, language, status } = req.body;
  try {
    const [updated] = await db.Language.update(
      { language, status },
      {
        where: { language_id },
      }
    );
    if (updated) {
      const updatedLanguage = await db.Language.findByPk(language_id);
      res.status(200).json(updatedLanguage);
    } else {
      res.status(404).json({ error: "Language not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const deleteLanguage = async (req, res) => {
//   const { language_id } = req.body;
//   try {
//     const deleted = await db.Language.destroy({
//       where: { language_id },
//     });
//     if (deleted) {
//       console.log("Language successfully deleted");
//       res.status(200).json({ message: "Language successfully deleted" });
//     } else {
//       console.log("Language not found");
//       res.status(404).json({ error: "Language not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting language:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

const deleteLanguage = async (req, res) => {
  try {
    const { language_id } = req.body;

    // Fetch the language, including those marked as deleted (paranoid: false)
    const language = await db.Language.findOne({
      where: { language_id },
      paranoid: false,
    });
    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }

    // Log the current state of the language
    console.log(`Current state of language ${language_id}:`, language.toJSON());

    if (language.deleted_at) {
      // Restore the language
      await language.restore(); // Restore the record
      language.status = true; // Update status after restoring (if there's a status field)
      await language.save(); // Save the changes
      console.log(`Restored language with ID ${language_id}`);
      return res.json({ message: "Language restored successfully" });
    } else {
      // Soft delete the language
      language.status = false; // Update status before deleting (if there's a status field)
      await language.save(); // Save the status change
      await language.destroy(); // Soft delete the record
      console.log(`Soft deleted language with ID ${language_id}`);
      return res.json({ message: "Language soft deleted successfully" });
    }
  } catch (error) {
    console.error("Error in deleteLanguage function:", error);
    res.status(500).json({ error: error.message });
  }
};

const viewLanguage = async (req, res) => {
  const { language_id } = req.body;
  try {
    const language = await db.Language.findByPk(language_id);
    if (language) {
      res.status(200).json(language);
    } else {
      res.status(404).json({ error: "Language not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLanguages = async (req, res) => {
  try {
    const languages = await db.Language.findAll();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const paginateLanguages = async (req, res) => {
//   const { limit = 10, offset = 0 } = req.body;
//   try {
//     const { count, rows } = await db.Language.findAndCountAll({
//       limit,
//       offset,
//     });
//     res.status(200).json({ count, languages: rows });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const paginateLanguages = async (req, res) => {
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
          { language: { [Op.like]: `%${search}%` } },

          // Add any other fields you want to search by
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const languages = await db.Language.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      paranoid: false,
    });

    res.status(200).json({
      data: languages.rows,
      totalPages: Math.ceil(languages.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: languages.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addLanguage,
  updateLanguage,
  deleteLanguage,
  viewLanguage,
  getLanguages,
  paginateLanguages,
};

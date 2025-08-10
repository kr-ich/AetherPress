// CRUD operations for AetherPress tables
const db = require("./db");

// --- PROMPTS ---
exports.createPrompt = (prompt, cb) => {
  db.run(`INSERT INTO prompts (prompt) VALUES (?)`, [prompt], function (err) {
    cb(err, this ? { id: this.lastID } : null);
  });
};

exports.getPrompts = (cb) => {
  db.all(`SELECT * FROM prompts ORDER BY created_at DESC`, [], cb);
};

exports.getPromptById = (id, cb) => {
  db.get(`SELECT * FROM prompts WHERE id = ?`, [id], cb);
};

exports.updatePrompt = (id, prompt, cb) => {
  db.run(
    `UPDATE prompts SET prompt = ? WHERE id = ?`,
    [prompt, id],
    function (err) {
      cb(err, { changes: this.changes });
    }
  );
};

exports.deletePrompt = (id, cb) => {
  db.run(`DELETE FROM prompts WHERE id = ?`, [id], function (err) {
    cb(err, { changes: this.changes });
  });
};

// --- AI_RESULTS ---
exports.createAIResult = (prompt_id, result, cb) => {
  let jsonResult;
  try {
    jsonResult = JSON.stringify(result);
  } catch (e) {
    return cb(new Error("Invalid result object for JSON serialization"));
  }

  db.run(
    `INSERT INTO ai_results (prompt_id, result) VALUES (?, ?)`,
    [prompt_id, jsonResult],
    function (err) {
      cb(err, this ? { id: this.lastID } : null);
    }
  );
};

exports.getAIResults = (cb) => {
  db.all(
    `SELECT * FROM ai_results ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) return cb(err);
      try {
        rows = rows.map((row) => ({
          ...row,
          result: JSON.parse(row.result),
        }));
        cb(null, rows);
      } catch (e) {
        cb(new Error("Invalid JSON in database"));
      }
    }
  );
};

exports.getAIResultById = (id, cb) => {
  db.get(`SELECT * FROM ai_results WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return cb(err, row);
    try {
      row.result = JSON.parse(row.result);
      cb(null, row);
    } catch (e) {
      cb(new Error("Invalid JSON in database"));
    }
  });
};

exports.updateAIResult = (id, result, cb) => {
  db.run(
    `UPDATE ai_results SET result = ? WHERE id = ?`,
    [result, id],
    function (err) {
      cb(err, { changes: this.changes });
    }
  );
};

exports.deleteAIResult = (id, cb) => {
  db.run(`DELETE FROM ai_results WHERE id = ?`, [id], function (err) {
    cb(err, { changes: this.changes });
  });
};

// --- OVERRIDES ---
exports.createOverride = (ai_result_id, override, cb) => {
  let jsonOverride;
  try {
    jsonOverride = JSON.stringify(override);
  } catch (e) {
    return cb(new Error("Invalid override object for JSON serialization"));
  }

  db.run(
    `INSERT INTO overrides (ai_result_id, override) VALUES (?, ?)`,
    [ai_result_id, jsonOverride],
    function (err) {
      cb(err, this ? { id: this.lastID } : null);
    }
  );
};

exports.getOverrides = (cb) => {
  console.log("DEBUG: crud.getOverrides called");
  db.all(
    `SELECT * FROM overrides ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      console.log("DEBUG: db.all callback received:", {
        err,
        rowCount: rows?.length,
      });
      if (err) {
        console.error("DEBUG: Database error:", err);
        return cb(err);
      }
      try {
        console.log("DEBUG: Processing rows:", rows);
        rows = rows.map((row) => {
          console.log("DEBUG: Processing row:", row);
          return {
            ...row,
            override:
              typeof row.override === "string"
                ? JSON.parse(row.override)
                : row.override,
          };
        });
        console.log("DEBUG: Successfully processed all rows");
        cb(null, rows);
      } catch (e) {
        console.error("DEBUG: JSON parsing error:", e);
        cb(new Error("Invalid JSON in database"));
      }
    }
  );
};

exports.getOverrideById = (id, cb) => {
  db.get(`SELECT * FROM overrides WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return cb(err, row);
    try {
      row.override =
        typeof row.override === "string"
          ? JSON.parse(row.override)
          : row.override;
      cb(null, row);
    } catch (e) {
      cb(new Error("Invalid JSON in database"));
    }
  });
};

exports.updateOverride = (id, override, cb) => {
  let jsonOverride;
  try {
    jsonOverride = JSON.stringify(override);
  } catch (e) {
    return cb(new Error("Invalid override object for JSON serialization"));
  }

  db.run(
    `UPDATE overrides SET override = ? WHERE id = ?`,
    [jsonOverride, id],
    function (err) {
      if (err) return cb(err);
      if (this.changes === 0) return cb(null, { changes: 0 });
      cb(null, { changes: this.changes });
    }
  );
};

exports.deleteOverride = (id, cb) => {
  db.run(`DELETE FROM overrides WHERE id = ?`, [id], function (err) {
    cb(err, { changes: this.changes });
  });
};

// --- PDF_EXPORTS ---
exports.createPDFExport = (ai_result_id, file_path, cb) => {
  db.run(
    `INSERT INTO pdf_exports (ai_result_id, file_path) VALUES (?, ?)`,
    [ai_result_id, file_path],
    function (err) {
      cb(err, this ? { id: this.lastID } : null);
    }
  );
};

exports.getPDFExports = (cb) => {
  db.all(`SELECT * FROM pdf_exports ORDER BY created_at DESC`, [], cb);
};

exports.getPDFExportById = (id, cb) => {
  db.get(`SELECT * FROM pdf_exports WHERE id = ?`, [id], cb);
};

exports.updatePDFExport = (id, file_path, cb) => {
  db.run(
    `UPDATE pdf_exports SET file_path = ? WHERE id = ?`,
    [file_path, id],
    function (err) {
      cb(err, { changes: this.changes });
    }
  );
};

exports.deletePDFExport = (id, cb) => {
  db.run(`DELETE FROM pdf_exports WHERE id = ?`, [id], function (err) {
    cb(err, { changes: this.changes });
  });
};

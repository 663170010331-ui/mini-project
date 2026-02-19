import { Router } from "express";
import pool from "../config/pg.js";
import upload from "../middleware/upload.js";
const stdRoute = Router();

stdRoute.post("/create-std", async (req, res) => {
  try {
    const { fullName, studentId, username, password } = req.body;
    if (!fullName || !studentId || !username || !password)
      return res.status(400);

    const where = `select * from students where username = $1 or std_class_id = $2`;
    const fintExitStd = await pool.query(where, [username, studentId]);
    if (fintExitStd.rows.length > 0)
      return res.json({
        err: "มีข้อมูลรหัสนักศึกษานี้หรือ username นี้อยู่แล้ว",
      });

    const query = `INSERT INTO students (fullname,std_class_id,username,password,major) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const result = await pool.query(query, [
      fullName,
      studentId,
      username,
      password,
      "IT",
    ]);
    if (!result) return res.status(400);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

stdRoute.post("/create-easy", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
});

stdRoute.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { type } = req.query;
    console.log("🚀 ~ type:", type)

    if (!username || !password) {
      return res.status(400).json({ err: "กรุณากรอก username และ password" });
    }

    let query = `
      SELECT *
      FROM students
      WHERE username = $1
        AND password = $2
      LIMIT 1
    `;
    if (type == 2) {
      query = `
      SELECT *
      FROM professors
      WHERE username = $1
        AND password = $2
      LIMIT 1
    `;
    }

    const result = await pool.query(query, [username, password]);
    console.log("🚀 ~ query:", query)

    console.log("🚀 ~ result.rows:", result.rows)
    if (result.rows.length === 0) {
      return res.status(401).json({ err: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    return res.status(200).json({
      data: { ...result.rows[0], role: type },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
});

stdRoute.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ req.params:", req.params);
    const { fullname, major } = req.body;
    console.log("🚀 ~ req.body:", req.body);

    if (!id) {
      return res.status(400).json({ err: "กรุณาระบุ id" });
    }

    if (!fullname && !major) {
      return res.status(400).json({
        err: "ต้องมีอย่างน้อย fullname หรือ major",
      });
    }

    const query = `
      UPDATE students
      SET
        fullname = COALESCE($1, fullname),
        major = COALESCE($2, major)
      WHERE student_id = $3
      RETURNING  fullname, major
    `;

    const result = await pool.query(query, [fullname, major, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ err: "ไม่พบข้อมูลนักเรียน" });
    }

    return res.status(200).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
});

stdRoute.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ err: "กรุณาระบุ id" });
    }

    const query = `
      SELECT student_id, fullname, std_class_id, username, major
      FROM students
      WHERE student_id = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ err: "ไม่พบข้อมูลนักเรียน" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
});

stdRoute.delete("/students/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ err: "กรุณาระบุ id" });
    }

    await client.query("BEGIN");

    // 1. ลบข้อมูลลูกก่อน
    await client.query("DELETE FROM enrollments WHERE student_id = $1", [id]);

    // 2. ลบนักเรียน (ต้องมี RETURNING)
    const result = await client.query(
      `
      DELETE FROM students
      WHERE student_id = $1
      RETURNING student_id
      `,
      [id],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ err: "ไม่พบข้อมูลนักเรียน" });
    }

    await client.query("COMMIT");

    return res.status(200).json({
      ok: true,
      msg: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  } finally {
    client.release();
  }
});

stdRoute.get("/students", async (req, res) => {
  try {
    const query = `
   SELECT
  student_id,
  fullname,
  std_class_id,
  username,
  major
FROM students 

    `;

    const result = await pool.query(query);
    console.log("🚀 ~ result.rows:", result.rows);
    return res.status(200).json({
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
});

stdRoute.post("/check-class", upload.single("leavDoc"), async (req, res) => {
  try {
    const { status, classId, stdId } = req.body;
    const filePath = req.file ? req.file.path : null;

    const query = `
        INSERT INTO attendance
        (course_id, student_id, checkin_time, status, leave_file)
        VALUES ($1, $2, $3, $4, $5)
      `;

    await pool.query(query, [classId, stdId, new Date(), status, filePath]);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Upload failed" });
  }
});

export default stdRoute;

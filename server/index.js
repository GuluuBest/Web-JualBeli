const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3001;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "guluustore",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("✅ Successfully connected to MySQL database.");
});

app.get("/", (req, res) => {
  res.send("🎉 Server GuluuStore Berhasil Berjalan!");
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)";

    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ message: "Username or email already exists" });
        }
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", (req, res) => {
  // Ambil identifier (bisa email atau username) dan password
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username/Email and password are required" });
  }

  // Cek apakah identifier adalah email atau bukan
  const isEmail = identifier.includes("@");

  // Siapkan query SQL berdasarkan jenis identifier
  const column = isEmail ? "email" : "username";
  const sql = `SELECT * FROM users WHERE ${column} = ?`;

  db.query(sql, [identifier], async (err, results) => {
    try {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      const isPasswordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const payload = { id: user.id, username: user.username };
      const secretKey = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secretKey, { expiresIn: "8h" });

      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    } catch (error) {
      console.error("Error during login process:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;

  const sqlFindUser = "SELECT * FROM users WHERE email = ?";
  db.query(sqlFindUser, [email], (err, users) => {
    if (err || users.length === 0) {
      return res.status(200).json({
        message:
          "If your email is in our database, you will receive a reset link.",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + 3600000;

    const sqlUpdateToken =
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?";
    db.query(sqlUpdateToken, [token, expires, email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "maddison53@ethereal.email",
          pass: "jn7jnAPss4f63QBp6D",
        },
      });

      const mailOptions = {
        from: '"GuluuStore" <noreply@guluustore.com>',
        to: email,
        subject: "Password Reset Request",
        text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://localhost:3000/reset/${token}\n\n` + // Asumsi front-end Anda ada di port 3000
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Reset email sent");
        res.status(200).json({
          message:
            "If your email is in our database, you will receive a reset link.",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
      }
    });
  });
});

app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const sqlFindToken =
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?";
  db.query(sqlFindToken, [token, Date.now()], async (err, users) => {
    if (err || users.length === 0) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sqlUpdatePass =
      "UPDATE users SET hashed_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?";
    db.query(sqlUpdatePass, [hashedPassword, token], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating password" });
      }
      res
        .status(200)
        .json({ message: "Password has been updated successfully." });
    });
  });
});

app.get("/api/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to your profile, ${req.user.username}!`,
    user: req.user,
  });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token format is incorrect" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

app.post(
  "/api/listings/create",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    console.log("--- Menerima permintaan 'create listing' ---");

    console.log("Data Body:", req.body);
    console.log("Data File:", req.file);

    const { title, description, price, category } = req.body;
    const seller_id = req.user.id;

    if (!req.file) {
      console.log("Error: Tidak ada file gambar yang diunggah.");
      return res.status(400).json({ message: "Image is required." });
    }

    const imageUrl = "uploads/" + req.file.filename;

    if (!title || !price || !category) {
      console.log("Error: Judul, harga, atau kategori kosong.");
      return res
        .status(400)
        .json({ message: "Title, price, and category are required." });
    }

    const sql =
      "INSERT INTO listings (seller_id, title, description, price, category) VALUES (?, ?, ?, ?, ?)";
    console.log("Menjalankan query pertama untuk menyimpan listing...");

    db.query(
      sql,
      [seller_id, title, description, price, category],
      (err, result) => {
        if (err) {
          console.error("!!! GAGAL di query pertama:", err);
          return res
            .status(500)
            .json({ message: "Database error while creating listing." });
        }

        const listingId = result.insertId;
        console.log(
          `Listing berhasil dibuat dengan ID: ${listingId}. Menyimpan gambar...`
        );

        const imageSql =
          "INSERT INTO listing_images (listing_id, image_url) VALUES (?, ?)";
        console.log("Menjalankan query kedua untuk menyimpan gambar...");

        db.query(imageSql, [listingId, imageUrl], (err, imageResult) => {
          if (err) {
            console.error("!!! GAGAL di query kedua:", err);
            return res
              .status(500)
              .json({ message: "Database error while saving image." });
          }

          console.log("--- Permintaan 'create listing' berhasil diproses ---");
          res.status(201).json({
            message: "Listing created successfully!",
            listingId: listingId,
          });
        });
      }
    );
  }
);

app.get("/api/listings", (req, res) => {
  const sql = `
      SELECT 
        l.id, 
        l.title, 
        l.price, 
        l.category, 
        u.username AS seller_username,
        (SELECT li.image_url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.id LIMIT 1) AS image_url
      FROM listings l 
      JOIN users u ON l.seller_id = u.id 
      ORDER BY l.created_at DESC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching listings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  const listingSql = `
    SELECT 
      l.*, 
      u.username AS seller_username 
    FROM listings l 
    JOIN users u ON l.seller_id = u.id 
    WHERE l.id = ?
  `;

  db.query(listingSql, [id], (err, listings) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Database error on listings query" });
    if (listings.length === 0)
      return res.status(404).json({ message: "Listing not found" });

    const listing = listings[0];

    const imageSql =
      "SELECT image_url FROM listing_images WHERE listing_id = ?";
    db.query(imageSql, [id], (err, images) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error on images query" });

      listing.images = images;

      res.status(200).json(listing);
    });
  });
});

app.delete("/api/listings/:id", verifyToken, (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id;

  const findSql =
    "SELECT l.seller_id, li.image_url FROM listings l LEFT JOIN listing_images li ON l.id = li.listing_id WHERE l.id = ?";

  db.query(findSql, [listingId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Listing not found" });

    const listing = results[0];

    if (listing.seller_id !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this listing." });
    }

    if (listing.image_url) {
      const imagePath = path.join(__dirname, listing.image_url);
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting image file:", unlinkErr);
      });
    }

    const deleteImageSql = "DELETE FROM listing_images WHERE listing_id = ?";
    db.query(deleteImageSql, [listingId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      const deleteListingSql = "DELETE FROM listings WHERE id = ?";
      db.query(deleteListingSql, [listingId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json({ message: "Listing deleted successfully." });
      });
    });
  });
});

app.get("/api/my-listings", verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      l.id, l.title, l.price, l.category,
      (SELECT li.image_url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.id LIMIT 1) AS image_url
    FROM listings l
    WHERE l.seller_id = ?
    ORDER BY l.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

app.put(
  "/api/listings/:id",
  verifyToken,
  upload.array("images", 7),
  (req, res) => {
    const listingId = req.params.id;
    const userId = req.user.id;
    const { title, description, price, category } = req.body;
    const newFiles = req.files; // req.files berisi array gambar baru

    // Langkah 1: Verifikasi kepemilikan
    const findSql = "SELECT seller_id FROM listings WHERE id = ?";
    db.query(findSql, [listingId], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error on find" });
      if (results.length === 0)
        return res.status(404).json({ message: "Listing not found" });
      if (results[0].seller_id !== userId)
        return res.status(403).json({ message: "Forbidden" });

      // Jika ada gambar baru yang diunggah, jalankan proses hapus-dan-ganti
      if (newFiles && newFiles.length > 0) {
        // Ambil semua URL gambar lama untuk dihapus dari folder
        const findOldImagesSql =
          "SELECT image_url FROM listing_images WHERE listing_id = ?";
        db.query(findOldImagesSql, [listingId], (err, oldImages) => {
          if (err)
            return res
              .status(500)
              .json({ message: "DB error on find old images" });

          // Hapus file fisik gambar lama
          oldImages.forEach((img) => {
            fs.unlink(path.join(__dirname, img.image_url), (unlinkErr) => {
              if (unlinkErr)
                console.error("Failed to delete old image file:", unlinkErr);
            });
          });

          // Hapus record gambar lama dari database
          const deleteOldImagesSql =
            "DELETE FROM listing_images WHERE listing_id = ?";
          db.query(deleteOldImagesSql, [listingId], (err, deleteResult) => {
            if (err)
              return res
                .status(500)
                .json({ message: "DB error on delete old images" });

            // Masukkan record gambar baru ke database
            const imageValues = newFiles.map((file) => [
              listingId,
              "uploads/" + file.filename,
            ]);
            const insertNewImagesSql =
              "INSERT INTO listing_images (listing_id, image_url) VALUES ?";
            db.query(insertNewImagesSql, [imageValues], (err, insertResult) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "DB error on insert new images" });
            });
          });
        });
      }

      // Terakhir, update data teks lapaknya
      const updateTextSql =
        "UPDATE listings SET title = ?, description = ?, price = ?, category = ? WHERE id = ?";
      db.query(
        updateTextSql,
        [title, description, price, category, listingId],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "DB error on update text" });
          res.status(200).json({ message: "Listing updated successfully." });
        }
      );
    });
  }
);

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

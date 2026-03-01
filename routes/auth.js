const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

// Verify token middleware
async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send("Unauthorized");

  const token = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid token");
  }
}

// Login route
router.post("/login", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const userRef = db.collection("users").doc(decoded.uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      await userRef.set({
        email: decoded.email,
        name: decoded.name,
        balance: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ success: true });
  } catch {
    res.status(401).send("Invalid token");
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  const userRef = db.collection("users").doc(req.user.uid);
  const docSnap = await userRef.get();

  if (!docSnap.exists) return res.status(404).send("User not found");

  res.json(docSnap.data());
});

module.exports = router;
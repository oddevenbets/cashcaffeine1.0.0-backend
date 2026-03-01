const express = require("express");
const crypto = require("crypto");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

const CPX_APP_ID = process.env.CPX_APP_ID;
const CPX_SECURE_HASH = process.env.CPX_SECURE_HASH;

// Generate secure hash for iframe
router.get("/cpx-hash/:uid", (req, res) => {
  const uid = req.params.uid;

  const hash = crypto
    .createHash("md5")
    .update(`${uid}-${CPX_SECURE_HASH}`)
    .digest("hex");

  res.json({ appId: CPX_APP_ID, hash });
});

// Secure Postback
router.get("/cpx-postback", async (req, res) => {
  const { status, trans_id, user_id, amount_local, hash } = req.query;

  // Validate CPX hash
  const expectedHash = crypto
    .createHash("md5")
    .update(`${trans_id}-${CPX_SECURE_HASH}`)
    .digest("hex");

  if (hash !== expectedHash) {
    return res.status(403).send("Invalid hash");
  }

  // Prevent duplicate transactions
  const transRef = db.collection("transactions").doc(trans_id);
  const transDoc = await transRef.get();

  if (transDoc.exists) {
    return res.send("Duplicate");
  }

  await transRef.set({
    user_id,
    amount: parseFloat(amount_local),
    status,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const userRef = db.collection("users").doc(user_id);
  const userDoc = await userRef.get();

  if (!userDoc.exists) return res.status(404).send("User not found");

  let balance = userDoc.data().balance || 0;

  if (status == 1) balance += parseFloat(amount_local);
  if (status == 2) balance -= parseFloat(amount_local);

  await userRef.update({ balance });

  res.send("OK");
});

module.exports = router;
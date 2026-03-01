const express = require("express");
const crypto = require("crypto");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

const CPX_APP_ID = process.env.CPX_APP_ID;
const CPX_SECURE_HASH = process.env.CPX_SECURE_HASH;

console.log("🔎 CPX ROUTE LOADED");
console.log("CPX_APP_ID:", CPX_APP_ID ? "✅ Loaded" : "❌ Missing");
console.log("CPX_SECURE_HASH:", CPX_SECURE_HASH ? "✅ Loaded" : "❌ Missing");


// ===============================
// 🔥 Generate Secure Hash for Iframe
// ===============================
router.get("/cpx-hash/:uid", (req, res) => {
  const uid = req.params.uid;

  console.log("➡️  /cpx-hash called for UID:", uid);

  if (!CPX_APP_ID || !CPX_SECURE_HASH) {
    console.error("❌ CPX environment variables missing!");
    return res.status(500).json({
      error: "CPX configuration missing",
      appId: CPX_APP_ID || null
    });
  }

  const hash = crypto
    .createHash("md5")
    .update(`${uid}-${CPX_SECURE_HASH}`)
    .digest("hex");

  console.log("✅ Generated hash:", hash);

  res.json({
    appId: CPX_APP_ID,
    hash
  });
});


// ===============================
// 🔥 CPX Secure Postback
// ===============================
router.get("/cpx-postback", async (req, res) => {
  try {
    const { status, trans_id, user_id, amount_local, hash } = req.query;

    console.log("➡️  CPX POSTBACK RECEIVED");
    console.log("Transaction ID:", trans_id);
    console.log("User ID:", user_id);
    console.log("Amount:", amount_local);
    console.log("Status:", status);

    if (!trans_id || !user_id || !amount_local || !hash) {
      console.error("❌ Missing required query parameters");
      return res.status(400).send("Missing parameters");
    }

    if (!CPX_SECURE_HASH) {
      console.error("❌ CPX_SECURE_HASH missing in env");
      return res.status(500).send("Server misconfigured");
    }

    // Validate CPX hash
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}-${CPX_SECURE_HASH}`)
      .digest("hex");

    if (hash !== expectedHash) {
      console.error("❌ Invalid CPX hash");
      return res.status(403).send("Invalid hash");
    }

    console.log("✅ CPX hash validated");

    // Prevent duplicate transactions
    const transRef = db.collection("transactions").doc(trans_id);
    const transDoc = await transRef.get();

    if (transDoc.exists) {
      console.log("⚠️ Duplicate transaction detected");
      return res.send("Duplicate");
    }

    await transRef.set({
      user_id,
      amount: parseFloat(amount_local),
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Transaction saved");

    // Update user balance
    const userRef = db.collection("users").doc(user_id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("❌ User not found in Firestore");
      return res.status(404).send("User not found");
    }

    let balance = userDoc.data().balance || 0;

    if (status == 1) {
      balance += parseFloat(amount_local);
      console.log("💰 Adding to balance:", amount_local);
    }

    if (status == 2) {
      balance -= parseFloat(amount_local);
      console.log("➖ Subtracting from balance:", amount_local);
    }

    await userRef.update({ balance });

    console.log("✅ Balance updated to:", balance);

    res.send("OK");

  } catch (err) {
    console.error("🔥 CPX POSTBACK ERROR:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Firebase Init (Render-safe)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "cash-dcefc",
    clientEmail: "firebase-adminsdk-fbsvc@cash-dcefc.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvSDEwvrJsx+v7\n3Ol8/I9jSxna1ySflKX5fccp7N1bZFSLPtQ87074GG8/kqP84STfVyuZmCPzVqKq\nRc51Pi8YbMugEhc2lIEASrQ7LhXrakPsXQZmXcXt/YZnHBoJ1+oC/W1kzUaeMECN\n4fyDOJ1NP9mx0siQFbZbGdlV77AWKX3u2RcONEjZuQgwNWRF99wElfHoOEPO5bNb\nIFraKvnRg7BxRQYzbuPstr0WDd1lcnqphOjC+Oza7RzeiupwvqnOuPVWLdAJyuin\nIy9yV6XrPbl8TMhqDCdIvctWbqHY/w1O/LKVCI1jJpCIM/JxBu7C9OtMWqodBCmW\ntTZUPUBFAgMBAAECggEAAy5Ri4uVEVmkyV1Tn2u17nIJIL+Rb+lIBHm+iN7o5Xpc\no7+az8BICUM9lu8XqsSAjCJjgtYP+5/cM9rbHvrnP+TkN8jG7bv5hgJ/uCiN8p0V\nvnmxtAnfnay207Le227fqvjjvgCRAi3oqKqBOqBnD7p+PjaPt+MCUYTr53NXbroq\nURWnAT7ue2lUIk7p9h9JGtHU3lZ/Ads91EWgwGS/n0RNw7YoOgArM9tAgAgZTAgj\nb1fsVUIV5GcTdvf+OHBIPSnVP+KdV2WN74QPwbPhHESuaLGyOsvW6G/mzx++IX1h\nelKL4/RwpX7t2c/gePrspwk3zLOccJ27ry0aasIhwQKBgQDoGNNw5TTpBnYsklDr\nRuhu7OAt10bEq5sSk6sR662CES2ISJEkgK4fJLN6WrRRURny0wYS/xZAZ8VmglqY\n6YB633BnkC4f28Mem3cUmcwhTsz7Zj1lnJtT8zZPAVjfm8BmJkGiVMNm7lOePUpy\nw01HQsO3lWCArC8cTgvnM5KUFwKBgQDBVXRo+vLOGecd/aq6fsq2ry+E5AWVcpec\nSrtg5B9UcpOjkFMtblzsGCFRhdb3GcbaB7W4hjwctBg+PivB8AgVFLiJYrpCHVXa\nLIisi/7b03HjYvPHbpLl7eSibO4rlpsAMQxhgaJLWV0hxjw8VlJFgBOa6C4mPCGd\ncmSpRiUcAwKBgEoAoGo+qsAh70wG2wYpdbLolBIJsebDUI57xu/P1WLDV2E8wgqB\nfQMxEIjSouvKkBt8bVNhQhcG/0nQBlL7IJwM4iojLpG54FzB9RX8c7mrBnCiCLF9\nXYlG4uoN4+hoINBxIjxACo2nL8IkiLhOzTULdJv0ZPCh9eNwfxsYtoPBAoGADnU6\niGND5x/OxdJjgyDaPgEp15FJzZxNNDXuf1dv9FvBKLkxTzNypYFEdJlCsyXtVf6/\nmzYGpsrdCUKS+STfJdxv1G5aqXkSI4ezDNxHSd8tJCkRO/fL6n/42iC1SvMvUjtY\nxq3wGhxrt4vgk06NRn9GeA4m7VsP1HtqhbImMksCgYAgcZ6OsNmQRGXAhNPzksjC\nRvDwqoc97SubiE6miQc4N9skJyg3CHbi9jlrMGeOfJGrzMZL8z6sr4sxT7us4nxo\n+PzzJ45FhjQwKsLFF5i9NIk+SDCW1gAun/awqsX70ILlXtCuqP85FbtxKAaT3bh7\nptBK77nX7tD/9INxWlj2xw==\n-----END PRIVATE KEY-----\n"
  }),
});

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/cpx"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

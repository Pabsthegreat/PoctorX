const express = require("express");
const { json } = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { use } = require("react");

const serviceAccount = {
    "type": "service_account",
    "project_id": "exam-proctor-58e4c",
    "private_key_id": "2c2826fc905f03ab538a9ec53c02a70b74dcebc1",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDflUmJFHiiV9iP\nCmyJJGf6uh/dITaJg+EKJmdYfSlw9RIC1PnDirmFAX4sWchT96CstjdKcdnrSnOA\nl1VMI/WwEYUA9QjM60pkMcbnIGAGxaYm+yfHscD2wVOVuIT1wFxtjL62ldukmaAS\nw9TV8Rc+0c2WUjzeP+L2gi1CSgMLhCZ2y0vjx/EHra2m9tjByrk+SYq8QDOgQm8V\nhzhHMPQcQ8gi20AwQ1oeuWl3vgq3QVpkYDrJfWrcyirgrBWEiR3VYSBKx+fnAo45\nT+9k2seV8MQH2dx1bAsvCEUK7WUJbbgNKmo3K7RzqIbHj62stxlURHGeTGbh8EHL\nmOuf9D6PAgMBAAECggEAD5LhhWfko0JFNml+d+sORxux3oBSwS9rfH6CUlqdiV24\nvHPDVgiStZ4OAN7cImUsTvt+THQzvrz34Kwp59zVX0dJIXDwBP4at3H0LeNGbRJV\naX+zHKjYDRgYT2SD9m5IweS84BD+NK/yw3valnBtsxWAIYlm7gA7OfqFVom7PpD7\nlBUidZ0JWdr2tcChMFyJQXtDuKYc5qVzayXjle18Qx9YbjROneOcz1m1KEOEnBH5\ni02lnqfdFutGnoxYsaCRFx0pUSPa7k0pJmcXSeASWCqFoznCPPpTfZDIBhp0DcuJ\nVz0+m3nnYV6LvDEOLqBsSgLB1nAXyW3csdZAPszpKQKBgQD6IExXW+QsckYycFmD\nlmaTdjuA4eWIJb5Werukdqw6PnTUuPeyBoC/TfB5RtJVX8IaLXqTlHDc/4vPbFz0\nIEynxLzF7H9JVKz6ANYZfLOyafEMlCJj1CLeH5xvxMx2II6h0EO2QQmCOyi/zSnV\nVVstdFVxQR5mJX3WgFAUWaaSQwKBgQDk1WshA/bkjfvySOCTFMAxyAaRkZK3xfp5\nlmdhISfnphaIVAhov12fo/LpsAN+LutWICynPw9fVLomMHSiNMdiZjRIhLAjE8JY\nvtPNqkcJC6YdFMDBGUNRSxLqQP+rbs+Ln5+MKT+zoqkZ/VNfyh5Z/UKfnfRltHKG\nOpN6Lkr7xQKBgG7i7rUz2b4Skyg9QpHhlWv+WHbUrqtjADTaiGFq8wOHOMgtkDHu\nTBmDdf5t9UVABI8SZmsSvc5bxCGaysK3pwQhZgbgx7U8wsq6oDAAZrHL4b9P1Mco\n/qQ2o2Wxe2tLF7CI4dvkjVCc5X3SeJ9JDfjiwBZLZiymplj33YiIDh59AoGADmOh\nJeVS7BJFinmsrXL7luXGC/dEa4vmcSjU/VWRZc6a0h2+nZ+S6ovrpWgtAA1BPRwu\n0qFzfQId5nLbkquQ8g4NMZYuYTZH3T66oM8ZQmdaHbAFYt8MzZrT6KkHqqcAI/54\nkN6zI7+RtJGqYXabK/tx6gmLqa2MGgaq6V7p1iUCgYAMltRQOwAyxozHkITYttUM\nNnTF/4lCooLQc5VBLO5F9GWB/LFHrOUZgprTTTYWaMnjXDHaMQeKVbhpMgqNpBcn\nRo++LE+YRIqMrO2HzHNXQJgNc/QEJ+c8HhLlMtet98QoI2T68HPHVN+gS+U0A6JI\npqEB0MrrYNteDDGI0qphrA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@exam-proctor-58e4c.iam.gserviceaccount.com",
    "client_id": "102471608456980884848",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40exam-proctor-58e4c.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

const server = http.createServer(app); // Use http server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;  
const SOCKET_PORT = 3001;


// ✅ Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your frontend URL
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(json());

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const upload = multer({ dest: uploadDir });

// Path to store processed test data
const processedTestsPath = "processed_tests.json";

// Update risk score in json
const riskScoresPath = path.join(__dirname, "score.json");

if (!fs.existsSync(riskScoresPath)) {
  fs.writeFileSync(riskScoresPath, JSON.stringify({ score: 0 }, null, 2));
}

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Function to parse questions from extracted text
function parseQuestions(text) {
  console.log("\n📄 Extracted PDF Content:\n", text); // ✅ PRINT extracted text in console

  const questionBlocks = text.split(/Q\d+:/).slice(1);
  const questions = [];

  questionBlocks.forEach((block) => {
    const lines = block
      .trim()
      .split("\n")
      .map((line) => line.trim());

    let questionText = lines[0];
    let type = lines
      .find((line) => line.startsWith("Type:"))
      ?.split("Type:")[1]
      ?.trim();
    let options = [];
    let answer = null;

    if (type === "MCQ") {
      let optionsStartIndex =
        lines.findIndex((line) => line.startsWith("Options:")) + 1;
      let answerIndex = lines.findIndex((line) => line.startsWith("Answer:"));

      if (optionsStartIndex > 0 && answerIndex > 0) {
        for (let i = optionsStartIndex; i < answerIndex; i++) {
          options.push(lines[i].trim());
        }
      }

      answer =
        answerIndex > 0
          ? lines[answerIndex]?.split("Answer:")[1]?.trim()
          : null;
    } else if (type === "Subjective") {
      answer = lines
        .find((line) => line.startsWith("Answer:"))
        ?.split("Answer:")[1]
        ?.trim();
    }

    questions.push({ questionText, type, options, answer });
  });

  return questions;
}

// Function to shuffle questions
function shuffleQuestions(questions) {
  let shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function saveProcessedData(filename, questions) {
    try {
        console.log("testid",filename);
        const processedTestsRef = db.collection("tests").doc(filename).collection("processed_test");

        // Get all documents
        const snapshot = await processedTestsRef.get();

        if (!snapshot.empty) {
            console.log("✅ Collection 'processed_test' is not empty. Deleting old data...");

            // Delete all documents in batch
            const batch = db.batch();
            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            console.log("🗑️ Successfully deleted the 'processed_test' collection!");
        }

        // Now, add new data
        for (let i = 0; i < questions.length; i++) {
            await processedTestsRef.add({
                questionText: questions[i].questionText,
                type: questions[i].type,
                options: questions[i].options || [],
                answer: questions[i].answer || null
            });
        }

        console.log(`✅ Processed questions saved in Firestore inside "processed_test"`);
    } catch (error) {
        console.error("❌ Error saving to Firestore:", error);
    }
  }

  // Append new data
  // existingData.push({ filename, questions });

  // // Write back to the file
  // try {
  //   fs.writeFileSync(processedTestsPath, JSON.stringify(existingData, null, 2));
  //   console.log("✅ Processed Questions Saved in JSON!");
  // } catch (error) {
  //   console.error("❌ Error writing JSON file:", error);
  // }





// API Endpoint to upload, process, and store PDF data
app.post("/upload", upload.single("pdf"), async (req, res) => {
    const testid2 = req.query.testid2;
    console.log("testid here",testid2);
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

  console.log("✅ File received:", req.file.originalname);

  try {
    const pdfPath = path.resolve(req.file.path);
    const text = await extractTextFromPDF(pdfPath);
    let questions = parseQuestions(text);
    questions = shuffleQuestions(questions);

        // ✅ Save processed questions to JSON file
        saveProcessedData(testid2, questions);

    // Delete uploaded file after processing
    fs.unlinkSync(pdfPath);

    res.json({ questions });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to fetch processed questions
app.get("/api/questions", (req, res) => {
  const filePath = path.join(__dirname, "processed_tests.json");

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: "Processed questions not found" });
  }
});



app.get("/api/ready-test", async (req, res) => {
    try {
        const testid3 = req.query.testid2;
        console.log("testid here",testid3);
        // Reference to Firestore subcollection: tests/test1/processed_test
        const processedTestsRef = db.collection("tests").doc(testid3).collection("processed_test");

        // Fetch all documents in the subcollection
        const snapshot = await processedTestsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "No ready test found in Firestore" });
        }

        let questions = [];
        snapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        res.json(questions);
    } catch (error) {
        console.error("❌ Error fetching ready test from Firestore:", error);
        res.status(500).json({ error: "Error fetching ready test data" });
    }
});


const studentAnswersPath = path.join(__dirname, "student_answered.json");

app.post("/api/submit-test", async (req, res) => {
    const {answer } = req.body;
    //const user = localStorage.getItem("user");
    if (!answer || answer.length === 0) {
        return res.status(400).json({ error: "No test data received" });
    }

    console.log("✅ Received submitted test:", answer);
    userEmail=answer[1].mail;
    userTestid=answer[0].testid;
    answer.shift();
    answer.shift();

    try {
        console.log(userTestid,userEmail);
        const processedTestsRef = db.collection("tests").doc(userTestid).collection(userEmail);
        //alert("Test submitted successfully!",user.mail);

        // Delete old answers before inserting new ones
        const snapshot = await processedTestsRef.get();
        if (!snapshot.empty) {
            console.log("🗑️ Clearing previous submissions...");
            const batch = db.batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
        }

        // Save new answers
        const batch = db.batch();
        answer.forEach((q) => {
            const docRef = processedTestsRef.doc();
            batch.set(docRef, {
                questionText: q.questionText,
                type: q.type,
                options: q.options || [],
                student_answer: q.student_answer || null, // Ensure correct field
            });
        });

        await batch.commit();
        console.log("✅ Test answers saved in Firestore under 'answered_tests'");
        console.log("user mail",user.mail);

        res.json({ message: "Test submitted successfully!" }); // Send response
    } catch (error) {
        console.error("❌ Error saving submitted test:", error);
        res.status(500).json({ error: "Failed to submit test" });
    }
});


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// Endpoint to update risk score
app.post("/api/update-risk", (req, res) => {
  const { riskScore } = req.body;
  fs.writeFileSync(
    riskScoresPath,
    JSON.stringify({ score: riskScore }, null, 2)
  );
  res.json({ message: "Risk score updated successfully" });
});

// Endpoint to fetch risk score (optional)
app.get("/api/get-risk-score", (req, res) => {
  if (fs.existsSync(riskScoresPath)) {
    try {
      const rawData = fs.readFileSync(riskScoresPath, "utf-8");
      const riskScoreData = JSON.parse(rawData);
      return res.status(200).json(riskScoreData);
    } catch (error) {
      console.error("❌ Error reading risk score JSON:", error);
      return res.status(500).json({ message: "Error retrieving risk score" });
    }
  } else {
    return res.status(404).json({ message: "No risk score data found" });
  }
});

// VPN and Proxy check
const requestIp = require("request-ip");
const axios = require("axios");

// API Endpoint to detect VPN or Proxy
app.get("/api/check-vpn-proxy", async (req, res) => {
  const clientIp = requestIp.getClientIp(req); // Get user's IP

  if (!clientIp) {
    return res.status(500).json({ error: "Unable to retrieve IP address" });
  }

  try {
    const response = await axios.get(
      `https://proxycheck.io/v2/${clientIp}?vpn=1`
    );
    const data = response.data[clientIp];

    if (data.proxy === "yes" || data.vpn === "yes") {
      return res.json({ vpnDetected: true, proxyDetected: true });
    }

    res.json({ vpnDetected: false, proxyDetected: false });
  } catch (error) {
    console.error("❌ Error detecting VPN/Proxy:", error);
    res.status(500).json({ error: "Error checking VPN/Proxy" });
  }
});

app.get("/api/get-risk-score", (req, res) => {
  const data = fs.readFileSync(riskScoresPath, "utf8");
  res.json(JSON.parse(data));
});


// Socket.io setup

let chatMessages = [];

// Socket.io connection for chat
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // When a user sends a message
    socket.on("sendMessage", (messageData) => {
        chatMessages.push(messageData); // Store the message
        console.log("Message received:", messageData);
        io.emit("receiveMessage", messageData); // Broadcast to all clients
    });

    // Send chat history to newly connected users
    socket.emit("chatHistory", chatMessages);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(SOCKET_PORT, '127.0.0.1',() => {
  console.log(`Server running on port ${SOCKET_PORT}`);
});

app.listen(PORT, '127.0.0.1',() => console.log(`✅ Server running on port ${PORT}`));

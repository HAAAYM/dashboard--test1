// Script to add engineering specializations to Firestore using Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": "edu-mate12",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "firebase-adminsdk-xxxxx@edu-mate12.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
};

// Try to initialize with environment variables first
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Firebase Admin already initialized or error:', error.message);
}

const db = admin.firestore();

// Engineering specializations to add
const engineeringSpecializations = [
  {
    id: "cyber-security",
    name: "Cyber Security",
    nameAr: "Cyber Security",
    collegeId: "eng",
    durationYears: 4,
    firstBatchStartYear: 2022,
    isActive: true
  },
  {
    id: "information-technology",
    name: "Information Technology",
    nameAr: "Information Technology",
    collegeId: "eng",
    durationYears: 4,
    firstBatchStartYear: 2022,
    isActive: true
  },
  {
    id: "electrical-engineering",
    name: "Electrical Engineering",
    nameAr: "Electrical Engineering",
    collegeId: "eng",
    durationYears: 4,
    firstBatchStartYear: 2022,
    isActive: true
  },
  {
    id: "civil-engineering",
    name: "Civil Engineering",
    nameAr: "Civil Engineering",
    collegeId: "eng",
    durationYears: 4,
    firstBatchStartYear: 2022,
    isActive: true
  }
];

// Add specializations to Firestore
async function addSpecializations() {
  console.log('Adding engineering specializations to Firestore...');
  
  try {
    for (const spec of engineeringSpecializations) {
      const docRef = doc(db, 'specializations', spec.id);
      await setDoc(docRef, spec);
      console.log(`Added specialization: ${spec.name} (${spec.id})`);
    }
    
    console.log('All specializations added successfully!');
  } catch (error) {
    console.error('Error adding specializations:', error);
  }
}

// Run the script
addSpecializations();

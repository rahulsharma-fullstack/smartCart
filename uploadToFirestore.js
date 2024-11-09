
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Initialize Firebase
const serviceAccount = JSON.parse(
  await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read JSON file and parse it
const jsonData = JSON.parse(
  await readFile(new URL('./src/data/dummyData.json', import.meta.url))
);

// Upload data to Firestore
const collectionRef = db.collection('products');
for (const [key, item] of Object.entries(jsonData)) {
  await collectionRef.doc(key).set(item);
  console.log(`Uploaded item with ID: ${key}`);
}

console.log('All data uploaded successfully!');

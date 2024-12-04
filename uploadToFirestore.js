import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Initialize Firebase
const serviceAccount = JSON.parse(
  await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Read JSON file and parse it
const jsonData = JSON.parse(
  await readFile(new URL('./src/data/test.json', import.meta.url))
);

// Upload data to Firestore
const collectionRef = db.collection('products');
for (const item of jsonData) {
  const { id, ...data } = item; // Extract the `id` field and the rest of the data
  await collectionRef.doc(id).set(data); // Use `id` as the document ID
  console.log(`Uploaded product with ID: ${id}`);
}

console.log('All data uploaded successfully!');

import { db, storage } from './firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  userId: string;
  createdAt: Date;
  starred?: boolean;
  shared?: boolean;
}

export async function uploadDocument(file: File, userId: string): Promise<Document> {
  try {
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.name}`;
    const storageRef = ref(storage, `documents/${userId}/${fileName}`);
    
    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    // Create document metadata
    const docData = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      url,
      userId,
      createdAt: new Date(),
      starred: false,
      shared: false,
    };

    // Add to Firestore
    await addDoc(collection(db, 'documents'), docData);
    return docData;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
    })) as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function deleteDocument(docId: string, userId: string): Promise<void> {
  try {
    // Delete from Firestore
    const docRef = doc(db, 'documents', docId);
    await deleteDoc(docRef);
    
    // Delete from Storage
    const storageRef = ref(storage, `documents/${userId}/${docId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

export async function toggleStar(docId: string, starred: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, { starred });
  } catch (error) {
    console.error('Error updating star status:', error);
    throw new Error('Failed to update star status');
  }
}

export async function toggleShare(docId: string, shared: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, { shared });
  } catch (error) {
    console.error('Error updating share status:', error);
    throw new Error('Failed to update share status');
  }
}
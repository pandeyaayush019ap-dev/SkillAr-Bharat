import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  updateDoc, 
  arrayUnion,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Skill, TrainingSession } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  const querySnapshot = await getDocs(collection(db, 'skills'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
};

export const getSkillById = async (id: string): Promise<Skill | null> => {
  const docRef = doc(db, 'skills', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Skill;
  } else {
    return null;
  }
};

export const addSkill = async (skillData: Omit<Skill, 'id'>, imageFile?: File): Promise<string> => {
  let imageUrl = skillData.imageUrl;

  if (imageFile) {
    const storageRef = ref(storage, `skills/${uuidv4()}-${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, 'skills'), {
    ...skillData,
    imageUrl,
    createdAt: Date.now()
  });

  return docRef.id;
};

// User Progress
export const enrollInSkill = async (userId: string, skillId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    enrolledSkills: arrayUnion(skillId)
  });
};

export const saveTrainingSession = async (session: Omit<TrainingSession, 'id'>) => {
  await addDoc(collection(db, 'training_sessions'), {
    ...session,
    timestamp: Date.now()
  });
};

export const getUserSessions = async (userId: string): Promise<TrainingSession[]> => {
  const q = query(
    collection(db, 'training_sessions'), 
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingSession));
};

export const getRecentUserSessions = async (userId: string, limitCount = 5): Promise<TrainingSession[]> => {
  const q = query(
    collection(db, 'training_sessions'), 
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingSession));
};

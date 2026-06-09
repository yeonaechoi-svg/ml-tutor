import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function loadUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserData(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function saveJourneyEntry(uid, entry) {
  const id = `step${entry.stepId}_mission${entry.missionId}`;
  await setDoc(doc(db, 'users', uid, 'journeyEntries', id), entry);
}

export async function loadJourneyEntries(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'journeyEntries'));
  return snap.docs
    .map((d) => d.data())
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
}

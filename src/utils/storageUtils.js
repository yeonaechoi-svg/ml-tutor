import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseEnabled } from '../firebase';

export async function uploadImage(uid, stepId, missionId, index, blob) {
  if (!isFirebaseEnabled || !storage) {
    throw new Error('Firebase Storage가 설정되지 않았습니다.');
  }
  const path = `users/${uid}/step${stepId}_m${missionId}_img${index}_${Date.now()}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

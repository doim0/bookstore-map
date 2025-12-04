import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import type { User } from "../types";

// 회원가입
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || undefined,
    };
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

// 로그인
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || undefined,
    };
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

// 로그아웃
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
};

// 인증 상태 변화 감지
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
      });
    } else {
      callback(null);
    }
  });
};

// 현재 사용자 가져오기
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || undefined,
    };
  }
  return null;
};

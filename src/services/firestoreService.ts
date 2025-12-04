import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Bookstore } from "../types";

const COLLECTION_NAME = "userBookstores";

// CREATE: 새 서점 추가
export const createBookstore = async (
  bookstore: Omit<Bookstore, "id" | "createdAt">,
  userId: string
): Promise<string> => {
  try {
    // undefined나 빈 문자열인 필드 제거
    const cleanedData: any = {
      name: bookstore.name,
      address: bookstore.address,
      latitude: bookstore.latitude,
      longitude: bookstore.longitude,
      category: bookstore.category || "기타",
      createdBy: userId,
      createdAt: Timestamp.now(),
      isUserAdded: true,
    };

    // 선택적 필드들은 값이 있을 때만 추가
    if (bookstore.phone) cleanedData.phone = bookstore.phone;
    if (bookstore.openTime) cleanedData.openTime = bookstore.openTime;
    if (bookstore.closeTime) cleanedData.closeTime = bookstore.closeTime;
    if (bookstore.closedDays) cleanedData.closedDays = bookstore.closedDays;
    if (bookstore.description) cleanedData.description = bookstore.description;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedData);
    return docRef.id;
  } catch (error) {
    console.error("서점 추가 실패:", error);
    throw error;
  }
};

// READ: 모든 사용자 추가 서점 가져오기
export const getUserBookstores = async (): Promise<Bookstore[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        category: data.category,
        phone: data.phone,
        openTime: data.openTime,
        closeTime: data.closeTime,
        closedDays: data.closedDays,
        description: data.description,
        isUserAdded: data.isUserAdded,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate(),
      } as Bookstore;
    });
  } catch (error) {
    console.error("서점 목록 가져오기 실패:", error);
    throw error;
  }
};

// READ: 특정 사용자가 추가한 서점만 가져오기
export const getMyBookstores = async (userId: string): Promise<Bookstore[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("createdBy", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const bookstores = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        category: data.category,
        phone: data.phone,
        openTime: data.openTime,
        closeTime: data.closeTime,
        closedDays: data.closedDays,
        description: data.description,
        isUserAdded: data.isUserAdded,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate(),
      } as Bookstore;
    });

    // 클라이언트에서 createdAt 기준으로 정렬
    return bookstores.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } catch (error) {
    console.error("내 서점 목록 가져오기 실패:", error);
    throw error;
  }
};

// UPDATE: 서점 정보 수정
export const updateBookstore = async (
  bookstoreId: string,
  updates: Partial<Bookstore>
): Promise<void> => {
  try {
    // undefined 값 제거
    const cleanedUpdates: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        cleanedUpdates[key] = value;
      }
    });

    const docRef = doc(db, COLLECTION_NAME, bookstoreId);
    await updateDoc(docRef, cleanedUpdates);
  } catch (error) {
    console.error("서점 수정 실패:", error);
    throw error;
  }
};

// DELETE: 서점 삭제
export const deleteBookstore = async (bookstoreId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, bookstoreId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("서점 삭제 실패:", error);
    throw error;
  }
};

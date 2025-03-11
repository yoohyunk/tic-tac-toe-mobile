// firebase/firestore.ts
import firestore from "@react-native-firebase/firestore";

// Example function to add a document to a collection
export const addDocument = async (collection: string, data: any) => {
  try {
    await firestore().collection(collection).add(data);
  } catch (error) {
    throw error;
  }
};

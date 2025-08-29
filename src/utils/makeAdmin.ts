import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to make a user admin by email
export const makeUserAdmin = async (email: string) => {
  try {
    // First, find the user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'admin',
        isAdmin: true
      });
      console.log(`✅ User ${email} is now an admin!`);
      return true;
    } else {
      console.log(`❌ User ${email} not found`);
      return false;
    }
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};

// Add this import at the top
import { collection, query, where, getDocs } from 'firebase/firestore';
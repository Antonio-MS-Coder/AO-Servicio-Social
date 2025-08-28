import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations
export const FirestoreService = {
  // Create a new document
  async create(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Read a single document
  async getById(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Read all documents from a collection
  async getAll(collectionName: string, constraints: QueryConstraint[] = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Update a document
  async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};

// Jobs specific operations
export const JobsService = {
  async createJob(jobData: any) {
    return FirestoreService.create('jobs', jobData);
  },

  async getActiveJobs() {
    return FirestoreService.getAll('jobs', [
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(50)
    ]);
  },

  async getJobsByEmployer(employerId: string) {
    return FirestoreService.getAll('jobs', [
      where('employerId', '==', employerId),
      orderBy('createdAt', 'desc')
    ]);
  },

  async getJobsByTrade(trade: string) {
    return FirestoreService.getAll('jobs', [
      where('trade', '==', trade),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    ]);
  }
};

// Workers specific operations
export const WorkersService = {
  async getWorkerProfile(userId: string) {
    return FirestoreService.getById('workers', userId);
  },

  async updateWorkerProfile(userId: string, data: any) {
    return FirestoreService.update('workers', userId, data);
  },

  async getAvailableWorkers() {
    return FirestoreService.getAll('workers', [
      where('available', '==', true),
      orderBy('rating', 'desc'),
      limit(50)
    ]);
  },

  async getWorkersByTrade(trade: string) {
    return FirestoreService.getAll('workers', [
      where('trade', '==', trade),
      where('available', '==', true),
      orderBy('rating', 'desc')
    ]);
  }
};

// Employers specific operations
export const EmployersService = {
  async getEmployerProfile(userId: string) {
    return FirestoreService.getById('employers', userId);
  },

  async updateEmployerProfile(userId: string, data: any) {
    return FirestoreService.update('employers', userId, data);
  }
};

// Applications/Connections operations
export const ApplicationsService = {
  async applyToJob(jobId: string, workerId: string, message: string) {
    return FirestoreService.create('applications', {
      jobId,
      workerId,
      message,
      status: 'pending'
    });
  },

  async getApplicationsByJob(jobId: string) {
    return FirestoreService.getAll('applications', [
      where('jobId', '==', jobId),
      orderBy('createdAt', 'desc')
    ]);
  },

  async getApplicationsByWorker(workerId: string) {
    return FirestoreService.getAll('applications', [
      where('workerId', '==', workerId),
      orderBy('createdAt', 'desc')
    ]);
  },

  async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected' | 'pending') {
    return FirestoreService.update('applications', applicationId, { status });
  }
};

// Reviews and Ratings operations
export const ReviewsService = {
  async createReview(reviewData: {
    fromUserId: string;
    toUserId: string;
    jobId: string;
    rating: number;
    comment: string;
  }) {
    return FirestoreService.create('reviews', reviewData);
  },

  async getReviewsForUser(userId: string) {
    return FirestoreService.getAll('reviews', [
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  },

  async getReviewsByUser(userId: string) {
    return FirestoreService.getAll('reviews', [
      where('fromUserId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }
};

// Stats operations for the dashboard
export const StatsService = {
  async getDashboardStats() {
    try {
      // Get counts from various collections
      const [jobs, workers, applications] = await Promise.all([
        getDocs(query(collection(db, 'jobs'), where('status', '==', 'active'))),
        getDocs(query(collection(db, 'workers'), where('available', '==', true))),
        getDocs(query(collection(db, 'applications'), where('status', '==', 'accepted')))
      ]);

      return {
        activeJobs: jobs.size,
        availableWorkers: workers.size,
        successfulConnections: applications.size,
        averageRating: 4.7 // This would be calculated from actual reviews
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
};
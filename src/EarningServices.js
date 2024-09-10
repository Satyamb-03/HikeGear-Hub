// src/EarningsService.js
import { db } from './firebase'; // Adjust the path to your Firebase configuration

const EarningsService = {
  async getTotalEarningsBySupplier(supplierId) {
    // Replace this with your actual Firestore query to get total earnings
    const earningsRef = db.collection('earnings').where('supplierId', '==', supplierId);
    const snapshot = await earningsRef.get();
    let totalEarnings = 0;

    snapshot.forEach(doc => {
      totalEarnings += doc.data().amount; // Adjust field name if necessary
    });

    return totalEarnings;
  },

  async getEarningsByCheckout(supplierId) {
    // Replace this with your actual Firestore query to get earnings by checkout
    const earningsRef = db.collection('earnings').where('supplierId', '==', supplierId);
    const snapshot = await earningsRef.get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      totalEarnings: doc.data().amount // Adjust field name if necessary
    }));
  }
};

export default EarningsService;

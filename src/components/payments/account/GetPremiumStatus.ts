import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	collection,
	getFirestore,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";

export const getPremiumStatus = async (app: FirebaseApp) => {
	const auth = getAuth(app);
	const userId = auth.currentUser?.uid;
	if (!userId) throw new Error("User not logged in. Unable to retrieve premium status.");

	const db = getFirestore(app);
	const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
	const q = query(
		subscriptionsRef,
		where("status", "in", ["trialing", "active"])
	);

	return new Promise<boolean>((resolve, reject) => {
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				try {
					if (snapshot.size === 1) {
						// Process the single subscription document
						console.log("Active or trialing subscription found");
						resolve(true);
					} else if (snapshot.size === 0) {
						console.log("No active or trialing subscriptions found");
						resolve(false);
					} else {
						console.warn("Unexpected number of subscriptions found:", snapshot.size);
						// Handle unexpected case with more than one subscription
						resolve(true); // or reject with an appropriate error
					}
				} catch (error) {
					console.error("Error processing snapshot data:", error);
					reject(error);
				} finally {
					console.log("Unsubscribing from onSnapshot listener");
					unsubscribe();
				}
			},
			(error) => {
				console.error("Error in onSnapshot:", error);
				reject(error);
			}
		);
	});
};

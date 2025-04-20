import { useState } from 'react';
import { useApi } from './useApi';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface UseCustomerEmailUpdateProps {
    customerId: string;
    stripeAccountId: string;
    userId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useCustomerEmailUpdate = ({
    customerId,
    stripeAccountId,
    userId,
    onSuccess,
    onError,
}: UseCustomerEmailUpdateProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const { fetchData, isLoading, error } = useApi({
        endpoint: `/stripe/customers/${customerId}`,
        baseUrl: '/api'
    });

    const updateEmail = async (newEmail: string) => {
        try {
            setIsUpdating(true);

            // Update in Stripe
            await fetchData({
                method: 'PATCH',
                body: {
                    email: newEmail,
                    stripeAccountId,
                },
            });

            // Update in Firebase
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const customers = Array.isArray(userData.customers) ? userData.customers : [];

                // Find and update the specific customer
                const updatedCustomers = customers.map((customer: any) => {
                    if (customer.stripeCustomerId === customerId) {
                        return {
                            ...customer,
                            email: newEmail,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return customer;
                });

                await updateDoc(userRef, {
                    customers: updatedCustomers
                });
            }

            onSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update email';
            onError?.(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateEmail,
        isUpdating,
        error,
    };
}; 
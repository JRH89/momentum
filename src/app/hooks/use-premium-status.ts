'use client'

import { useState, useEffect } from 'react'
import { getPremiumStatus } from '../../components/payments/account/GetPremiumStatus'
import type { FirebaseApp } from 'firebase/app'
import type { User } from 'firebase/auth'

export function usePremiumStatus(app: FirebaseApp, user: User | null) {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetchPremiumStatus = async () => {
      try {
        const newPremiumStatus = user ? await getPremiumStatus(app) : false
        setIsPremium(newPremiumStatus)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching premium status:", error)
      }
    }

    fetchPremiumStatus()
  }, [app, user])

  return {isPremium, loading}
}


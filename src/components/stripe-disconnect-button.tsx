'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

import { disconnectStripeAccount } from '../actions/stripe'


interface StripeDisconnectButtonProps {
    stripeAccountId: string
    userId: string
}

export default function StripeDisconnectButton({ stripeAccountId, userId }: StripeDisconnectButtonProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false)


  const handleDisconnectStripe = async () => {
    if (!stripeAccountId) {
      toast.error('Stripe account not found')
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to disconnect your Stripe account?"
    )

    if (!confirmed) return

    setIsDisconnecting(true)
    try {
      const result = await disconnectStripeAccount(stripeAccountId, userId)

      if (result.success) {
       toast.success('Stripe account disconnected successfully!')
      } else {
        toast.error(result.error || 'There was an error disconnecting your Stripe account')
      }
    } catch (error) {
      console.error('Error disconnecting Stripe account:', error)
      toast.error('There was an error disconnecting your Stripe account')
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <button
   
      onClick={handleDisconnectStripe}
      disabled={isDisconnecting}
    >
      {isDisconnecting ? 'Disconnecting...' : 'Disconnect Stripe'}
    </button>
  )
}




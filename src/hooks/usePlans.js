import { useContext } from 'react'
import PlansContext from '../context/PlansContext.js'

export default function usePlans() {
  const value = useContext(PlansContext)
  if (value === null) {
    throw new Error('usePlans потрібно викликати всередині PlansProvider')
  }
  return value
}

'use client'
import { authClient } from "@/lib/auth-client"

const SignOut = () => {
  return (
    <div>
      <button onClick={() =>authClient.signOut()}>SignOut</button>
    </div>
  )
}

export default SignOut

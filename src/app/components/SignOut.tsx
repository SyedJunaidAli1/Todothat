'use client'
import { authClient } from "@/lib/auth-client"
import { signOut } from "@/lib/methods/users"

const SignOut = () => {
  return (
    <div>
      <button onClick={() =>authClient.signOut()}>SignOut</button>
      <button onClick={signOut}>SignOut</button>
    </div>
  )
}

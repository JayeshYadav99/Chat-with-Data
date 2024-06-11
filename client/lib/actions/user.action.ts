
"use server"

import { revalidatePath } from 'next/cache'
import { CreateUserParams
    ,UpdateUserParams
    ,DeleteUserParams
    ,GetUserByIdParams
 } from './../db/models/shared.types';
import { connectToDatabase}  from '@/lib/db'
import User from '@/lib/db/models/user.model'

import { handleError } from '@/lib/utils'





export const createUser = async (params:CreateUserParams) => {
    try {
        await connectToDatabase()
        const { clerkId,
            email,
            username,
            picture}=params
        const newUser = await User.create({ clerkId,
            email,
            username,
            picture})
        return JSON.parse(JSON.stringify(newUser))
        
    } catch (error) {
        handleError(error)
    }

}
export async function getUserById(userId:any) {
    try {
      await connectToDatabase()
  
      const user = await User.findById(userId)
  
      if (!user) throw new Error('User not found')
      return JSON.parse(JSON.stringify(user))
    } catch (error) {
      handleError(error)
    }
}
export async function updateUser(params:UpdateUserParams) {
    try {
      await connectToDatabase()
  const{clerkId,Updateduser} = params
      const updatedUser = await User.findOneAndUpdate({ clerkId }, Updateduser, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }

  export async function deleteUser(params:DeleteUserParams) {
    try {
      await connectToDatabase()
  const {clerkId} = params
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId })
  
      if (!userToDelete) {
        throw new Error('User not found')
      }
  
      // Unlink relationships
     
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id)
      revalidatePath('/')
  
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
      handleError(error)
    }
}
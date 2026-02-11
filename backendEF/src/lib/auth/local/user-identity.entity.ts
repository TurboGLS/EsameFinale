import { User } from "../../../api/user/user.entity"

export type UserIdentity = {
    id: string,
    provider: string,
    credentials: {
        username: string,
        hashedPassword: string
    },
    user: string | User,
    refreshToken?: string[]
}
import { db } from "@/lib/db";
import { getSelf } from "./auth-service";

export const isFollowingUser = async (id: string) => {
    try {
        const self = await getSelf();

        const otherUser = await db.user.findUnique({
            where: { id }
        })

        if (!otherUser) {
            throw new Error("User Not Found");
        }

        if (otherUser.id === self.id) {
            return true;
        }

        const existingFollow = await db.follow.findFirst({
            where: {
                followerId: self.id,
                followingId: otherUser.id,
            }
        })

        return !!existingFollow;
    } catch {
        return false;
    }
}

export const followUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: {id}
    })

    if (!otherUser) {
        throw new Error("User Not Found");
    }

    if (otherUser.id === self.id) {
        throw new Error("Cannot Follow Yourself")
    }

    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        }
    })

    if (existingFollow) {
        throw new Error("Already Following")
    }

    const follow = await db.follow.create({
        data: {
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            following: true,
            follower: true,
        },
    });

    return follow;
}

export const unfollowUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where:{
            id,
        },
    })

    if (!otherUser) {
        throw new Error("User Not Found");
    }

    if (otherUser.id === self.id) {
        throw new Error("Cannot Unfollow Yourself")
    }

    const exisitingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        }
    })

    if (!exisitingFollow) {
        throw new Error("Not Following")
    }

    const follow = await db.follow.delete({
        where: {
            id: exisitingFollow.id,
        },
        include: {
            following: true,
        }
    })

    return follow;
}




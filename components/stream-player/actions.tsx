"use client"

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";


interface ActionsProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
}

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost
} : ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId } = useAuth();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) => toast.success(`You Are Now Following ${data.following.username}`))
                .catch(() => toast.error("Something Went Wrong"))
        })
    }

    const handleunfollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) => toast.success(`You Have Unfollowed ${data.following.username}`))
                .catch(() => toast.error("Something Went Wrong"))
        })
    }

    const toggleFollow = () => {
        if (!userId) {
            return router.push("/sign-in")
        }
        
        if (isHost) return;

        if (isFollowing) {
            handleunfollow();
        } else {
            handleFollow(); 
        }

    }

    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
        >
            <Heart className={cn(
                "h-4 w-4 mr-2",
                isFollowing
                    ? "fill-white"
                    : "fill-none"
            )}/>
            {isFollowing
                ? "Unfollow"
                : "Follow"            
            }
        </Button>
    )
}

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24"/>
    )
}
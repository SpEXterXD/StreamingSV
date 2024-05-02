"use client";

import { useTransition } from "react";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
}

export const Actions = ({
    isFollowing,
    userId,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => { 
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`You Are Now Following ${data.following.username}`))
                .catch((data) => toast.error("Something Went Wrong"))
        }) 
    };

    const handleUnfollow = () => { 
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`You Unfollowed ${data.following.username}`))
                .catch((data) => toast.error("Something Went Wrong"))
        }) 
    };

    const onClick = () => {
        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }


    return (
        <Button 
            disabled={isPending}
            onClick={onClick} 
            variant="primary"
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    )
}
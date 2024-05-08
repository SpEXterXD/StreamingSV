"use client"

import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { toast } from "sonner";

type FieldType ="isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly"

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldType;
}

export const ToggleCard = ({
    label,
    value = false,
    field,
}: ToggleCardProps) => {
    const [isPending, startTransition] = useTransition();

    const onChange = async () => {
        startTransition(() => {
            updateStream({ [field]: !value})
                .then(() => toast.success("Chat Settings Updated!"))
                .catch(() => toast.error("Something Went Wrong"))
        })
    }
    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="space-y-2">
                    <Switch
                        disabled={isPending}
                        onCheckedChange={onChange}
                        checked={value}
                    >
                        {value ? "On" : "Off"}
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export const ToggleCardSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    )
}
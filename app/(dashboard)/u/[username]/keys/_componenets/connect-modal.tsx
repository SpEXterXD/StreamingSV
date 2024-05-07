"use client"

import { Button } from "@/components/ui/button"

import { IngressInput } from "livekit-server-sdk"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { AlertTriangle } from "lucide-react"
import { ElementRef, useRef, useState, useTransition } from "react"
import { createIngress } from "@/actions/ingress"
import { toast } from "sonner"

const RTMP = JSON.parse(JSON.stringify(IngressInput.RTMP_INPUT))
const WHIP = JSON.parse(JSON.stringify(IngressInput.WHIP_INPUT))

type IngressType = typeof RTMP | typeof WHIP;


export const ConnectModal = () => {
    const closeRef = useRef<ElementRef<"button">>(null)
    const [isPending, startTransition] = useTransition();
    const [ingressType, setIngressType] = useState<IngressType>(RTMP);
    

    const onSubmit = () => {
        startTransition(() => {
            createIngress((ingressType))
                .then(() => {
                    console.log(ingressType);
                    toast.success("Ingress Created")
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something Went Wrong"));
        })
    }

    return( 
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">
                    Generate Connection
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Connection</DialogTitle>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={(value) => setIngressType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning !</AlertTitle>
                    <AlertDescription>
                        This Action Will Reset All Active Streams Using The Current Connection
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isPending}
                        onClick={() => onSubmit()}
                        variant="primary"
                    >
                        Generate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
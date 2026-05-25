"use client";

import { TrashBin } from "@gravity-ui/icons";
import { AlertDialog, Button } from "@heroui/react";
import { redirect } from "next/navigation";

export function DeleteTutor({ tutor }) {

    const { _id, } = tutor;
    console.log(_id)

    const handleDelete = async () => {
        if (!_id) {
            console.error("No _id provided");
            return;
        }

        const res = await fetch(`http://localhost:7000/tutors/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Delete failed:", res.status);
            return;
        }

        const data = await res.json();
        redirect("/tutors")
        console.log(data);
    }

    return (
        <AlertDialog>
            <AlertDialog.Trigger className="flex items-center gap-2 px-5 py-1 bg-red-50 hover:bg-red-100 
               text-red-600 hover:text-red-700 rounded-2xl border border-red-200 
               transition-all duration-300 hover:scale-105 active:scale-95 
               shadow-sm hover:shadow-md font-medium">
                Delet

            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
                <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-[400px]">
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                            <AlertDialog.Icon status="danger">
                                <TrashBin className="size-5" />
                            </AlertDialog.Icon>
                            <AlertDialog.Heading>Delete this item?</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            <p>
                                Use <code>AlertDialog.Trigger</code> to create custom trigger elements beyond
                                standard buttons. This example shows a card-style trigger with icons and descriptive
                                text.
                            </p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button slot="close" variant="tertiary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} slot="close" variant="danger">
                                Delete Item
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    );
}
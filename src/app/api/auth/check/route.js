import firebase from "@/app/firebase";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            return NextResponse.json({ success: true, user: currentUser, message: 'User is logged in.' });
        } else {
            return NextResponse.json({ success: false, message: 'No user is logged in.' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
import firebase from "@/app/firebase";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const result = await firebase.auth().signInWithEmailAndPassword(email, password);
        return NextResponse.json({ success: true, user: result.user });
    } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'Invalid credentials.', msg: error.message }, { status: 401 });
        } else if (error.code === 'auth/missing-email') {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        } else {
            console.error(error);
            return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
        }
    }
}
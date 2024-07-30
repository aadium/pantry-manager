import firebase from 'firebase/app';
import 'firebase/auth';
import {NextResponse} from "next/server";

export async function POST(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        const result = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log(result);
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'Invalid credentials.' });
        } else {
            return NextResponse.json({ error: 'Something went wrong.' });
        }
    }
}
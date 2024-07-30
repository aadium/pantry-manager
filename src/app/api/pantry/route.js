import firebase from "@/app/firebase";
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Import Firebase Auth
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
        }
        const collectionRef = firebase.firestore().collection("pantry");
        const snapshot = await collectionRef.get();
        const documents = snapshot.docs.map(doc => doc.data());
        return NextResponse.json(documents);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
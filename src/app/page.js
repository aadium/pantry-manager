import styles from "./page.module.css";
import LoginPage from "@/app/components/login";

export default function Home() {
  return (
    <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Next.js!</h1>
        <LoginPage />
    </main>
  );
}

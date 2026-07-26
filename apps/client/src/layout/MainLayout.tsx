import Header from "@/components/Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

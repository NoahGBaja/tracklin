import Header from "../components/ui/header";
import { usePage } from "@inertiajs/react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
export default function AppLayout ({title, children}){
    const { url } = usePage();
    const hideHeader = ["/login", "/register"];
    return(
        <div className="fixed inset-0 overflow-y-auto bg-[url('/assets/Desktop.png')] w-full h-dvh flex flex-col bg-cover">
            {!hideHeader.includes(url) && <Header />}

            <main className="h-dvh">
                {children}
            </main>
        </div>
    );
}

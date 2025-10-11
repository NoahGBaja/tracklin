import Header from "../components/ui/header";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
export default function AppLayout ({title, children}){
    return(
        <div className="fixed inset-0 overflow-y-auto bg-[url('/assets/Desktop.png')] w-full h-dvh flex flex-col bg-cover">
            <Header/>
            <FlickeringGrid
                className="absolute inset-0"
                squareSize={4}
                gridGap={6}
                flickerChance={0.3}
                color="rgb(255, 255, 255)"
                maxOpacity={0.2}
            />
            <main className="h-dvh">
                {children}
            </main>
        </div>
    )
}
import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from '@inertiajs/react'
import { Pencil, Book, Clock } from "../components/ui/attributes"
export default function Features(){
    const [toDo,setToDo] = useState(false)
    const [clock,setClock] = useState(false)
    const size=1;
    return(
        <div className="flex flex-col h-dvh">
            <div className="w-full h-[10%] shadow-2xl"/>
            <div className="flex flex-col items-center justify-center w-full h-[100%]">
                <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{duration:0.3}}
                 className="flex flex-col justify-center items-center bg-gradient-to-r from-transparent via-blue-200 to-transparent shadow-2xl w-full h-[10%] p-4 text-6xl text-white [-webkit-text-stroke:0.4px_black] [text-shadow:_4px_4px_0_#000]">
                    <motion.h1
                    initial={{scale:0.8}}
                    animate={{scale:1}}
                    transition={{duration:0.3}}
                    >
                        Features
                    </motion.h1>
                </motion.div>
                <div className="w-[80%] h-[70%] justify-center items-center flex p-4 text-white [-webkit-text-stroke:0.4px_black] [text-shadow:_4px_4px_0_#000] text-2xl  rounded-2xl">
                    <Link href='/todolist' className="flex flex-col w-[50%] items-center justify-center h-full gap-6">
                        <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{
                            duration:0.4, 
                            ease:'easeInOut'}}
                        onHoverStart={()=>setToDo(true)} 
                        onHoverEnd={()=>setToDo(false)}
                        className="flex justify-center items-center hover:opacity-75 cursor-pointer hover:scale-102 transition duration-500 ease-in-out w-[350px] h-[350px] bg-white/90 outline-4 outline-blue-600 ring-8 rounded-full">
                            <Pencil props={toDo} size={size} />
                            <Book props={toDo} size={size}/>
                        </motion.div>
                        <p className="text-4xl">
                            To-Do List 
                        </p>
                    </Link>
                    <Link href='/todolist' className="flex flex-col w-[50%] items-center justify-center h-full gap-6">
                        <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{
                            duration:0.4, 
                            ease:'easeInOut'}}
                        onHoverStart={()=>setClock(true)} 
                        onHoverEnd={()=>setClock(false)}
                        className="flex justify-center items-center hover:opacity-75 cursor-pointer hover:scale-102 transition duration-500 ease-in-out w-[350px] h-[350px] bg-white/90 outline-4 outline-blue-600 ring-8 rounded-full">
                            <Clock props={clock} size={size}/>
                        </motion.div>
                        <p className="text-4xl">
                            Set Alarm
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
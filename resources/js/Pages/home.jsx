'use client'
import '../../css/app.css'; 
import { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react'
import { Note, SignIn, LearnMore, PersonalComputer, Pencil, Book, Clock } from '../components/ui/attributes';
import { truncate } from '@/lib/utils';

export default function Home() {
    const [toDo,setToDo] = useState(false);
    const [clock,setClock] = useState(false);

    const page = usePage();
    const props = page.props || {};
    const auth = props.auth || {};
    const user = auth.user || null;
    const username = truncate(user?.name) || "Guest";
    const role = user ? "user" : "guest"

    const size = {sizeAll:2, sizePencil:3};
  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role={role} />
      {/* <Header key={role} role={role} /> */}
      {/* <Header role={role} userData={userData}/> */}
      {/* <Header showProfile={showProfile} setShowProfile={setShowProfile} role={role} /> */}
      <div className='min-h-full'>
        <div className='flex h-[10%] w-full'/> 
        <div className='flex flex-row w-[100%] h-[15%]'>
          <div className='flex justify-center items-center w-[20%] h-full'>
            <button
            // onClick={()=>setRole(!roles)}
             className='cursor-pointer outline-blue-600 ring-white ring-4 active:scale-90 active:opacity-100 duration-75 ease-in-out hover:opacity-70 bg-blue-700/80 outline-2 w-[100px] text-white text-xl h-[50px] rounded-2xl'>
              {username}
            </button>          
          </div>
          </div>
          <div className="flex justify-center items-center flex-col h-[75%] rounded-2xl text-8xl [-webkit-text-stroke:0.4px_black] [text-shadow:_4px_4px_0_#000] font-extralight text-white">
            <motion.div 
            initial={{
              opacity:0, 
              x:-100
            }}
            animate={{
              opacity:1, 
              x:0
            }}
            transition={{duration:1}}
            className='flex flex-col justify-center items-center'>
              <p>
              Hello! 
              </p>
              <p>
              Welcome to Tracklin!
              </p>
            </motion.div>
            <div className='flex flex-row w-full h-full'>
              <div className='flex flex-col items-center w-[25%] h-full justify-baseline'>
                <motion.div 
                initial={{
                  scale:0, 
                  opacity:0
                }}
                animate={{
                  scale:1, 
                  opacity:1
                }}
                transition={{
                  duration:0.9, 
                  ease:'circOut',
                  type:'spring'
                }}
                className='flex flex-col w-[65%] h-full justify-center items-center'>
                  <Note/>
                </motion.div>
              </div>
              <div className='flex justify-between w-[50%] pt-5'>
                {
                  role!=='user'?(
                  <>
                    <motion.button 
                    initial={{
                      scale:0, 
                      opacity:0
                    }}
                    animate={{
                      scale:1, 
                      opacity:1
                    }}
                    transition={{
                      duration:0.9, 
                      ease:'circOut',
                      type:'spring'
                    }}
                    className='w-[300px] h-[100px]'>
                      <Link href={'/login'}>
                          <SignIn/>
                      </Link>
                    </motion.button>
                    <motion.button 
                    initial={{
                      scale:0, 
                      opacity:0
                    }}
                    animate={{
                      scale:1, 
                      opacity:1
                    }}
                    transition={{
                      duration:0.9, 
                      ease:'easeInOut', 
                      type:'spring', 
                      delay:0.2
                    }}
                    className='w-[300px] h-[100px]'>
                        <Link href={'/about'}>
                            <LearnMore/>
                        </Link>
                    </motion.button>
                  </>  
                  ):(
                    <>
                      <Link href={'/todolist'} className="flex flex-col w-[50%] items-center justify-baseline h-full gap-6">
                        <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{
                          duration:0.4, 
                          ease:'easeInOut'
                        }}
                        onHoverStart={()=>setToDo(true)} 
                        onHoverEnd={()=>setToDo(false)}
                        className="flex justify-center items-center gap-x-3 pr-5 hover:opacity-75 cursor-pointer hover:scale-102 transition duration-500 ease-in-out w-[175px] h-[175px] bg-white/90 outline-4 outline-blue-600 ring-8 rounded-full">
                            <Pencil props={toDo} size={size.sizePencil} />
                            <Book props={toDo} size={size.sizeAll}/>
                        </motion.div>
                        <p className="text-4xl">
                            To-Do List 
                        </p>
                      </Link>
                      <Link href={'/timer'} className="flex flex-col w-full items-center justify-baseline h-full gap-6">
                      {/* className="flex flex-col w-[50%] items-center justify-baseline h-full gap-6"> */}
                        <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{
                          duration:0.4, 
                          ease:'easeInOut'
                        }}
                        onHoverStart={()=>setClock(true)} 
                        onHoverEnd={()=>setClock(false)}
                        className="flex justify-center items-center hover:opacity-75 cursor-pointer hover:scale-102 transition duration-500 ease-in-out w-[175px] h-[175px] bg-white/90 outline-4 outline-blue-600 ring-8 rounded-full">
                            <Clock props={clock} size={size.sizeAll}/>
                        </motion.div>
                        <p className="text-4xl">
                            Set Alarm
                        </p>
                        </Link>
                    {/* </div> */}
                    </> 
                  )
                }
              </div>  
              <div className='flex flex-row w-[25%] h-full justify-center'>
                <motion.div 
                initial={{
                  scale:0, 
                  opacity:0
                }}
                animate={{
                  scale:1, 
                  opacity:1
                }}
                transition={{
                  duration:0.9, 
                  ease:'circOut',
                  type:'spring'
                }}
                className='w-[180px] h-[170px]'>
                  <PersonalComputer/>
                </motion.div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

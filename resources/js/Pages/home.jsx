'use client'
import '../../css/app.css'; 
import { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react'
import { Note, SignIn, LearnMore, PersonalComputer } from '../components/ui/attributes';
const role='user';
export default function Home() {
  return (
    <div className="fixed inset-0 flex flex-col">
      <Header/>
      <div className='min-h-full '>
        <div className='h-[10%] w-full '/>
        <div className='flex flex-row w-[100%] h-[15%] bg-red-500'/>
          <div className="flex bg-red-200 justify-center items-center flex-col h-[75%] rounded-2xl text-8xl [-webkit-text-stroke:0.4px_black] [text-shadow:_4px_4px_0_#000] font-extralight text-white">
            <motion.div 
            initial={{opacity:0, x:-100}}
            animate={{opacity:1, x:0}}
            transition={{duration:1}}
            className='flex flex-col bg-red-300 justify-center bg-red-700 items-center'>
              <p>
              Hello! 
              </p>
              <p>
              Welcome to Tracklin!
              </p>
            </motion.div>
            <div className='flex flex-row bg-red-900 w-full h-full'>
              <div className='flex flex-col bg-yellow-800 items-center w-[25%] h-full justify-baseline'>
                <motion.div 
                initial={{scale:0, opacity:0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.9, ease:'circOut',type:'spring'}}
                className='flex flex-col w-[65%] h-full bg-red-200 justify-center items-center'>
                  <Note/>
                </motion.div>
              </div>
              <div className='flex justify-between bg-yellow-300 w-[50%]'>
                <motion.button 
                initial={{scale:0, opacity:0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.9, ease:'circOut',type:'spring'}}
                className='w-[300px] h-[100px]'>
                  <SignIn/>
                </motion.button>
                <motion.button 
                initial={{scale:0, opacity:0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.9, ease:'easeInOut', type:'spring', delay:0.2}}
                className='w-[300px] h-[100px]'>
                    <Link href={'/about'}>
                        <LearnMore/>
                    </Link>
                </motion.button>
              </div>  
              <div className='flex flex-row w-[25%] h-full justify-center'>
                <motion.div 
                initial={{scale:0, opacity:0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.9, ease:'circOut',type:'spring'}}
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

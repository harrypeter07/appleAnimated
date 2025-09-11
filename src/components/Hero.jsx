import gsap from 'gsap';
import { useState } from 'react';
import { useGSAP} from '@gsap/react'
import { smallHeroVideo, futuristicVideo} from '../utils';
import { useEffect } from 'react';
const Hero = () => {
    const [videoSrc , setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : futuristicVideo)
  //we have made this function and useEFFECT because it will make sure the changes whenever the window is resized from small to large or vice verssa
     const handleVideoSrcSet =() => {
       if(window.innerWidth < 760){
        setVideoSrc(smallHeroVideo)
       } else {
        setVideoSrc(futuristicVideo)
       }
     }

     useEffect(()=>{
      window.addEventListener('resize' , handleVideoSrcSet);
      return ()=>  {
        window.removeEventListener('resize' , handleVideoSrcSet);
      }
     }, [])



    useGSAP(()=> {
        gsap.to("#hero" ,{
            opacity:1,
            delay:1.5,

        })

        gsap.to("#cta" , {
          opacity:1,
          y: -50,
          delay:2,


        })
    }, [])
  return (
  <section className="w-full nav-height bg-black relative overflow-hidden">
    {/* Full background video */}
    <video 
      className='absolute inset-0 w-full h-full object-cover pointer-events-none z-0' 
      autoPlay 
      muted 
      playsInline={true} 
      loop
      key={videoSrc}
    >
        <source src={videoSrc} type='video/mp4' />
    </video>
    
    {/* Content overlay */}
    <div className="relative z-10 h-full w-full flex-center flex-col">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">Hi, I&apos;m Hassan</p>
      </div>
    </div>

      <div id="cta" className="
      flex 
      flex-col
      items-center 
      opacity-0 translate-y-20">
          <a href="#highlights" className='btn'>View Work</a>
          <p className='font-normal text-xl'>Front‑end Engineer • 3D & Motion • React</p>
      </div>
    </div>
  </section>
  )
}

export default Hero

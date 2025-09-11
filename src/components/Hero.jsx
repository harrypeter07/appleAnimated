import gsap from 'gsap';
import { useGSAP} from '@gsap/react'
import CosmicHero from './CosmicHero';
const Hero = () => {



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
    {/* Cosmic Hero Component - Centered and Touch Interactive */}
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
      <div className="w-full h-full">
        <CosmicHero />
      </div>
    </div>
    
    {/* Content overlay */}
    <div className="relative z-10 h-full w-full flex justify-between items-center px-8">
      {/* Left side - Hero title */}
      <div className="flex flex-col">
        <p id="hero" className="hero-title text-left">Hi, I&apos;m Hassan</p>
      </div>

      {/* Right side - CTA */}
      <div id="cta" className="
      flex 
      flex-col
      items-end 
      opacity-0 translate-y-20">
          <a href="#highlights" className='btn'>View Work</a>
          <p className='font-normal text-xl text-right'>Front‑end Engineer • 3D & Motion • React</p>
      </div>
    </div>
  </section>
  )
}

export default Hero

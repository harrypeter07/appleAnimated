import gsap from 'gsap';
import { useGSAP} from '@gsap/react'
import CosmicHero from './CosmicHero';
const Hero = () => {



    useGSAP(()=> {
        gsap.to("#hero" ,{
            opacity:1,
            delay:1.5,
        })

        gsap.to("#hero-name" ,{
            opacity:1,
            delay:1.8,
        })

        gsap.to("#cta" , {
          opacity:1,
          y: -50,
          delay:2.2,
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
      <div className="flex flex-col space-y-1">
        <p id="hero" className="hero-glow-text text-7xl md:text-9xl text-left leading-none opacity-0">
          Hi
        </p>
        <p id="hero-name" className="hero-glow-text text-6xl md:text-8xl text-left leading-none opacity-0">
          Hassan
        </p>
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

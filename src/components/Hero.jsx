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
  <section className="overflow-hidden relative w-full bg-black nav-height">
    {/* Cosmic Hero Component - Centered and Touch Interactive */}
    <div className="flex absolute inset-0 z-0 justify-center items-center w-full h-full">
      <div className="w-full h-full">
        <CosmicHero />
      </div>
    </div>
    
    {/* Content overlay */}
    <div className="flex relative z-10 justify-between items-center px-8 w-full h-full">
      {/* Left side - Hero title */}
      <div className="flex flex-col space-y-1">
        <p id="hero" className="text-7xl leading-none text-left opacity-0 hero-glow-text md:text-9xl">
          Hi
        </p>
        <p id="hero-name" className="text-6xl leading-none text-left opacity-0 hero-glow-text md:text-8xl">
          Hassan
        </p>
      </div>

      {/* Right side - CTA */}
      <div id="cta" className="flex flex-col items-end opacity-0 translate-y-20">
          <a href="#highlights" className='btn'>View Work</a>
          <p className='text-xl font-normal text-right'>Front‑end Engineer • 3D & Motion • React</p>
      </div>
    </div>
  </section>
  )
}

export default Hero

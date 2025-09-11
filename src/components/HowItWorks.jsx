import { useRef } from 'react'
import { chipImg, frameImg, frameVideo } from '../utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { animateWithGsap } from '../utils/animations';

const HowItWorks = () => {
  const videoRef = useRef();
 
  useGSAP(() => {
    gsap.to('Video' ,{
        scrollTrigger: {
          trigger: '#hiwVideo ',
          toggleActions: 'play pause reverse restart',
          start: '-10% bottom',
          
        }, 
        onComplete: ()=> {
          videoRef.current.play();
        }
    
     })


    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip',
        start: '20% bottom'
      },
      opacity: 0,
      scale: 2,
      duration: 2,
      ease: 'power2.inOut'
    })

    animateWithGsap('.g_fadeIn', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.inOut'
    })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <img src={chipImg} alt="chip" width={180} height={180} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            Craft and process.
            <br /> From idea to interaction.
          </h2>

          <p className="hiw-subtitle">
            It&apos;s here. A peek into how I design, iterate, and ship.
          </p>
        </div>

        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-full flex-center">
            <div className="overflow-hidden">
              <img 
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            <div className="hiw-video">
                <video  id='hiwVideo' className="pointer-events-none" playsInline preload="none" muted autoPlay ref={videoRef}>
                  <source src={frameVideo} type="video/mp4" />
                </video>
              </div>
          </div>
          <p className="text-gray font-semibold text-center mt-3">Honkai: Star Rail</p>
          </div>

          <div className="hiw-text-container">
                <div className="flex flex-1 justify-center flex-col">
                  <p className="hiw-text g_fadeIn">
                    I start with structure and motion principles to deliver {' '}
                    <span className="text-white">
                      clear, engaging interactions
                    </span>.
                  </p>

                  <p className="hiw-text g_fadeIn">
                   Then I refine details—timing, easing, depth—so every flow {' '}
                    <span className="text-white">
                      feels smooth and intentional
                    </span>
                    , across screens and devices.
                  </p>
                </div>
              

              <div className="flex-1 flex justify-center flex-col g_fadeIn">
                <p className="hiw-text">Toolkit</p>
                <p className="hiw-bigtext">React • GSAP • Three.js</p>
                <p className="hiw-text">Tailwind • Vite</p>
              </div>
              </div>
            </div>
    </section>
  )
}

export default HowItWorks
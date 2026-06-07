import SEHeader from '/components/spontaneous-earth/se-header.js'
import SpacetimeDial from '/components/spontaneous-earth/se-spacetime-dial.js'
import RelativeMotion from '/components/spontaneous-earth/se-relative-motion.js'

export default function Gravity() {
    return (
        <div>
            <div className="mb-8">
                <SEHeader title="Gravity" number="1" />
                <h5 className="italic tracking-wide text-mist-700 text-center
                content-center w-xs md:w-xl mx-auto mt-32 mb-28">
                    Despite what you may have been taught, high-mass objects like the Earth don't
                    actually pull things towards them. Gravity isn't a force in the traditional sense. Instead, it's
                    the result of the warping of spacetime by matter in the universe.
                </h5>

                <h1 className=" 
                    text-mist-800 
                    text-5xl text-center
                    font-normal
                    md:text-7xl
                    font-cormorant
                    tracking-wide
                    w-xs md:w-xl flex-1
                    content-center mx-auto mb-32
                    ">
                        How does gravity make things fall?
                    </h1>
                
               <div className="w-xs md:w-xl mx-auto">
                    <p className="
                        text-mist-800 font-lato text-base
                    ">
                        <span className="uppercase text-lg font-normal">The Fourth Dimension </span>
                        One of the discoveries that rocketed Einstein to fame in the early 20th
                        century was his realization that time itself is a physical dimension we
                        move through. Just like space, you can move slower or faster through time
                        relative to others.
                    </p>
                    <RelativeMotion />
                </div>

                <div className="w-xs md:w-xl mx-auto">
                    <p className="
                        text-mist-800 font-lato text-base
                    ">
                        In fact, time and space are so intricately bound up 
                        with each other that the faster you travel through space 
                        the slower you travel through time and vice versa! Every 
                        object in the universe is moving at the exact same speed.
                    </p>
                    <SpacetimeDial />
                </div>
            </div>
        </div>
    )
}
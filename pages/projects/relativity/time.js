import SEHeader from '/components/spontaneous-earth/se-header.js'
import SpacetimeDial from '/components/spontaneous-earth/se-spacetime-dial.js'
import RelativeMotion from '/components/spontaneous-earth/se-relative-motion.js'

export default function Gravity() {
    return (
        <div>
            <div className="mb-8">
                <SEHeader title="Time" number="1" />
                <h5 className="italic tracking-wide text-mist-700 text-center
                content-center w-xs md:w-xl mx-auto mt-28 mb-28">
                    We often experience time as passing slower when doing a boring activity or passing faster
                    when we are totally engrossed in an activity, but you may be surprised to learn that time
                    actually can pass faster or slower for different people.
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
                        Does time pass the same for everyone?
                    </h1>
                
               <div className="w-xs md:w-xl mx-auto">
                    <p className="
                        text-mist-800 font-lato text-base
                    ">
                        <span className="uppercase text-lg font-normal">The Speed of Light </span>
                        Did you know that everything and everyone you've ever known (yes, even old grandma Gladis!)
                        is currently travelling at the speed of light? That's pretty fast! But how? Not only
                        do we observe different things moving at different speeds, but very few appear to travel as fast
                        as the speed of light except for, well, light. How can the airplane in the sky travelling
                        hundreds of miles per hour be travelling at the same speed as you laying on your
                        couch getting potato chip crumbs everywhere as you binge your favorite show? 
                        The answer lies in a relatively recent discovery in physics by someone you've likely
                        heard of.
                    </p>
                    <p className="
                        text-mist-800 font-lato text-base mt-6
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
                        In fact, the faster you travel through space 
                        the slower you travel through time and vice versa! Think of it
                        this way: Everything in the universe has a set budget of how fast
                        it can travel. That budget just so happens to be equal to the speed of light,
                        and it must be spent. Therefore, every
                        object in the universe is travelling at the speed of light,
                        that speed is just divided between movement through space
                        and movement through time. A photon travelling at the speed
                        of light through space does not experience the passing of time
                        at all, whereas an object or person completely at rest will
                        pass through time significantly faster than objects
                        who have some speed through space.
                    </p>
                    <SpacetimeDial />

                    <p className="
                        text-mist-800 font-lato text-base mt-6
                    ">
                        <span className="uppercase text-lg font-normal">Evidence of Time Dilation </span>
                        Don't believe me? 
                    </p>
                </div>
                
                <div className="hidden">
                    <SEHeader title="Gravity" number="2" />
                    <h5 className="italic tracking-wide text-mist-700 text-center
                    content-center w-xs md:w-xl mx-auto mt-28 mb-28">
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
                </div>
            </div>
        </div>
    )
}
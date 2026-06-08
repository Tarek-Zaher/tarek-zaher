import Link from 'next/link';

export default function SpontaneousEarth() {

    return(
        <>
            <div className="content-center mx-auto mt-8 w-xs md:w-xl flex-1">
                <h1 className=" 
                        text-mist-800 
                        text-5xl text-center
                        font-normal
                        md:text-7xl
                        font-cormorant
                        tracking-wide
                        mb-8
                        ">
                            Spontaneous Earth
                    </h1>
                <ol className="list-decimal list-inside font-cormorant text-xl">
                    <li><Link href="/projects/spontaneous-earth/time">Time</Link></li>
                </ol>    
            </div>
        </>
    )
}
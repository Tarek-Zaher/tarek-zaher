import Head from 'next/head';
import { Bangers } from 'next/font/google';
import { Patrick_Hand } from 'next/font/google';

const bangers = Bangers({
    subsets: ['latin'],
    weight: '400',
});

const patrickHand = Patrick_Hand({
    subsets: ['latin'],
    weight: '400',
});

export default function TheIrons() {


    return (
        <div>
            <Head>
                <title>The Hero's Journey</title>
            </Head>
            <main>
                <section className="w-full h-auto bg-[#EF9F11]">
                    <div>
                        <h1 className={`${bangers.className} text-6xl text-center text-[#A7201D] pt-16`}>The Hero's Journey</h1>
                        <h6 className={`${patrickHand.className} text-center`}>A fan project by Tarek Zaher</h6>
                    </div>
                    <div className="w-[80%] h-auto overflow-hidden mt-8 mx-auto">
                        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <circle r="50" cx="50" cy="50" fill="#DE2A32" />
                        </svg>
                    </div>
                </section>
                <section className="w-full h-[10rem] bg-[#141312]">

                </section>
            </main>
        </div>
    );
}
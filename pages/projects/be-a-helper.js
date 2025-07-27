import { Cormorant, Lexend } from 'next/font/google';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

const headerFont = Cormorant({
    subsets: ['latin'],
    weight: '700',
})

const bodyFont = Lexend({
    subsets: ['latin'],
    weight: '400',
})

const bodyFontBold = Lexend({
    subsets: ['latin'],
    weight: '700',
})

export default function HelperHomePage() {

    useGSAP(() => {
        gsap.set(['html', 'body'], {
            backgroundColor: '#FFFFFF',
        });
    });

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getTimeSinceSufficientAid = () => {
        const start = new Date('2023-10-09');
        const now = new Date();
        const timeDiff = now - start;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div>
            <nav class="border-b">
                <h2 className={`${headerFont.className} text-4xl text-center p-4`}>Be a Helper</h2>
            </nav>

            <section className={`bg-[#007A3D] py-8`}>
                <h3 className={`${headerFont.className} text-6xl pb-8 px-4 text-white text-left`}>Every Day Palestenians are Suffering</h3>
                <p className={`${bodyFont.className} text-xl text-white text-left px-4`}>For those who want to do more than just feel guilty, Be a Helper is a daily snapshot of all the different ways you can help suffering women and children right now.</p>
            </section>

            <section class="py-8 px-4">
                <p className={`${bodyFont.className} px-2 text-center`}>“When I was a boy and I would see scary things in the news, my mother would say to me, 'Look for the helpers. You will always find people who are helping.'"<br></br><br></br>-Mr. Rogers</p>
            </section>

            <section class="">
                <h1 className={`${headerFont.className} text-7xl px-4 pb-8`}>{today}</h1>
                <p className={`${bodyFont.className} px-4 text-base`}>As of today, The Gaza Health Ministry reports over <span className={`${bodyFontBold.className} text-[#CE1126]`}>59,000</span> Palestinians have been killed in Gaza. It has been <span className={`${bodyFontBold.className} text-[#CE1126]`}>{getTimeSinceSufficientAid()} days</span> since sufficient humanitarian aid has been allowed into Gaza. </p>
                <p className={`${bodyFont.className} px-4 pt-2 text-base`}><span className={`${bodyFontBold.className} text-[#007A3D]`}>0</span> donations have been initiated.</p>
                <p className={`${bodyFont.className} px-4 pt-2 text-base`}><span className={`${bodyFontBold.className} text-[#007A3D]`}>0</span> representatives have been contacted.</p>
                <p className={`${bodyFont.className} px-4 pt-2 text-base`}><span className={`${bodyFontBold.className} text-[#007A3D]`}>0</span> social media posts have been made.</p>

                <div class="m-4 bg-black text-white rounded-md p-4">
                    <h2 className={`${headerFont.className} text-5xl p-2`}>Donate</h2>
                    <h4 className={`${bodyFont.className} p-2`}><a href="https://www.map.org.uk/" target="_blank">Medical Aid for Palestinians (MAP)</a></h4>
                    <ul className={`${bodyFont.className} list-disc  pb-2 pr-2 pl-10`}>
                        <li class="pb-2"><span className={`${bodyFontBold.className}`}>Focus:</span> Emergency healthcare, psychosocial support, maternal care.</li>
                        <li><span className={`${bodyFontBold.className}`}>Credibility:</span> UK-registered charity with long-standing work in Gaza and the West Bank.</li>
                    </ul>
                    <button className={`${bodyFontBold.className} bg-[#CE1126] ml-10 mt-2 py-2 px-8 rounded-md`}><a class="" href="https://www.map.org.uk/?form=FUNFXHDCJPK" target="_blank">Donate Now</a></button>
                </div>

                <div class="m-4 bg-black text-white rounded-md p-4">
                    <h2 className={`${headerFont.className} text-5xl p-2`}>Lobby</h2>
                    <h4 className={`${bodyFont.className} p-2`}>Contact your representatives in Congress.</h4>
                    <ul className={`${bodyFont.className} list-disc  pb-2 pr-2 pl-10`}>
                        <li class="pb-2"><span className={`${bodyFontBold.className}`}>Why it matters:</span> Congressional offices track every call. Large volumes signal urgency and can influence public statements or votes.</li>
                        <li><span className={`${bodyFontBold.className}`}>What to say:</span> Ask your representative to support a humanitarian ceasefire and restore aid to Gaza.</li>
                    </ul>
                    <button className={`${bodyFontBold.className} bg-[#CE1126] ml-10 mt-2 py-2 px-8 rounded-md`}><a class="" href="https://www.congress.gov/members/find-your-member" target="_blank">Find My Representatives</a></button>
                </div>

            </section>
        </div>
    );
}
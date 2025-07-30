import { Cormorant, Lexend } from 'next/font/google';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Layout from '../../components/layout';



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

export async function getServerSideProps() {
    const rawSummaryData = await fetch('https://data.techforpalestine.org/api/v3/summary.json');
    const summaryData = await rawSummaryData.json();

    const totalKilled = summaryData.gaza.killed.total;
    const childrenKilled = summaryData.gaza.killed.children;
    const womenKilled = summaryData.gaza.killed.women;
    const injured = summaryData.gaza.injured.total;

    const rawDeathData = await fetch('https://data.techforpalestine.org/api/v2/killed-in-gaza.json');
    const deathData = await rawDeathData.json();

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    // Filter individuals born on today's month and day
    const bornToday = deathData.filter((person) => {
        if (!person.dob) return false;

        const dob = new Date(person.dob);
        return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
    });

    return {
        props: {
            totalKilled,
            childrenKilled,
            womenKilled,
            injured,
            bornToday,
        },
    };
}

export default function HelperHomePage({ totalKilled, childrenKilled, womenKilled, injured, bornToday }) {

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
        <Layout>

            <section className={`bg-[#007A3D] py-16`}>
                <p className={`${bodyFont.className} px-2 text-center text-white text-xl`}>“When I was a boy and I would see scary things in the news, my mother would say to me, 'Look for the helpers. You will always find people who are helping.'"<br></br><br></br>-Mr. Rogers</p>
            </section>

            <section class="py-8">
                <h1 className={`${headerFont.className} text-7xl px-4 pb-8`}>{today}</h1>
                <p className={`${bodyFont.className} px-4 text-base`}>
                    As of today, The Gaza Health Ministry reports <span className={`${bodyFontBold.className} text-[#CE1126]`}>{injured.toLocaleString()}</span> Palestinians have been injured in Gaza. 
                    <span className={`${bodyFontBold.className} text-[#CE1126]`}> {totalKilled.toLocaleString()}</span> have been killed.
                    Of those deaths, <span className={`${bodyFontBold.className} text-[#CE1126]`}>{womenKilled.toLocaleString()}</span> were women and <span className={`${bodyFontBold.className} text-[#CE1126]`}>{childrenKilled.toLocaleString()}</span> were chilren.
                    It has been <span className={`${bodyFontBold.className} text-[#CE1126]`}>{getTimeSinceSufficientAid()} days</span> since sufficient humanitarian aid has been allowed into Gaza. <a href="https://data.techforpalestine.org/docs/summary/">[source]</a></p>

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

            <section class="py-8 bg-[#CE1126]">
                <h1 className={`${headerFont.className} text-7xl px-4 pb-8 text-center text-white`}>Lost Birthdays</h1>
                {bornToday.map((person, index) => (
                    <p key={index} className={`${bodyFont.className} text-white text-center pb-4`}>
                        {person.en_name}<br></br>
                        {person.name}<br></br>
                        Born {new Date(person.dob).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC',
                        })}
                    </p>
                ))}
            </section>
        </Layout>
    );
}
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState } from 'react';
import DialogueScene from '../../components/anniversary/DialogueScene';
import MemoryPuzzleScene from '../../components/anniversary/MemoryPuzzleScene';

const scenes = [
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Hi baby! Happy Anniversary!',
        forgottenMemories: 0,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'I loved spending the past year with you.',
        forgottenMemories: 0,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'Wait... you liked spending it with me too.. right?',
        forgottenMemories: 0,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/sillyTarek.jpg',
        },
        message: 'Just kidding! Of course you did. :)',
        forgottenMemories: 0,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Anyways, you\'re probably wondering why I brought you here..',
        forgottenMemories: 0,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'I gathered my favorite memories of our year together onto these CDs for us to enjoy!',
        forgottenMemories: 0,
        memories: 6,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Chunk',
            image: '/images/anniversary/meowingChunk.jpg',
        },
        message: 'MEAOW',
        forgottenMemories: 0,
        memories: 6,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'CHUNKY NO—',
        forgottenMemories: 0,
        memories: 6,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Chunk',
            image: '/images/anniversary/fatChunk.jpg',
        },
        message: '...',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'He ate all of my memory CDs!',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/lazertagAlone.jpg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'This is worse than the time I got caught eating a lazertag burger all alone..',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'Will you help me remember the details of the memories so I can make new CDs for us?',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/sillyTarek.jpg',
        },
        message: 'Pretty pretty please?',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'THANK YOU. I knew you wouldn\'t mind. I think the first one had something to do with a beach..',
        forgottenMemories: 6,
        memories: 0,
    },
    {
        type: 'puzzle',
        title: 'Port Aransas with Family',
        date: 'August 31, 2024',
        images: [
            '/images/anniversary/memoryPuzzle1/beach1.jpeg',
            '/images/anniversary/memoryPuzzle1/beach2.jpeg',
            '/images/anniversary/memoryPuzzle1/beach3.jpeg',
            '/images/anniversary/memoryPuzzle1/beach4.jpeg',
        ],
        prompts: [
            { question: 'I remember I had a very rational fear of going in the water because ____ tried to eat me.', answer: 'Fish' },
            { question: 'What\'s that game with the metal circles I played with your dad?', answer: 'Washers' },
            { question: 'I remember somebody thought I was handsome, who was it again?', answer: 'Omi' },
            { question: 'Your dad caught a HUGE ____', answer: 'Crab' },
            { question: 'Who got sunburned?', answer: 'tarek' },
        ],
        forgottenMemories: 6,
        memories: 0,
    },
    {
        background: '/images/anniversary/memoryPuzzle1/beach2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'You did it!',
        forgottenMemories: 5,
        memories: 1,
    },
    {
        background: '/images/anniversary/memoryPuzzle1/beach2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'That was such a fun trip with your family.',
        forgottenMemories: 5,
        memories: 1,
    },
    {
        background: '/images/anniversary/memoryPuzzle1/beach2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'I\'m pretty sure shortly after that we made another amazing memory with them..',
        forgottenMemories: 5,
        memories: 1,
    },
    {
        type: 'puzzle',
        title: 'Texas State Fair!',
        date: 'September 28th, 2024',
        images: [
            '/images/anniversary/memoryPuzzle2/statefair2.jpeg',
            '/images/anniversary/memoryPuzzle2/statefair4.jpeg',
            '/images/anniversary/memoryPuzzle2/statefair3.jpeg',
            '/images/anniversary/memoryPuzzle2/statefair1.jpeg',
        ],
        prompts: [
            { question: 'They say everything\'s bigger in Texas. Especially this guy!', answer: 'Big Tex' },
            { question: 'People could not put down their hotdogs fast enough to applaud these little racers', answer: 'baby pigs' },
            { question: 'We won this stuffed animal who taught me sometimes imperfections make us even more loveable.', answer: 'Wonky Monkey' },
            { question: 'We ran into this cajun unexpectedly in the pet feeding barn..(as I know him)', answer: 'Threvor' },
            { question: 'This fair favorite brought a new spin to the world of east asian noodle dishes..', answer: 'Fried Pho' },
        ],
        forgottenMemories: 5,
        memories: 1,
    },
    {
        background: '/images/anniversary/memoryPuzzle2/statefair4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'That\'s what I\'m talking about!! Another memory CD down.',
        forgottenMemories: 4,
        memories: 2,
    },
    {
        background: '/images/anniversary/memoryPuzzle2/statefair4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'Oops sorry for covering your face here..',
        forgottenMemories: 4,
        memories: 2,
    },
    {
        background: '/images/anniversary/memoryPuzzle2/statefair4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Hm, what was next.. I think the 3rd CD was related to a different kind of fair..',
        forgottenMemories: 4,
        memories: 2,
    },
    {
        type: 'puzzle',
        title: 'The Renaissance Fair!',
        date: 'October 12, 2024',
        images: [
            '/images/anniversary/memoryPuzzle3/renfair1.jpeg',
            '/images/anniversary/memoryPuzzle3/renfair3.jpeg',
            '/images/anniversary/memoryPuzzle3/renfair2.jpeg',
            '/images/anniversary/memoryPuzzle3/renfair4.jpeg',
        ],
        prompts: [
            { question: 'I remember it involved a long drive and a briefly tense conversation on the reality of _______ ______?', answer: 'Climate Change' },
            { question: 'We saw a comedic play at the same spot Josh uttered this iconic line.', answer: 'mommy daddy I\'m still here' },
            { question: 'I got a REALLY bad face painting of a ______.', answer: 'Monkey' },
            { question: 'This was around the time we started to become obsessed with a certain Korean cartoon character.', answer: 'cartoon dog in rags' },
            { question: 'We went to the ___________ ____!', answer: 'Renaissance Fair' },
        ],
        forgottenMemories: 4,
        memories: 2,
    },
    {
        background: '/images/anniversary/memoryPuzzle3/renfair1.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Woohoo! 3 down, 3 more to go. :)',
        forgottenMemories: 3,
        memories: 3,
    },
    {
        background: '/images/anniversary/memoryPuzzle3/renfair1.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'I still can\'t believe I paid $30 for that monkey..',
        forgottenMemories: 3,
        memories: 3,
    },
    {
        background: '/images/anniversary/memoryPuzzle3/renfair1.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Next up, we tapped into our southern roots for a certain ceremony..',
        forgottenMemories: 3,
        memories: 3,
    },
    {
        type: 'puzzle',
        title: 'Miranda & Bobby\'s Wedding!',
        date: 'December 19th, 2024',
        images: [
            '/images/anniversary/memoryPuzzle4/wedding2.jpeg',
            '/images/anniversary/memoryPuzzle4/wedding4.jpeg',
            '/images/anniversary/memoryPuzzle4/wedding3.jpeg',
            '/images/anniversary/memoryPuzzle4/wedding1.jpeg',
        ],
        prompts: [
            { question: 'I purchased this vintage item of clothing for the occasion which promptly disintegrated into a million pieces.', answer: 'belt' },
            { question: 'The event had a temporary version of _______ which are usually permanent.', answer: 'tattoos' },
            { question: 'The random people we met at our table worked at this fruit-related company.', answer: 'Apple' },
            { question: 'You can thank your cousin\'s climate-denying boyfriend for this kind of dessert that was served.', answer: 'German Chocolate Cake' },
            { question: 'We ate at this South African restaurant with them after attending this event.', answer: 'Nando\'s' },
        ],
        forgottenMemories: 3,
        memories: 3,
    },
    {
        background: '/images/anniversary/memoryPuzzle4/wedding4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Yippe yippee yippee!',
        forgottenMemories: 2,
        memories: 4,
    },
    {
        background: '/images/anniversary/memoryPuzzle4/wedding4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'We looked soo good here we\'re so in love.',
        forgottenMemories: 2,
        memories: 4,
    },
    {
        background: '/images/anniversary/memoryPuzzle4/wedding4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'That Gary guy was weird though..',
        forgottenMemories: 2,
        memories: 4,
    },
    {
        background: '/images/anniversary/memoryPuzzle4/wedding4.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Moving on! I seem to recall a certain AirBnB adventure we went on..',
        forgottenMemories: 2,
        memories: 4,
    },
    {
        type: 'puzzle',
        title: 'Belated Valentine\'s Day!',
        date: 'February 16th, 2025',
        images: [
            '/images/anniversary/memoryPuzzle5/valentines1.jpeg',
            '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
            '/images/anniversary/memoryPuzzle5/valentines3.jpeg',
            '/images/anniversary/memoryPuzzle5/valentines4.jpeg',
        ],
        prompts: [
            { question: 'Our names for the two friends we met at the AirBnB.', answer: 'Mamma and Baby' },
            { question: 'Who we are in the animal kingdom.', answer: 'Duck and Goose' },
            { question: 'We crossed using this item off your year bingo.', answer: 'telescope' },
            { question: 'On our long long hike you asked to pretend to be these two historical figures.', answer: 'Lewis and Clark' },
            { question: 'We ate and drank the best _______ _____ ___ _______ ever.', answer: 'lobster rolls and sangria' },
        ],
        forgottenMemories: 2,
        memories: 4,
    },
    {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'That was such a great trip.',
        forgottenMemories: 1,
        memories: 5,
    },
        {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/sillyTarek.jpg',
        },
        message: 'I did pretty good huh!',
        forgottenMemories: 1,
        memories: 5,
    },
            {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'Too bad it was two days late..',
        forgottenMemories: 1,
        memories: 5,
    },
        {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'Speaking of late, we\'re nearing the end here!',
        forgottenMemories: 1,
        memories: 5,
    },
            {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'There were so many memories I didn\'t include that I will cherish forever..',
        forgottenMemories: 1,
        memories: 5,
    },
                {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'As I look back on them all, I\'m struck by how many came about due to your effort and love.',
        forgottenMemories: 1,
        memories: 5,
    },
                    {
        background: '/images/anniversary/memoryPuzzle5/valentines2.jpeg',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/happyTarek.png',
        },
        message: 'I\'m so happy and lucky to be with you. I can\'t wait to make many more memories together!',
        forgottenMemories: 1,
        memories: 5,
    },
        {
        type: 'puzzle',
        title: 'Happy Anniversary!',
        date: 'August 1st, 2025',
        images: [
            '/images/anniversary/memoryPuzzle6/us1.jpeg',
            '/images/anniversary/memoryPuzzle6/us2.jpeg',
            '/images/anniversary/memoryPuzzle6/us3.jpeg',
            '/images/anniversary/memoryPuzzle6/us4.jpeg',
        ],
        prompts: [
            { question: 'The answer is \"I\"', answer: 'I' },
            { question: 'The answer is \"love\"', answer: 'love' },
            { question: 'The answer is \"you\"', answer: 'you' },
            { question: 'The answer is \"forever\"', answer: 'forever' },
            { question: 'The answer is \"Ruthie\"', answer: 'Ruthie' },
        ],
        forgottenMemories: 1,
        memories: 5,
    },
                        {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Chunk',
            image: '/images/anniversary/meowingChunk.jpg',
        },
        message: 'MEAOW',
        forgottenMemories: 0,
        memories: 6,
    },
                        {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'Oh here we go again..',
        forgottenMemories: 0,
        memories: 6,
    },
                            {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Chunk',
            image: '/images/anniversary/yummyChunk.jpg',
        },
        message: '...',
        forgottenMemories: 0,
        memories: 6,
    },
                            {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'CHUNKY NO, WAIT——',
        forgottenMemories: 0,
        memories: 6,
    },
                                {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Chunk',
            image: '/images/anniversary/fatChunk.jpg',
        },
        message: '...',
        forgottenMemories: 6,
        memories: 0,
    },
                                {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: 'Tarek',
            image: '/images/anniversary/worriedTarek.jpg',
        },
        message: 'CHUNKYYYYYYYYYY',
        forgottenMemories: 6,
        memories: 0,
    },
                                    {
        background: '/images/anniversary/livingRoom.png',
        character: {
            name: '',
            image: '',
        },
        message: 'The End :)',
        forgottenMemories: 6,
        memories: 0,
    },
];

export default function AnniversaryGame() {

    useGSAP(() => {
        gsap.set(['html', 'body'], {
            backgroundColor: '#2F323A',
        });
    });

    const [index, setIndex] = useState(0);

    const handleNext = () => {
        if (index < scenes.length - 1) {
            setIndex(index + 1);
        }
    };

    const handleBack = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    const current = scenes[index];

    return (
        <div>
            {current.type === 'puzzle' ? (
                <MemoryPuzzleScene {...current} onNext={handleNext} />
            ) : (
                <DialogueScene {...current} onNext={handleNext} onBack={handleBack} />
            )}
        </div>
    );
}
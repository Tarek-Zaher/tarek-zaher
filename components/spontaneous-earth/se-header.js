import Link from 'next/link';

export default function SEHeader(props) {
    return(
        <header className="
        tracking-wide text-mist-800 text-center font-cormorant
        flex flex-row justify-between content-center w-xs md:w-xl mt-6 mx-auto">
            <div className="flex-1">
                <Link href="/">{props.title}</Link>
            </div>
            <p className="">{props.number}</p>
        </header>
    );
}
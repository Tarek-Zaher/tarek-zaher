import { useRef } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { libreBaskervilleRegular, latoRegular } from '../components/layout';
import { colorPalette } from '../lib/colorPalette';

export default function PostPreview({ postData, height, overlap, zIndex }) {
    const ref = useRef();
    const router = useRouter();
    const postColor = colorPalette[postData.color] || '#95B8D1';

    const handleClick = () => {
        const el = ref.current;
        const rect = el.getBoundingClientRect();

        // Clone element for animation
        const clone = el.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.zIndex = 9999;
        clone.style.margin = 0;

        document.body.appendChild(clone);
        const cloneTitle = clone.querySelector('h2');

        gsap.to(cloneTitle, {
            autoAlpha: 0,
            duration: 0.3
        });
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            ease: 'power2.inOut',
            duration: 0.6,
            onComplete: () => {
                router.push(`/posts/${postData.id}`);
            },
        });

        const removeClone = () => {
            clone.remove();
            router.events.off('routeChangeComplete', removeClone);
        };

        router.events.on('routeChangeComplete', removeClone);
    };

    return (
        <div
            ref={ref}
            onClick={handleClick}
            className={`postPreview relative prose text-[#181818] cursor-pointer mx-[20px] mb-[20px] ${overlap ? 'mt-[-150px] overlapper' : ''} border-0 rounded-[50px] ${libreBaskervilleRegular.className}`}
            style={{ backgroundColor: postColor, height, zIndex }}
        >
            <h5 className={`text-xs text- pt-3 px-[10px] pb-[10px] text-center uppercase ${latoRegular.className}`}>{postData.type}</h5>
            <h2 className={`text-center text-[1.5rem] leading-[1.4] px-16 mt-2 font-normal`}>{postData.title}</h2>
        </div>
    );
}

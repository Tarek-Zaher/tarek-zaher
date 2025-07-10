import { useRef } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { libreBaskervilleBold } from '../components/layout';
import { libreBaskervilleRegular } from '../components/layout';
import { colorPalette } from '../lib/colorPalette';

export default function PostPreview({ post, height, overlap }) {
  const ref = useRef();
  const router = useRouter();

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

    gsap.to(clone, {
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      ease: 'power2.inOut',
      duration: 0.6,
      onComplete: () => {
        router.push(`/posts/${post.id}`);
      },
    });

    const removeClone = () => {
      clone.remove();
      router.events.off('routeChangeComplete', removeClone);
    };

    router.events.on('routeChangeComplete', removeClone);
  };

  const postColor = colorPalette[post.color] || '#95B8D1';

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`cursor-pointer mx-[20px] mb-[20px] ${overlap ? 'mt-[-150px]' : ''} border-0 rounded-[50px] ${libreBaskervilleRegular.className}`}
      style={{ backgroundColor: postColor, height }}
    >
      <h5 className={`text-sm pt-[20px] px-[10px] pb-[10px] text-center`}>{post.type}</h5>
      <h2 className={`text-center text-[1.5rem] leading-[1.4] my-4 px-8`}>{post.title}</h2>
    </div>
  );
}

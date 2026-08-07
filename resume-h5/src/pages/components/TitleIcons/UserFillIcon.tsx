import { SVGProps } from 'react';

export default function MajesticonsUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <circle cx="12" cy="8" r="5" fill="currentColor" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path fill="currentColor" d="M12 13a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8" />
      </g>
    </svg>
  );
}

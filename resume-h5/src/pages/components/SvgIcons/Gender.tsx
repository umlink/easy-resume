import { SVGProps } from 'react';

export function FilledGender(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 15q1.45 0 2.475-1.025T15.5 11.5t-1.025-2.475T12 8T9.525 9.025T8.5 11.5t1.025 2.475T12 15m-1 8v-2H9v-2h2v-2.1q-1.95-.35-3.225-1.875T6.5 11.5q0-.825.238-1.625T7.45 8.4l-.65-.65l-1.4 1.4L4 7.75l1.4-1.425l-1.9-1.9V7h-2V1h6v2H4.925l1.9 1.9L8.25 3.5l1.4 1.4l-1.4 1.425l.65.65q.675-.5 1.475-.737T12 6t1.625.238t1.475.737L19.075 3H16.5V1h6v6h-2V4.425l-3.975 3.95q.475.7.725 1.488t.25 1.637q0 2-1.275 3.525T13 16.9V19h2v2h-2v2z"
      />
    </svg>
  );
}

export function LineGender(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.003 15.5q1.659 0 2.828-1.172Q16 13.155 16 11.497t-1.172-2.828T11.997 7.5T9.169 8.672Q8 9.845 8 11.503q0 1.659 1.172 2.828q1.173 1.169 2.831 1.169m-.503 7v-2h-2v-1h2v-3.023q-1.911-.235-3.206-1.644Q7 13.423 7 11.5q0-.863.286-1.673q.285-.81.818-1.504L6.608 6.827l-1.4 1.4l-.689-.688l1.4-1.406L3 3.213V6.5H2v-5h5v1H3.714l2.919 2.92l1.405-1.4l.689.688l-1.4 1.405L8.842 7.63q.675-.538 1.485-.834T12 6.5t1.673.295t1.485.834L20.287 2.5H17v-1h5v5h-1V3.214l-5.129 5.122q.533.681.831 1.487Q17 10.63 17 11.5q0 1.923-1.294 3.333T12.5 16.477V19.5h2v1h-2v2z"
      />
    </svg>
  );
}

import { SVGProps } from 'react';

export default function EntryTitle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M2 2h20v7H2zm2 2v3h16V4zm0 7v9h16v-9h2v11H2V11zm2 1h12v2H6zm0 4h12v2H6z" />
    </svg>
  );
}

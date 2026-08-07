export function LineDegree(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
        <path d="M2 17.4L23.022 9l21.022 8.4l-21.022 8.4z" />
        <path
          strokeLinecap="round"
          d="M44.044 17.51v9.223m-32.488-4.908v12.442S16.366 39 23.022 39c6.657 0 11.467-4.733 11.467-4.733V21.825"
        />
      </g>
    </svg>
  );
}

export function FilledDegree(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
        <path fill="currentColor" d="M2 17.4L23.022 9l21.022 8.4l-21.022 8.4z" />
        <path
          strokeLinecap="round"
          d="M44.044 17.51v9.223m-32.488-4.908v12.442S16.366 39 23.022 39c6.657 0 11.467-4.733 11.467-4.733V21.825"
        />
      </g>
    </svg>
  );
}

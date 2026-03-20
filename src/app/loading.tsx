export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
      <svg
        xmlns="http://www.w3.org/3000/svg"
        viewBox="0 0 128 128"
        className="pl"
      >
        <circle
          strokeDashoffset="-376.4"
          strokeDasharray="377 377"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="8"
          stroke="hsl(3,90%,55%)"
          fill="none"
          r="60"
          cy="64"
          cx="64"
          className="pl__ring1"
        ></circle>
        <circle
          strokeDashoffset="-329.3"
          strokeDasharray="329.9 329.9"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="7"
          stroke="hsl(13,90%,55%)"
          fill="none"
          r="52.5"
          cy="64"
          cx="64"
          className="pl__ring2"
        ></circle>
        <circle
          strokeDashoffset="-288.6"
          strokeDasharray="289 289"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="6"
          stroke="hsl(23,90%,55%)"
          fill="none"
          r="46"
          cy="64"
          cx="64"
          className="pl__ring3"
        ></circle>
        <circle
          strokeDashoffset="-254"
          strokeDasharray="254.5 254.5"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="5"
          stroke="hsl(33,90%,55%)"
          fill="none"
          r="40.5"
          cy="64"
          cx="64"
          className="pl__ring4"
        ></circle>
        <circle
          strokeDashoffset="-225.8"
          strokeDasharray="226.2 226.2"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="4"
          stroke="hsl(43,90%,55%)"
          fill="none"
          r="36"
          cy="64"
          cx="64"
          className="pl__ring5"
        ></circle>
        <circle
          strokeDashoffset="-203.9"
          strokeDasharray="204.2 204.2"
          strokeLinecap="round"
          transform="rotate(-90,64,64)"
          strokeWidth="3"
          stroke="hsl(53,90%,55%)"
          fill="none"
          r="32.5"
          cy="64"
          cx="64"
          className="pl__ring6"
        ></circle>
      </svg>
    );
}
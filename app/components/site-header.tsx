function PokeLogoIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 282 282"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[19.5px]"
      style={{ overflow: "visible" }}
    >
      <path
        transform="translate(17.5, 0)"
        d="M243.615 78.7222C220.468 66.2037 195.76 57.5592 170.443 52.8178C167.377 52.2396 166.769 48.1342 169.518 46.6886C187.861 37.119 207.593 29.9779 228.28 25.6991C231.781 24.9763 234.125 21.6515 233.517 18.1243L231.26 5.40338C230.595 1.70275 227.094 -0.610148 223.391 0.141543C187.514 7.48499 154.183 22.5188 125.337 43.5951C124.18 44.4335 122.675 44.4335 121.518 43.5951C92.7297 22.5188 59.399 7.48499 23.5223 0.141543C19.8478 -0.610148 16.318 1.70275 15.6525 5.40338L13.3958 18.1243C12.7592 21.6515 15.1028 24.9763 18.6326 25.6991C39.3196 29.9779 59.0518 37.0901 77.3953 46.6886C80.1439 48.1342 79.5363 52.2396 76.4694 52.8178C51.1821 57.5881 26.4734 66.2037 3.35605 78.7511C0.144503 80.4858 -0.954946 84.5912 0.867825 87.7425L7.31986 98.9312C9.1137 102.025 13.0486 103.065 16.2023 101.389C35.9634 90.7493 56.9687 83.2613 78.4658 78.9246C81.5038 78.3175 83.6448 81.8735 81.6195 84.2443C64.0572 104.945 49.7065 128.565 39.4932 154.412C38.1334 157.823 39.9272 161.668 43.3702 162.912L55.4931 167.335C58.8493 168.549 62.5527 166.844 63.8547 163.519C73.4315 139.494 86.9721 117.608 103.608 98.5842C105.663 96.2424 109.54 97.8036 109.395 100.897C106.849 152.128 99.3553 202.838 87.0589 252.276C86.5091 254.473 84.5128 256.006 82.256 256.006H6.5676C2.95099 256.006 -0.000161202 258.955 -0.000161202 262.569V275.463C-0.000161202 279.077 2.95099 282.026 6.5676 282.026H240.432C244.049 282.026 247 279.077 247 275.463V262.569C247 258.955 244.049 256.006 240.432 256.006H117.178C115.066 256.006 113.504 254.04 113.995 251.987C126.031 201.797 133.294 150.393 135.637 98.4975C135.782 95.5486 139.398 94.2475 141.366 96.4737C158.87 115.989 173.076 138.597 183 163.519C184.331 166.844 188.006 168.578 191.362 167.335L203.514 162.912C206.957 161.668 208.751 157.823 207.391 154.412C197.177 128.565 182.827 104.945 165.264 84.2443C163.239 81.8735 165.38 78.2886 168.418 78.9246C189.944 83.2613 210.978 90.7493 230.768 101.389C233.922 103.094 237.857 102.054 239.651 98.9312L246.103 87.7425C247.926 84.5623 246.826 80.4858 243.615 78.7511V78.7222Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      className="inline-block size-3.5"
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 15V6M18 6H9M18 6L6.25 17.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-black dark:text-white"
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 5V12V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navLinkClass =
  "font-sans text-[15px] leading-none font-medium tracking-[-0.001em] whitespace-nowrap transition-colors duration-150 ease-[cubic-bezier(0.12,0.23,0.5,1)]";

export function SiteHeader() {
  return (
    <div className="fixed left-0 right-0 top-0 z-30 h-[83px] min-w-[300px]">
      <header className="flex h-full w-full items-center justify-between px-6 bg-[rgb(255,253,250)] dark:bg-[rgb(16,16,18)] border-b border-[#EEEDEB] dark:border-[rgb(48,48,50)]">
        {/* Left: logo + section name */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div
              className="flex size-[34px] items-center justify-center rounded-[9.22px] bg-white text-black"
              style={{
                overflow: "visible",
                boxShadow:
                  "rgba(0,0,0,0.03) 0px 11.34px 22px 0px, rgba(0,0,0,0.04) 0px 1.41px 4px 0px, rgba(0,0,0,0.2) 0px 0px 1px 0px",
              }}
            >
              <PokeLogoIcon />
            </div>
            <span className="font-exposure select-none text-[22px] tracking-normal text-black dark:text-white">
              Poke
            </span>
          </button>
        </div>

        {/* Right: nav links (desktop) */}
        <div className="items-center gap-7 hidden md:flex">
          <div className="flex items-center gap-7">
            <a
              href="https://poke.com/discord"
              target="_blank"
              rel="noreferrer"
              className={`${navLinkClass} text-neutral-500 hover:text-neutral-400 dark:text-white/75 dark:hover:text-white/50`}
            >
              Discord <ArrowUpRightIcon />
            </a>
            <a
              href="https://poke.com/"
              className={`${navLinkClass} text-neutral-500 hover:text-neutral-400 dark:text-white/75 dark:hover:text-white/50`}
            >
              Go to app
            </a>
          </div>
        </div>

        {/* Right: sidebar toggle (mobile) */}
        <div className="items-center gap-7 flex md:hidden">
          <button
            type="button"
            aria-label="Toggle Sidebar"
            className="flex items-center justify-center pr-1"
          >
            <SidebarIcon />
          </button>
        </div>
      </header>
    </div>
  );
}


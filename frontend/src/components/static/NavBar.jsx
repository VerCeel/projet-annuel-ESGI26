const links = [
    {
    href: "/",
    label: "Page-1",
  },
  {
    href: "/",
    label: "Page-2",
  },
  {
    href: "/",
    label: "Page-3",
  }
];

const NavBar = () => {
  const pathname = window.location.pathname;
  return (
    <div className="fixed text-neutral-300 text-sm md:text-xl hover:text-white top-6 shadow-lg ring-2 ring-black/20 md:px-10 px-3 md:left-20 md:right-20 left-3 right-3 z-50 flex items-center justify-between py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl">
      <a href={"/"} className="flex md:gap-2 gap-1 items-center">
        Budgie
      </a>

      <div className="flex items-center md:gap-4 gap-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <a
              key={index}
              href={link.href}
              className={`group relative  transition-colors duration-100 ${
                isActive ? "text-white" : "text-neutral-300 hover:text-white"
              }`}
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-[2px] h-[2px] rounded-full w-full bg-neutral-200 transition-transform duration-100 ease-out ${
                  isActive ? "scale-x-100" : "scale-x-0"
                } origin-left group-hover:scale-x-100`}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
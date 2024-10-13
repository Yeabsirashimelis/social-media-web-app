function Header({ children }) {
  return (
    <h1 className="text-[50px] font-bold bg-gradient-to-t from-[rgb(75,0,130)] to-[rgb(238,130,238)] bg-clip-text text-transparent m-0 md:text-[40px] sm:text-[30px] xs:text-[20px]">
      {children}
    </h1>
  );
}

export default Header;

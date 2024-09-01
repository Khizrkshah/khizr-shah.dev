const Links = () => {
  const items = ["Homepage", "Services", "Projects", "Contact", "About"];

  return (
    <div className="links">
      {items.map((item) => (
        <a href={"#${item}"} key={item}>
          {item}
        </a>
      ))}
    </div>
  );
};

export default Links;

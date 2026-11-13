export default function Footer({ name }) {
  return (
    <footer className="wrap footer">
      <p>© {new Date().getFullYear()} {name}</p>
      <a href="#top">Back to top</a>
    </footer>
  );
}

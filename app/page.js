const links = [
  ["Dashboard", "/dashboard"],
  ["Screening", "/screening"],
  ["Management", "/management"],
  ["Config", "/config"],
  ["History", "/history"],
];

export default function Home() {
  return (
    <main>
      <h1>Meridian Web</h1>
      <p>Use a bearer token in API calls via Authorization header.</p>
      <ul>
        {links.map(([name, href]) => (
          <li key={href}><a href={href}>{name}</a></li>
        ))}
      </ul>
    </main>
  );
}

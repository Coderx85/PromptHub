import "@/styles/globals.css";

import Nav from "@components/Nav";

export const metadata = {
  title: "PromptHub",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html
    lang="en"
    // data-theme="black"
  >
    <body>
      <div className="main">
        <div className="gradient" />
      </div>
      <main className="relative z-10 flex justify-center bg-black items-center flex-col max-w-7xl mx-auto sm:px-16 px-6">
        <Nav />
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;

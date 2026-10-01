export const metadata = {
  title: "Margin | Your personal notebook",
  description: "A quieter place to keep the thoughts worth remembering.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

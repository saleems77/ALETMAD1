import { useBrandStore } from "./WhiteLabelContext";

export default function App({ Component, pageProps }) {
  const { currentBrand } = useBrandStore();

  return (
    <div
      style={{
        "--primary-color": currentBrand.primaryColor,
        "--secondary-color": currentBrand.secondaryColor,
        "--font-family": currentBrand.font,
      }}
    >
      <style jsx global>{`
        body {
          font-family: var(--font-family);
        }
        .btn-primary {
          background-color: var(--primary-color);
        }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}

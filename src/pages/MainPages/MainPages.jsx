import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import "./MainPages.css";

export function MainPages({ content: Content, title }) {
  return (
    <>
      <Header />

      <Content title={title} />

      <Footer />
    </>
  );
}

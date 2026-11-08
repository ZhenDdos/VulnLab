import { Outlet } from "react-router";
import { Layout } from "antd";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./MainLayout.module.scss";

const { Content } = Layout;

export const MainLayout = () => {
  return (
    <Layout className={styles.page}>
      <Header />
      <Content>
        {/* Сюда будут вставляться страницы (Catalog, Cart и т.д.) */}
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

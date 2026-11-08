import { Typography } from "antd";
import { Link } from "react-router";
import styles from "./Footer.module.scss";

const { Text } = Typography;

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>V</span>
        VULNLAB
      </Link>
      <Text type="secondary">Создано для тех, кто защищает будущее.</Text>
      <Text type="secondary">© 2025 VulnLab</Text>
    </footer>
  );
};

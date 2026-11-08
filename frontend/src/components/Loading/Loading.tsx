import { Spin, Typography } from "antd";
import styles from "./Loading.module.scss";

const { Text } = Typography;

type LoadingProps = {
  message?: string;
  showMessage?: boolean;
};

export function Loading({
  message = "Загрузка...",
  showMessage = true,
}: LoadingProps) {
  return (
    <div
      className={`${styles.container} ${styles.fullScreen}`}
      role="status"
      aria-live="polite"
    >
      <Spin size="large" />
      {showMessage && <Text type="secondary">{message}</Text>}
    </div>
  );
}

export default Loading;

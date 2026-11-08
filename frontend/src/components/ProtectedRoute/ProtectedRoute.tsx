import { Alert, Button } from "antd";
import styles from "./ProtectedRoute.module.scss";
import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "../../api/auth/auth.queries";
import Loading from "../Loading";

export const ProtectedRoute = () => {
  const { data, isError, isLoading, refetch } = useMe();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className={styles.stateContainer}>
        <Alert
          type="error"
          showIcon
          message="Не удалось проверить сессию"
          description="Проверьте соединение и попробуйте ещё раз."
          action={
            <Button onClick={() => refetch()} type="primary">
              Повторить
            </Button>
          }
        />
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

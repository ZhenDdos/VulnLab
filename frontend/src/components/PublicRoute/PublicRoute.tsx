import { Alert, Button } from "antd";
import styles from "./PublicRoute.module.scss";
import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "../../api/auth/auth.queries";
import Loading from "../Loading";

export const PublicRoute = () => {
  const { data, isLoading, isError, refetch } = useMe();
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

  if (data) {
    const destination =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? "/";
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

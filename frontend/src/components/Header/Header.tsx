import { Button } from "antd";
import { Link, useNavigate } from "react-router";
import styles from "./Header.module.scss";
import { useLogoutMutation } from "../../api/auth/auth.mutations";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../api/cart/cart.queries";
import { useMemo } from "react";

export const Header = () => {
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const { data = [] } = useCart();

  const cartCount = useMemo(
    () => data?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [data],
  );

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/auth", { replace: true }),
    });
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>V</span>
        VULNLAB
      </Link>
      <div className={styles.headerRight}>
        <Button
          type="default"
          className={styles.cartButton}
          aria-label={`Корзина, товаров: ${cartCount}`}
          onClick={() => navigate("/cart")}
        >
          <span className={styles.cartButtonContent}>
            <span className={styles.cartIcon}>
              <ShoppingCartOutlined />
            </span>
            <span>Корзина</span>
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </span>
        </Button>
        <Button type="text" onClick={logout} loading={logoutMutation.isPending}>
          Выйти
        </Button>
      </div>
    </header>
  );
};

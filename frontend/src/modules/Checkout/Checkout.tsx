import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Empty, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../api/cart/cart.queries";
import type { OrderResponse } from "../../api/orders/orders";
import { useCreateOrderMutation } from "../../api/orders/orders.mutations";
import Loading from "../../components/Loading";
import { formatCurrency } from "../../utils/formatCurrency";
import { pluralize } from "../../utils/pluralize";
import styles from "./Checkout.module.scss";

const { Text, Title } = Typography;

export function Checkout() {
  const navigate = useNavigate();
  const { data, isError, error, isLoading } = useCart();
  const createOrderMutation = useCreateOrderMutation();
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  const cartItems = data ?? [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  if (isLoading) {
    return <Loading />;
  }

  const mutationError = createOrderMutation.error;
  const mutationErrorMessage = mutationError
    ? isAxiosError<{ error?: string; message?: string }>(mutationError)
      ? (mutationError.response?.data?.error ??
        mutationError.response?.data?.message ??
        "Не удалось создать заказ. Попробуйте ещё раз.")
      : "Произошла непредвиденная ошибка. Попробуйте ещё раз."
    : null;

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/cart">
          <ArrowLeftOutlined />
          <span>Вернуться в корзину</span>
        </Link>
        <span className={styles.breadcrumbCurrent}>Оформление</span>
      </div>

      {createdOrder ? (
        <section className={styles.success} aria-live="polite">
          <CheckCircleOutlined className={styles.successIcon} />
          <span className={styles.eyebrow}>ЗАКАЗ СОХРАНЁН</span>
          <Title level={1}>Готово!</Title>
          <Text className={styles.successDescription}>
            Заказ №{createdOrder.id} создан и сохранён в системе. Оплата и
            доставка не выполняются.
          </Text>
          <div className={styles.successTotal}>
            <Text type="secondary">Сумма заказа</Text>
            <Text strong>{formatCurrency(createdOrder.total_price)}</Text>
          </div>
          <div className={styles.actions}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/")}
            >
              Вернуться в каталог
            </Button>
            <Button size="large" onClick={() => navigate("/cart")}>
              Перейти в корзину
            </Button>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.heading}>
            <div>
              <span className={styles.eyebrow}>ПРОВЕРКА ПЕРЕД СОЗДАНИЕМ</span>
              <Title level={1}>Оформление заказа</Title>
            </div>
          </div>

          {isError && (
            <Alert
              className={styles.alert}
              type="error"
              showIcon
              message="Не удалось загрузить корзину"
              description={
                error instanceof Error
                  ? error.message
                  : "Попробуйте обновить страницу."
              }
            />
          )}

          {mutationErrorMessage && (
            <Alert
              className={styles.alert}
              type="error"
              showIcon
              message="Не удалось создать заказ"
              description={mutationErrorMessage}
            />
          )}

          {isError ? null : cartItems.length === 0 ? (
            <section className={styles.empty}>
              <Empty description="В корзине нет товаров для оформления." />
              <Button type="primary" onClick={() => navigate("/")}>
                Перейти в каталог
              </Button>
            </section>
          ) : (
            <div className={styles.layout}>
              <section className={styles.items} aria-label="Состав заказа">
                <div className={styles.sectionHeading}>
                  <Title level={3}>Состав заказа</Title>
                  <Text type="secondary">
                    {cartCount}{" "}
                    {pluralize(cartCount, ["товар", "товара", "товаров"])}
                  </Text>
                </div>
                {cartItems.map((item) => (
                  <div className={styles.item} key={item.cart_item_id}>
                    <div className={styles.itemInfo}>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">
                        {item.quantity} шт. × {formatCurrency(item.price)}
                      </Text>
                    </div>
                    <Text strong>
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </Text>
                  </div>
                ))}
              </section>

              <aside className={styles.summary}>
                <span className={styles.eyebrow}>ИТОГО</span>
                <div className={styles.summaryLine}>
                  <Text type="secondary">Товары</Text>
                  <Text>{formatCurrency(cartTotal)}</Text>
                </div>
                <div className={styles.summaryTotal}>
                  <Text strong>Сумма заказа</Text>
                  <Text strong>{formatCurrency(cartTotal)}</Text>
                </div>
                <Alert
                  className={styles.demoNotice}
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  message="Без оплаты и доставки"
                  description="Заказ будет сохранён в системе. Оплата и отправка товаров не выполняются."
                />
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={createOrderMutation.isPending}
                  disabled={isError || cartItems.length === 0}
                  onClick={() =>
                    createOrderMutation.mutate(undefined, {
                      onSuccess: (response) =>
                        setCreatedOrder(response.order),
                    })
                  }
                >
                  Подтвердить и создать заказ
                </Button>
                <Link className={styles.backLink} to="/cart">
                  Вернуться и изменить корзину
                </Link>
              </aside>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Checkout;

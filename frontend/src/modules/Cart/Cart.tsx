import {
  ArrowLeftOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Empty, message, Typography } from "antd";
import { Link, useNavigate } from "react-router";
import styles from "./Cart.module.scss";
import { useCart } from "../../api/cart/cart.queries";
import Loading from "../../components/Loading";
import {
  useDecrementCartItemMutation,
  useIncrementCartItemMutation,
  useRemoveFromCartMutation,
} from "../../api/cart/cart.mutations";
import { pluralize } from "../../utils/pluralize";
import { formatCurrency } from "../../utils/formatCurrency";

const { Text, Title } = Typography;

export function Cart() {
  const { data, isError, error, isLoading } = useCart();
  const decrementMutation = useDecrementCartItemMutation();
  const incrementMutation = useIncrementCartItemMutation();
  const removeMutation = useRemoveFromCartMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const cartItems = data ?? [];
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.price),
    0,
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className={styles.page}>
      {contextHolder}
      <div className={styles.breadcrumb}>
        <Link to="/">
          <ArrowLeftOutlined />
          <span>Вернуться в каталог</span>
        </Link>
        <span className={styles.breadcrumbCurrent}>Корзина</span>
      </div>

      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>ВАШ ВЫБОР</span>
          <Title level={1}>Корзина</Title>
        </div>
        <Text type="secondary">
          {cartCount}{" "}
          {pluralize(cartCount || 0, ["товар", "товара", "товаров"])}
        </Text>
      </div>

      {isError && (
        <Alert
          className={styles.error}
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

      <div className={styles.layout}>
        {isError ? null : cartItems.length === 0 ? (
          <section className={styles.emptyCart}>
            <Empty
              description={
                <div className={styles.emptyCopy}>
                  <Title level={3}>В корзине пока пусто</Title>
                  <Text type="secondary">
                    Выберите товары в каталоге — они появятся здесь.
                  </Text>
                </div>
              }
            />
            <Button type="primary" size="large" onClick={() => navigate("/")}>
              Перейти в каталог
            </Button>
          </section>
        ) : (
          <>
            <section className={styles.items} aria-label="Товары в корзине">
              <div className={styles.itemsHeader}>
                <Text type="secondary">Товар</Text>
                <Text type="secondary">Количество</Text>
                <Text type="secondary">Стоимость</Text>
              </div>

              {cartItems.map((item) => {
                const isQuantityUpdating =
                  (decrementMutation.isPending &&
                    decrementMutation.variables === item.cart_item_id) ||
                  (incrementMutation.isPending &&
                    incrementMutation.variables === item.cart_item_id);

                return (
                  <article className={styles.item} key={item.cart_item_id}>
                    <div className={styles.productImage}>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <small>VULNLAB OBJECTS</small>
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productName}>{item.name}</Text>
                      <Text type="secondary">
                        {formatCurrency(item.price)} за шт.
                      </Text>
                      <Button
                        type="text"
                        className={styles.removeButton}
                        icon={<DeleteOutlined />}
                        loading={
                          removeMutation.isPending &&
                          removeMutation.variables === item.cart_item_id
                        }
                        onClick={() =>
                          removeMutation.mutate(item.cart_item_id, {
                            onError: () =>
                              messageApi.error("Не удалось удалить товар."),
                          })
                        }
                      >
                        Удалить
                      </Button>
                    </div>
                    <div
                      className={styles.quantity}
                      aria-label={`Количество: ${item.quantity}`}
                    >
                      <button
                        type="button"
                        aria-label={`Уменьшить количество товара ${item.name}`}
                        disabled={isQuantityUpdating}
                        onClick={() =>
                          decrementMutation.mutate(item.cart_item_id, {
                            onError: () =>
                              messageApi.error(
                                "Не удалось изменить количество товара.",
                              ),
                          })
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Увеличить количество товара ${item.name}`}
                        disabled={isQuantityUpdating}
                        onClick={() =>
                          incrementMutation.mutate(item.cart_item_id, {
                            onError: () =>
                              messageApi.error(
                                "Не удалось изменить количество товара.",
                              ),
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                    <Text strong className={styles.price}>
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </Text>
                  </article>
                );
              })}
            </section>

            <aside className={styles.summary}>
              <span className={styles.summaryEyebrow}>ВАШ ЗАКАЗ</span>
              <Title level={3}>Итого</Title>
              <div className={styles.summaryLine}>
                <Text type="secondary">
                  Товары · {cartCount}{" "}
                  {pluralize(cartCount, ["товар", "товара", "товаров"])}
                </Text>
                <Text>{formatCurrency(cartPrice)}</Text>
              </div>
              <div className={styles.summaryLine}>
                <Text type="secondary">Оплата и доставка</Text>
                <Text className={styles.delivery}>Не выполняются</Text>
              </div>
              <div className={styles.summaryTotal}>
                <Text strong>Сумма заказа</Text>
                <Text strong>{formatCurrency(cartPrice)}</Text>
              </div>
              <Button
                type="primary"
                size="large"
                block
                className={styles.checkout}
                onClick={() => navigate("/checkout")}
              >
                Перейти к оформлению
              </Button>
              <div className={styles.secureNote}>
                <InfoCircleOutlined />
                <Text type="secondary">
                  Заказ сохранится в системе без оплаты и доставки.
                </Text>
              </div>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

export default Cart;

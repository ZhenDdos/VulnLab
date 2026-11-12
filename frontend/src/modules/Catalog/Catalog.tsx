import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  message,
  Row,
  Typography,
} from "antd";
import { useProducts } from "../../api/products/products.queries";
import type { Product } from "../../api/products/products";
import { ShoppingCartOutlined } from "@ant-design/icons";
import styles from "./Catalog.module.scss";
import { useAddToCartMutation } from "../../api/cart/cart.mutations";
import Loading from "../../components/Loading";
import { useSearchParams } from "react-router";

const { Text, Title } = Typography;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addToCartMutation = useAddToCartMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <div className={`${styles.productImage} ${styles[`tone${index % 3}`]}`}>
          <span className={styles.productNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={styles.productSymbol}>
            {product.name.slice(0, 1).toUpperCase()}
          </span>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          <span className={styles.imageCaption}>VULNLAB OBJECTS</span>
        </div>
      }
    >
      <div className={styles.productDetails}>
        <div className={styles.productCopy}>
          <Text className={styles.productName}>{product.name}</Text>
          <Text className={styles.productDescription} type="secondary">
            {product.description}
          </Text>
        </div>
        <div className={styles.productFooter}>
          <Text strong className={styles.price}>
            {formatPrice(product.price)}
          </Text>
          <Button
            type="primary"
            className={styles.addToCartButton}
            icon={<ShoppingCartOutlined />}
            loading={addToCartMutation.isPending}
            onClick={() =>
              addToCartMutation.mutate(product.id, {
                onSuccess: (data: { message: string }) => {
                  success(data.message);
                },
                onError: () => {
                  messageApi.error(
                    "Не удалось добавить товар. Попробуйте ещё раз.",
                  );
                },
              })
            }
          >
            В корзину
          </Button>
        </div>
      </div>
      {contextHolder}
    </Card>
  );
}

export function Catalog() {
  const [searchParams] = useSearchParams();
  const sort: string = searchParams.get("sortBy")?.toLowerCase() || "";
  const { data: products, isLoading, isError, error } = useProducts(sort);

  return (
    <main>
      <section className={styles.hero} id="about">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>ДЛЯ ТЕХ, КТО СМОТРИТ ГЛУБЖЕ</span>
          <Title className={styles.heroTitle}>
            Безопасность — это <span>образ мышления.</span>
          </Title>
          <Text className={styles.heroDescription}>
            Выбрали вещи для тех, кто строит, исследует и защищает цифровой мир.
          </Text>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualCircle}>
            <span className={styles.visualOrbit} />
            <span className={styles.visualCore}>V</span>
            <span className={styles.visualLabel}>
              THINK
              <br />
              SECURE
            </span>
          </div>
          <span className={styles.visualIndex}>№ 001 — 2025</span>
        </div>
      </section>

      <section className={styles.catalog} id="catalog">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>ПОДБОРКА VULNLAB</span>
            <Title level={2}>Вещи с характером</Title>
          </div>
          <Text type="secondary">Меньше шума. Больше смысла.</Text>
        </div>

        {isLoading ? (
          <Loading message="Загружаем каталог..." />
        ) : isError ? (
          <Alert
            className={styles.error}
            message="Не удалось загрузить каталог"
            description={
              error instanceof Error
                ? error.message
                : "Попробуйте обновить страницу."
            }
            type="error"
            showIcon
          />
        ) : products?.length ? (
          <Row gutter={[20, 28]}>
            {products.map((product, index) => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <ProductCard product={product} index={index} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            className={styles.empty}
            description="Пока здесь нет товаров"
          />
        )}
      </section>
    </main>
  );
}

export default Catalog;

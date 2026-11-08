import { useState } from "react";
import { Alert, Button, Form, Input, Typography } from "antd";
import type { FormProps } from "antd";
import { isAxiosError } from "axios";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Auth.module.scss";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../api/auth/auth.mutations";
import { authQueryKeys } from "../../api/auth/auth.queries";

type FieldType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const { Text, Title } = Typography;

export function Auth() {
  const [form] = Form.useForm<FieldType>();
  const [isRegistering, setIsRegistering] = useState(false);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const queryClient = useQueryClient();
  const activeError = isRegistering
    ? (loginMutation.error ?? registerMutation.error)
    : loginMutation.error;
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const credentials = { email: values.email, password: values.password };
    const handleLoginSuccess = (result: { userId: number }) => {
      queryClient.setQueryData(authQueryKeys.me, {
        userId: result.userId,
        email: credentials.email,
      });
    };

    if (isRegistering) {
      registerMutation.mutate(credentials, {
        onSuccess: () => {
          setIsRegistering(false);
        },
      });
      return;
    }

    loginMutation.mutate(credentials, { onSuccess: handleLoginSuccess });
  };

  const errorMessage = activeError
    ? isAxiosError<{ error?: string; message?: string }>(activeError)
      ? (activeError.response?.data?.error ??
        activeError.response?.data?.message ??
        "Не удалось связаться с сервером. Попробуйте ещё раз.")
      : "Произошла непредвиденная ошибка. Попробуйте ещё раз."
    : "";

  const toggleMode = () => {
    setIsRegistering((current) => !current);
    loginMutation.reset();
    registerMutation.reset();
    form.resetFields();
  };

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>V</span>
        VULNLAB
      </Link>

      <section className={styles.panel}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>СООБЩЕСТВО VULNLAB</span>
          <Title level={1}>
            {isRegistering ? (
              <>
                Начните с <span>чистого листа.</span>
              </>
            ) : (
              <>
                Хорошо, что вы <span>вернулись.</span>
              </>
            )}
          </Title>
          <Text className={styles.description}>
            Войдите в аккаунт, чтобы продолжить покупки и следить за своими
            заказами.
          </Text>
          <div className={styles.note}>
            <span className={styles.noteMark}>✳</span>
            <span>Инструменты и вещи для тех, кто думает о безопасности.</span>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <Title level={3}>
              {isRegistering ? "Создать аккаунт" : "Войти в аккаунт"}
            </Title>
            <Text type="secondary">
              {isRegistering
                ? "Заполните данные ниже, это займёт минуту."
                : "Введите данные, указанные при регистрации."}
            </Text>
          </div>

          {errorMessage && (
            <Alert
              className={styles.error}
              message={errorMessage}
              type="error"
              showIcon
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item<FieldType>
              label="Электронная почта"
              name="email"
              rules={[
                { required: true, message: "Введите электронную почту" },
                { type: "email", message: "Проверьте формат почты" },
              ]}
            >
              <Input placeholder="you@example.com" autoComplete="email" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Введите пароль" },
                ...(isRegistering
                  ? [
                      {
                        min: 6,
                        message: "Пароль должен содержать не менее 6 символов",
                      },
                    ]
                  : []),
              ]}
            >
              <Input.Password
                placeholder="Не менее 6 символов"
                autoComplete={
                  isRegistering ? "new-password" : "current-password"
                }
              />
            </Form.Item>
            {isRegistering && (
              <Form.Item<FieldType>
                label="Повторите пароль"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Повторите пароль" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      return !value || getFieldValue("password") === value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Пароли не совпадают"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Введите пароль ещё раз"
                  autoComplete="new-password"
                />
              </Form.Item>
            )}
            <Button
              className={styles.submit}
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending || registerMutation.isPending}
              block
            >
              {isRegistering ? "Создать аккаунт" : "Войти"}
            </Button>
          </Form>

          <div className={styles.switchMode}>
            <Text type="secondary">
              {isRegistering ? "Уже есть аккаунт?" : "Впервые у нас?"}
            </Text>
            <Button type="link" onClick={toggleMode}>
              {isRegistering ? "Войти" : "Создать аккаунт"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Auth;

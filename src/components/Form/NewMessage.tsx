import { Field, Form, Formik } from "formik";
import styles from "./styles.module.css";

type NewMessageFormProps = {
  socket: WebSocket | null;
};

type FormValues = {
  name: string;
  message: string;
};

function NewMessageForm({ socket }: NewMessageFormProps) {
  function handleSubmit(values: FormValues) {
    if (!socket) return;

    const socketPayload = JSON.stringify({
      action: "chat",
      message: values.message,
    });

    socket.send(socketPayload);
  }

  const formValuesInit: FormValues = {
    name: "",
    message: "",
  };

  return (
    <Formik initialValues={formValuesInit} onSubmit={handleSubmit}>
      <Form className={styles.formWrapper}>
        <label htmlFor="name">Name</label>
        <Field id="name" name="name" placeholder="Enter Name" />
        <label htmlFor="message">Message</label>
        <Field id="message" name="message" placeholder="Enter Message" />

        <div className={styles.submitArea}>
          <button className={styles.submitBtn} type="submit">
            Send Message
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NewMessageForm;

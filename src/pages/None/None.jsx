import { ContentHeader } from "../../components/ContentHeader/ContentHeader";
import styles from "./None.module.css";

export function None({ title }) {
  console.log(title);
  return (
    <div className={styles.container}>
      <ContentHeader title={title} />
      <div className={styles.content}></div>
    </div>
  );
}

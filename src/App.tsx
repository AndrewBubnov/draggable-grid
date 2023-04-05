import styles from './App.module.css';
import { DragContainer } from './components/DragContainer';
import { reset } from './store';

const App = () => (
	<div>
		<button onClick={reset}>Reset</button>
		<DragContainer className={styles.grid}>
			<div className={`${styles.item} ${styles.tall}`}>1</div>
			<div className={styles.item}>2</div>
			<div className={styles.item}>3</div>
			<div className={styles.item}>4</div>
			<div className={styles.item}>5</div>
			<div className={styles.item}>6</div>
			<div className={`${styles.item} ${styles.wide}`}>7</div>
			<div className={styles.item}>8</div>
			<div className={styles.item}>9</div>
			<div className={styles.item}>10</div>
			<div className={styles.item}>11</div>
			<div className={styles.item}>12</div>
			<div className={styles.item}>13</div>
		</DragContainer>
	</div>
);

export default App;

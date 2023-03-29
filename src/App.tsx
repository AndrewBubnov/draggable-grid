import styles from './App.module.css';
import { DragContainer } from './components/DragContainer';
import { nanoid } from 'nanoid';

const items = Array.from({ length: 15 }, (_, i) => (
	<div key={nanoid()} className={styles.item}>
		{i + 1}
	</div>
));

const App = () => <DragContainer className={styles.grid}>{items}</DragContainer>;

export default App;
